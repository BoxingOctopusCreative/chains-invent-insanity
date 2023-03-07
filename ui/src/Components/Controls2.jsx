// import React, { Component, useState, useEffect } from 'react';
// import { Form, Button } from 'react-bootstrap';
// import ApiClient from './ApiClient';
// import axios from 'axios';

// const baseUrl = `http://localhost:8000/api/v1/${card_type}?num_cards=${num_cards}&attempts=${attempts}`;

// export default class Controls extends Component {


//   saveState() {
//     const [cards, setCards] = useState('')
//   }

//   handleOnSubmit(event) {


//     event.preventDefault();

//     React.useEffect(() => {
//         axios.get(baseUrl).then((response) => {
//           saveState(response.data);
//         });
//       }, []);

//       if (!post) return null;
//       event.target.reset();
//   }

//   render() {
//     return(
//       <Form onSubmit={handleOnSubmit}>
//       <h2 className="section-title">Options</h2>
//       <Form.Group className="mb-3" controlId="cards">
//           <Form.Label>Number of Cards</Form.Label>
//           <Form.Control type="number" placeholder="1" min="1" />
//           <Form.Text className="text-muted">
//               Number of cards to generate.
//           </Form.Text>
//       </Form.Group>
//       <Form.Group className="mb-3" controlId="card_type">
//         <Form.Select aria-label="Default select example">
//           <option>Open this select menu</option>
//           <option value="1">One</option>
//           <option value="2">Two</option>
//         </Form.Select>
//       </Form.Group>
//       <Form.Group className="mb-3" controlId="attempts">
//           <Form.Label>Attempts</Form.Label>
//           <Form.Control type="number" placeholder="10000" min="1000" />
//           <Form.Text className="text-muted">
//               Number of attempts to generate valid cards each time
//           </Form.Text>
//       </Form.Group>
//       <Button variant="secondary" type="submit">
//         Invent ALL THE INSANITY!!
//       </Button>
//     </Form>
//     )
//   }
// }

// export const Controls = () => {

//   const saveState = () => {
//     const [cards, setCards] = useState('')
//   }

//   const handleOnSubmit = (event) => {
//     event.preventDefault();

//     useEffect(() => {
//         axios.get(baseUrl).then((response) => {
//           saveState(response.data);
//         });
//       }, []);

//       if (!post) return null;
//       event.target.reset();
//   }

//   return (
//     <Form>
//       <h2 className="section-title">Options</h2>
//       <Form.Group className="mb-3" controlId="cards">
//           <Form.Label>Number of Cards</Form.Label>
//           <Form.Control type="number" placeholder="1" min="1" />
//           <Form.Text className="text-muted">
//               Number of cards to generate.
//           </Form.Text>
//       </Form.Group>

//       <Form.Group className="mb-3" controlId="attempts">
//           <Form.Label>Attempts</Form.Label>
//           <Form.Control type="number" placeholder="10000" min="1000" />
//           <Form.Text className="text-muted">
//               Number of attempts to generate valid cards each time
//           </Form.Text>
//       </Form.Group>
//       <Button variant="secondary" type="submit">
//         Invent ALL THE INSANITY!!
//       </Button>
//     </Form>
//   )
// }
