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

export default class Products extends React.Component {
    constructor() {
        super();
        this.state = {
            products: [],
            editProductModal: false,
            editProductData: {
                id: "",
                name: "",
                description: "",
                stock: "",
                price: ""
            }
        };
        this.toggleEditProductModal = this.toggleEditProductModal.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
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

    // Edit modal Toggle
    // @void
    toggleEditProductModal() {
        this.setState(state => {
            return (state.editProductModal = !this.state.editProductModal);
            // console.log(state.editProductModal);
        });
    }

    // Edit product
    // @void
    editProduct(id, name, description, stock, price) {
        const { editProductData } = this.state;
        editProductData.id = id;
        editProductData.name = name;
        editProductData.description = description;
        editProductData.stock = stock;
        editProductData.price = price;
        this.setState({ editProductData });
        this.toggleEditProductModal();
    }

    // Update product
    // @void
    updateProduct(e) {
        e.preventDefault();
        const {
            id,
            name,
            description,
            stock,
            price
        } = this.state.editProductData;
        if (id !== "" && name !== "" && description !== "" && stock !== "") {
            axios
                .put("/api/product/" + id, {
                    name,
                    description,
                    stock,
                    price
                })
                .then(response => {
                    if (response.status === 200) {
                        this.resetEditProductData();
                        this.toggleEditProductModal();
                        toastr.success("Product updated!", "Success!!!");
                        this.getProducts();
                    }
                });
        } else {
            toastr.error("You cannot update with empty values!", "Error!!!");
        }
    }

    // Delete product
    // @void
    deleteProduct(id) {
        axios.delete("/api/product/" + id).then(response => {
            if (response.status === 200) {
                this.getProducts();
                toastr.success("Product deleted!", "Success!!!");
            }
        });
    }

    // Reset edit product Data
    // @void
    resetEditProductData() {
        let { editProductData } = this.state;
        editProductData.id = "";
        editProductData.name = "";
        editProductData.description = "";
        editProductData.stock = 0;
        editProductData.price = 0;
        this.setState({ editProductData });
    }

    // Render products
    // @return HTML
    renderProducts() {
        const products = this.state.products;
        if (products.length > 0) {
            return products.map(product => (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.stock}</td>
                    <td>{product.price.toFixed(2)}</td>
                    <td>
                        <Button
                            color="success"
                            size="sm"
                            className="mr-2"
                            onClick={this.editProduct.bind(
                                this,
                                product.id,
                                product.name,
                                product.description,
                                product.stock,
                                product.price
                            )}
                        >
                            Edit
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={this.deleteProduct.bind(this, product.id)}
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
                    <CardTitle className="text-uppercase">Products</CardTitle>
                </CardHeader>
                <CardBody>
                    <div className="table-responsive-lg">
                        <Table className="table table-striped table-bordered table-light">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Stock</th>
                                    <th>Unit Price</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>{this.renderProducts()}</tbody>
                        </Table>
                    </div>
                </CardBody>
                <Modal
                    isOpen={this.state.editProductModal}
                    toggle={this.toggleEditProductModal}
                >
                    <ModalHeader className="bg-dark text-white">
                        Edit Product
                    </ModalHeader>
                    <Form name="editProduct" method="POST" autoComplete="off">
                        <ModalBody>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input
                                    name="name"
                                    maxLength="20"
                                    value={this.state.editProductData.name}
                                    placeholder="Product name"
                                    onChange={e => {
                                        const { editProductData } = this.state;
                                        editProductData.name = e.target.value;
                                        this.setState({
                                            editProductData
                                        });
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input
                                    name="description"
                                    maxLength="50"
                                    value={
                                        this.state.editProductData.description
                                    }
                                    placeholder="Product Description"
                                    onChange={e => {
                                        const { editProductData } = this.state;
                                        editProductData.description =
                                            e.target.value;
                                        this.setState({
                                            editProductData
                                        });
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Stock</Label>
                                <Input
                                    name="stock"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={this.state.editProductData.stock}
                                    onChange={e => {
                                        const { editProductData } = this.state;
                                        editProductData.stock = e.target.value;
                                        this.setState({
                                            editProductData
                                        });
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Unit Price</Label>
                                <Input
                                    name="price"
                                    type="number"
                                    min="1"
                                    value={this.state.editProductData.price}
                                    onChange={e => {
                                        const { editProductData } = this.state;
                                        editProductData.price = e.target.value;
                                        this.setState({
                                            editProductData
                                        });
                                    }}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="success"
                                onClick={this.updateProduct}
                            >
                                Update
                            </Button>

                            <Button
                                type="button"
                                color="danger"
                                onClick={this.toggleEditProductModal}
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
