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

export default class CreateProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            newProductData: {
                name: "",
                description: "",
                stock: 0,
                price: 0
            }
        };
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    // Handle onSubmit event
    // @void
    handleOnSubmit(e) {
        e.preventDefault();
        const newProductForm = document.forms.newProduct;
        let { newProductData } = this.state;
        newProductData.name = newProductForm.name.value;
        newProductData.description = newProductForm.description.value;
        newProductData.stock = newProductForm.stock.value;
        newProductData.price = newProductForm.price.value;
        if (
            newProductData.name.trim() !== "" &&
            newProductData.description.trim() !== "" &&
            newProductData.stock.trim() !== "" &&
            newProductData.price.trim() !== ""
        ) {
            this.setState({ newProductData }, () => {
                this.addProduct();
                // console.log(this.state);
            });
        } else {
            toastr.error("Cannot create an empty product!", "Error!!!");
        }
    }

    // Reset new product Data
    // @void
    resetNewProductData() {
        let { newProductData } = this.state;
        newProductData.name = "";
        newProductData.description = "";
        newProductData.stock = 0;
        this.setState({ newProductData });
    }

    // Reset form Data
    // @void
    resetFormData() {
        const newProductForm = document.forms.newProduct;
        newProductForm.name.value = "";
        newProductForm.description.value = "";
        newProductForm.stock.value = "";
        newProductForm.price.value = "";
    }

    // Add product
    //  @void
    addProduct() {
        axios
            .post(
                "http://127.0.0.1:8000/api/products",
                this.state.newProductData
            )
            .then(response => {
                if (response.status === 200) {
                    this.resetNewProductData();
                    this.resetFormData();
                    toastr.success("Product created!", "Success!!!");
                }
            });
    }

    render() {
        return (
            <Card>
                <CardHeader className="bg-dark text-white">
                    <CardTitle>Add New Product</CardTitle>
                </CardHeader>
                <CardBody>
                    <Form
                        name="newProduct"
                        method="POST"
                        onSubmit={this.handleOnSubmit}
                        autoComplete="off"
                    >
                        <FormGroup>
                            <Label>Name</Label>
                            <Input
                                name="name"
                                maxLength="20"
                                placeholder="Product name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Description</Label>
                            <Input
                                name="description"
                                maxLength="50"
                                placeholder="Product Description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Stock</Label>
                            <Input
                                name="stock"
                                type="number"
                                min="1"
                                max="100"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Unit Price</Label>
                            <Input name="price" type="number" min="1" />
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
