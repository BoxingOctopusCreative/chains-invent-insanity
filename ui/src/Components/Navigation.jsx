import React, { Component } from 'react';

import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';

export default class Navigation extends Component {
    render() {
        return (
            <Container fluid="xxl">
                <Row>
                    <Col></Col>
                    <Col>
                        <Navbar fixed="top">
                            <Container>
                                <Navbar.Brand href="/">
                                    <img 
                                        src="https://chains-invent-insanity-assets.sfo3.digitaloceanspaces.com/images/Icon%20Black.png" 
                                        className='navbar-brand-logo' 
                                        alt="Chains Invent Insanity" 
                                    />
                                </Navbar.Brand>
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="ml-auto">
                                        <Nav.Link href="/">Home</Nav.Link>
                                        <Nav.Link href="/about">About</Nav.Link>
                                        <Nav.Link href="/instructions">Instructions</Nav.Link>
                                        <Nav.Link href="/instructions">Invent</Nav.Link>
                                        <Nav.Link href="/api">API</Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    </Col>
                </Row>
            </Container>
        );
    }
};