import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class Instructions extends Component {

  state = {
    isOpen: false
  };

  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

  render() {
    return (
      <>
        <Modal show={this.state.isOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Instructions/Notes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-left">
              The markov chain generator will try numerous times to assemble what is meant to pass for a
              logical sentence. However, generally speaking, this value SHOULD be above 1000 to avoid an error,
              and the default value of 10000 should be fine enough, however if you start seeing duplicate cards,
              you may want to increase this number.
            </p>
            <p className="text-left">
              Additionally, you can pick the number of cards you'd like to generate.<br /><br />
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
};

// export const Instructions = () => (
//   <>
//     <h3>Instructions/Notes</h3>
//     <p className="text-left">
//       The markov chain generator will try numerous times to assemble what is meant to pass for a
//       logical sentence. However, generally speaking, this value SHOULD be above 1000 to avoid an error,
//       and the default value of 10000 should be fine enough, however if you start seeing duplicate cards,
//       you may want to increase this number.
//     </p>
//     <p className="text-left">
//       Additionally, you can pick the number of cards you'd like to generate.<br /><br />
//     </p>
//   </>
// );
