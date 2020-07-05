import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from "reactstrap";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default class Create extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            newSaleData: {
                product_id: "",
                customer_name: "",
                product_name: "",
                quantity: ""
            },
            updateProductData: {}
        };
        this.handleOnsubmit = this.handleOnsubmit.bind(this);
    }

    componentDidMount() {
        this.getProducts();
    }

    // Get products
    // @void
    getProducts() {
        axios.get("/api/products").then(response => {
            this.setState({ products: response.data });
        });
    }

    // Handle onSubmit
    // @void
    handleOnsubmit(e) {
        e.preventDefault();
        const newSaleForm = document.forms.newSale;
        const options = newSaleForm.product_name.options;
        let i = 0,
            id;

        for (i; i < options.length; i++) {
            if (options[i].selected) {
                id = options[i].dataset.product_id;
            }
        }
        let { newSaleData } = this.state;
        newSaleData.product_id = id;
        newSaleData.customer_name = newSaleForm.customer_name.value;
        newSaleData.product_name = newSaleForm.product_name.value;
        newSaleData.quantity = newSaleForm.quantity.value;
        if (
            newSaleData.customer_name.trim() !== "" &&
            newSaleData.product_name.trim() !== "" &&
            newSaleData.quantity.trim() !== ""
        ) {
            this.setState({ newSaleData }, () => {
                this.addSale();
                // console.log(this.state);
            });
        } else {
            toastr.error("Cannot create an empty sale!", "Error!!!");
        }
    }

    // Add sale
    // @void
    addSale() {
        const {
            product_id,
            customer_name,
            product_name,
            quantity
        } = this.state.newSaleData;

        // Get the selected Product details
        axios.get("/api/product/" + product_id).then(response => {
            if (response.status === 200) {
                this.setState({
                    updateProductData: response.data
                });
            }

            // Check stock
            if (parseInt(this.state.updateProductData.stock) === 0) {
                toastr.error("Out of stock!");
                return false;
            } else if (
                parseInt(this.state.updateProductData.stock) <
                parseInt(this.state.newSaleData.quantity)
            ) {
                toastr.warning(
                    "Not a enough stock " +
                        this.state.updateProductData.stock +
                        " left!"
                );
                return false;
            } else {
                // Subtract quantity from stock
                const { updateProductData } = this.state;
                updateProductData.stock =
                    updateProductData.stock - this.state.newSaleData.quantity;
                this.setState({
                    updateProductData
                });

                axios
                    .post("/api/sales", {
                        customer_name,
                        product_name,
                        quantity
                    })
                    .then(response => {
                        if (response.status === 200) {
                            //  Update product
                            const { stock } = this.state.updateProductData;
                            axios
                                .put("/api/product/" + product_id, {
                                    stock
                                })
                                .then(response => {
                                    if (response.status === 200) {
                                        this.resetNewSaleData();
                                        this.resetFormData();
                                        toastr.success(
                                            "Sale created!",
                                            "Success!!!"
                                        );
                                    }
                                });
                        }
                    });
            }
        });
    }

    // Reset new sale Data
    // @void
    resetNewSaleData() {
        let { newSaleData } = this.state;
        newSaleData.product_id = "";
        newSaleData.customer_name = "";
        newSaleData.product_name = "";
        newSaleData.quantity = "";
        this.setState({ newSaleData });
    }

    // Reset form Data
    // @void
    resetFormData() {
        const newSaleForm = document.forms.newSale;
        newSaleForm.customer_name.value = "";
        newSaleForm.product_name.value = "";
        newSaleForm.quantity.value = "";
    }

    // Render options
    // @return HTML
    renderOptions() {
        const products = this.state.products;
        // console.log(products);
        if (products.length > 0) {
            return products.map(product => (
                <option
                    key={product.id}
                    data-product_id={product.id}
                    value={product.name}
                >
                    {product.name}
                </option>
            ));
        } else {
            return <option className="alert alert-info">Loading...</option>;
        }
    }

    render() {
        return (
            <Card>
                <CardHeader className="bg-dark text-white">
                    <CardTitle className="text-uppercase">
                        Create New Sale
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Form
                        name="newSale"
                        method="POST"
                        autoComplete="off"
                        onSubmit={this.handleOnsubmit}
                    >
                        <FormGroup>
                            <Label>Customer Name</Label>
                            <Input
                                name="customer_name"
                                maxLength="20"
                                placeholder="Customer name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Product</Label>
                            <select
                                name="product_name"
                                className="form-control custom-select"
                            >
                                {this.renderOptions()}
                            </select>
                        </FormGroup>
                        <FormGroup>
                            <Label>Quantity</Label>
                            <Input
                                name="quantity"
                                type="number"
                                min="1"
                                max="100"
                            />
                        </FormGroup>
                        <Button color="success" className="float-right">
                            Add
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        );
    }
}
