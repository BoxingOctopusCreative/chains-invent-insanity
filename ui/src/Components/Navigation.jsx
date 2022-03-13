import React, { Component } from 'react';
import { Navbar, Nav, Container, Row, Col, Modal, Button } from 'react-bootstrap';

export default class Navigation extends Component {

  state = {
    isOpen: false
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <>
        <Modal 
          aria-labelledby="contained-modal-title-vcenter"
          centered 
          show={this.state.isOpen} 
          onHide={this.closeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title><h3>Instructions/Notes</h3></Modal.Title>
          </Modal.Header>
            <Modal.Body>
              <p>
                The markov chain generator will try numerous times to assemble what is meant to pass for a
                logical sentence. However, generally speaking, this value SHOULD be above 1000 to avoid an error,
                and the default value of 10000 should be fine enough, however if you start seeing duplicate cards,
                you may want to increase this number.
              </p>
              <p>
                Additionally, you can pick the number of cards you'd like to generate.
              </p>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

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
                      <Nav.Link href="/about">Why??</Nav.Link>
                      <Nav.Link onClick={this.openModal}>Instructions</Nav.Link>
                      <Nav.Link href="/invent">Invent</Nav.Link>
                      <Nav.Link href="http://localhost:8000/apidocs" target="_blank">API</Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
};