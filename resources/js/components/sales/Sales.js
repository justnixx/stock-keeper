import React from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input
} from "reactstrap";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default class Sales extends React.Component {
    constructor() {
        super();
        this.state = {
            sales: [],
            products: [],
            editSaleData: {
                id: "",
                customer_name: "",
                product_name: "",
                quantity: ""
            },
            editSaleModal: false
        };
        this.toggleEditSaleModal = this.toggleEditSaleModal.bind(this);
        this.updateSale = this.updateSale.bind(this);
    }

    componentDidMount() {
        this.getSales();
        this.getProducts();
    }

    // Get products
    // @void
    getProducts() {
        axios.get("/api/products").then(response => {
            this.setState({ products: response.data });
        });
    }

    // Get sales
    // @void
    getSales() {
        axios.get("/api/sales").then(response => {
            this.setState({ sales: response.data });
        });
    }

    // Format date
    // @return string
    formatDate(dateTime) {
        let date = new Date(dateTime);
        let options = {
            day: "numeric",
            month: "long",
            year: "numeric"
        };
        return date.toLocaleDateString("en-US", options);
    }

    // Edit sale Modal toggle
    // @void
    toggleEditSaleModal() {
        this.setState(state => {
            return (state.editSaleModal = !state.editSaleModal);
        });
    }

    // Edit Sale
    // @void
    editSale(id, customer_name, product_name, quantity) {
        const { editSaleData } = this.state;
        editSaleData.id = id;
        editSaleData.customer_name = customer_name;
        editSaleData.product_name = product_name;
        editSaleData.quantity = quantity;
        this.setState({ editSaleData });
        this.toggleEditSaleModal();
    }

    // Update sale
    // @void
    updateSale(e) {
        e.preventDefault();
        const {
            id,
            customer_name,
            product_name,
            quantity
        } = this.state.editSaleData;
        axios
            .put("/api/sale/" + id, {
                customer_name,
                product_name,
                quantity
            })
            .then(response => {
                if (response.status === 200) {
                    this.resetEditSaleData();
                    this.getSales();
                    toastr.success("Sale edited!", "Success!!!");
                    this.toggleEditSaleModal();
                }
            });
    }

    // Reset edit sale data
    // @void
    resetEditSaleData() {
        const { editSaleData } = this.state;
        editSaleData.id = "";
        editSaleData.customer_name = "";
        editSaleData.product_name = "";
        editSaleData.quantity = "";
        this.setState({ editSaleData });
    }

    // Delete sale
    // @void
    deleteSale(id) {
        axios.delete("/api/sale/" + id).then(response => {
            if (response.status === 200) {
                this.getSales();
                toastr.success("Sale deleted!", "Success!!!");
            }
        });
    }

    // Render options
    // @return HTML
    renderOptions() {
        const products = this.state.products;
        // console.log(products);
        if (products.length > 0) {
            return products.map(product =>
                product.name.toLowerCase() ===
                this.state.editSaleData.product_name.toLowerCase() ? (
                    <option
                        key={product.id}
                        data-product_id={product.id}
                        value="DEFAULT"
                    >
                        {product.name}
                    </option>
                ) : (
                    <option
                        key={product.id}
                        data-product_id={product.id}
                        value={product.name}
                    >
                        {product.name}
                    </option>
                )
            );
        } else {
            return <option className="alert alert-info">Loading...</option>;
        }
    }

    // Render sales
    // @return HTML
    renderSales() {
        const sales = this.state.sales;
        if (sales.length > 0) {
            return sales.map(sale => (
                <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{sale.customer_name}</td>
                    <td>{sale.product_name}</td>
                    <td>{sale.quantity}</td>
                    <td>{this.formatDate(sale.created_at)}</td>
                    <td>
                        <Button
                            color="success"
                            size="sm"
                            className="mr-2"
                            onClick={this.editSale.bind(
                                this,
                                sale.id,
                                sale.customer_name,
                                sale.product_name,
                                sale.quantity
                            )}
                        >
                            Edit
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={this.deleteSale.bind(this, sale.id)}
                        >
                            Delete
                        </Button>
                    </td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td>
                        <p className="alert alert-info">Loading...</p>
                    </td>
                </tr>
            );
        }
    }

    render() {
        return (
            <Card>
                <CardHeader className="bg-dark text-white">
                    <CardTitle className="text-uppercase">Sales</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="table-responsive-lg">
                        <Table className="table table-striped table-bordered table-light">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer Name</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Purchased</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderSales()}</tbody>
                        </Table>
                    </div>
                </CardBody>
                <Modal
                    isOpen={this.state.editSaleModal}
                    toggle={this.toggleEditSaleModal}
                >
                    <ModalHeader className="bg-dark text-white">
                        Edit Sale
                    </ModalHeader>
                    <Form name="editSale" method="POST" autoComplete="off">
                        <ModalBody>
                            <FormGroup>
                                <Label>Customer Name</Label>
                                <Input
                                    name="customer_name"
                                    maxLength="20"
                                    placeholder="Customer name"
                                    value={
                                        this.state.editSaleData.customer_name
                                    }
                                    onChange={e => {
                                        const { editSaleData } = this.state;
                                        editSaleData.customer_name =
                                            e.target.value;
                                        this.setState({ editSaleData });
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Product</Label>
                                <select
                                    defaultValue="DEFAULT"
                                    name="product_name"
                                    className="form-control custom-select"
                                    onChange={e => {
                                        const { editSaleData } = this.state;
                                        editSaleData.product_name =
                                            e.target.value;
                                        this.setState({ editSaleData });
                                    }}
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
                                    value={this.state.editSaleData.quantity}
                                    onChange={e => {
                                        const { editSaleData } = this.state;
                                        editSaleData.quantity = e.target.value;
                                        this.setState({ editSaleData });
                                    }}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={this.updateSale}>
                                Update
                            </Button>
                            <Button
                                color="danger"
                                type="button"
                                onClick={this.toggleEditSaleModal}
                            >
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </Card>
        );
    }
}
