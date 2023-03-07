import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function Controls() {

  const [formData, setFormData] = useState({
    card_type: '',
    num_cards: '',
    attempts: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const { card_type, num_cards, attempts } = formData;
    const url = `http://localhost:8000/api/v1/${card_type}?num_cards=${num_cards}&attempts=${attempts}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
  }

  return (
    <Form onSubmit={handleSubmit}>
    <h2 className="section-title">Options</h2>
    <Form.Group className="mb-3" controlId="cards">
        <Form.Label>Number of Cards</Form.Label>
        <Form.Control type="number" placeholder="1" min="1" onChange={handleChange} />
        <Form.Text className="text-muted">
            Number of cards to generate.
        </Form.Text>
    </Form.Group>
    <Form.Group className="mb-3" controlId="card_type">
      <Form.Select aria-label="Default select example" onChange={handleChange}>
        <option>Open this select menu</option>
        <option value="question">Question</option>
        <option value="answer">Answer</option>
      </Form.Select>
    </Form.Group>
    <Form.Group className="mb-3" controlId="attempts">
        <Form.Label>Attempts</Form.Label>
        <Form.Control type="number" placeholder="10000" min="1000" onChange={handleChange} />
        <Form.Text className="text-muted">
            Number of attempts to generate valid cards each time
        </Form.Text>
    </Form.Group>
    <Button variant="secondary" type="submit">
      Invent ALL THE INSANITY!!
    </Button>
  </Form>
  );
}

export default Controls;
