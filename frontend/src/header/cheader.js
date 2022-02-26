// React Modules
import React from "react";
// Bootstrap Modules
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
// router Modules
import { Link } from "react-router-dom";
// Stylesheet
import "./cheader.css";

class Cheader extends React.Component {
    render(){
        this.logo = this.props.logo;
        return (
            <Navbar bg="dark" variant="dark" expand="md">
            <Container fluid>
                <Navbar.Brand href="/" className="Brand">Media Player</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto nav">
                    <Nav.Link><Link to="/" className="link" >Home</Link></Nav.Link>
                    <Nav.Link><Link to="/settings" className="link" >Settings</Link></Nav.Link>
                    <NavDropdown title="Help" id="basic-nav-dropdown">
                    <div className="dropdown">
                        <NavDropdown.Item>AboutUs</NavDropdown.Item>
                        <NavDropdown.Item>Help</NavDropdown.Item>
                        <NavDropdown.Item>About</NavDropdown.Item>
                    </div>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        );
    }
};

export default Cheader;
