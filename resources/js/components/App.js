import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import Products from "./products/Products";
import CreateProduct from "./products/Create";
import Sales from "./sales/Sales";
import CreateSale from "./sales/Create";

class App extends Component {
    constructor() {
        super();
        this.state = {
            components: {
                showProducts: true,
                showCreateProduct: false,
                showSales: false,
                showCreateSale: false
            }
        };
    }

    renderProductsComponent() {
        const { components } = this.state;
        components.showCreateProduct = false;
        components.showSales = false;
        components.showCreateSale = false;
        components.showProducts = true;
        this.setState({ components });
    }

    renderCreateProductComponent() {
        const { components } = this.state;
        components.showProducts = false;
        components.showSales = false;
        components.showCreateSale = false;
        components.showCreateProduct = true;
        this.setState({ components });
    }

    renderSalesComponent() {
        const { components } = this.state;
        components.showProducts = false;
        components.showCreateProduct = false;
        components.showCreateSale = false;
        components.showSales = true;
        this.setState({ components });
    }

    renderCreateSaleComponent() {
        const { components } = this.state;
        components.showProducts = false;
        components.showSales = false;
        components.showCreateProduct = false;
        components.showCreateSale = true;
        this.setState({ components });
    }

    // Reset app-tab class
    resetTabClassName() {
        const tabs = Array.from(document.querySelectorAll(".app-tab"));
        tabs.forEach(tab => {
            tab.classList.remove("tab-active");
        });
    }

    render() {
        return (
            <Container className="py-4 app-container">
                <Row>
                    <Col xs="5" md="3" lg="3" className="left-pane">
                        <ListGroup>
                            <ListGroupItem
                                tag="button"
                                className="app-tab tab-active"
                                onClick={e => {
                                    this.resetTabClassName();
                                    e.currentTarget.classList.add("tab-active");
                                    this.renderProductsComponent();
                                }}
                            >
                                Products
                            </ListGroupItem>
                            <ListGroupItem
                                tag="button"
                                className="app-tab"
                                onClick={e => {
                                    this.resetTabClassName();
                                    e.currentTarget.classList.add("tab-active");
                                    this.renderCreateProductComponent();
                                }}
                            >
                                Add Product
                            </ListGroupItem>
                            <ListGroupItem
                                tag="button"
                                className="app-tab"
                                onClick={e => {
                                    this.resetTabClassName();
                                    e.currentTarget.classList.add("tab-active");
                                    this.renderSalesComponent();
                                }}
                            >
                                Sales
                            </ListGroupItem>
                            <ListGroupItem
                                tag="button"
                                className="app-tab"
                                onClick={e => {
                                    this.resetTabClassName();
                                    e.currentTarget.classList.add("tab-active");
                                    this.renderCreateSaleComponent();
                                }}
                            >
                                Create Sale
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col xs="7" md="9" lg="9" className="main">
                        {this.state.components.showProducts && <Products />}
                        {this.state.components.showCreateProduct && (
                            <CreateProduct />
                        )}
                        {this.state.components.showSales && <Sales />}
                        {this.state.components.showCreateSale && <CreateSale />}
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default App;

if (document.getElementById("root")) {
    ReactDOM.render(<App />, document.getElementById("root"));
}
