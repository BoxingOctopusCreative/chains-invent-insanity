import React from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

export const Controls = () => (
    <Form>
        <h2 className="section-title">Options</h2>
        <Form.Group className="mb-3" controlId="cards">
            <Form.Label>Number of Cards</Form.Label>
            <Form.Control type="number" placeholder="1" min="1" />
            <Form.Text className="text-muted">
                Number of cards to generate.
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="attempts">
            <Form.Label>Attempts</Form.Label>
            <Form.Control type="number" placeholder="10000" min="1000" />
            <Form.Text className="text-muted">
                Number of attempts to generate valid cards each time
            </Form.Text>
        </Form.Group>
        <Button variant="secondary" type="submit">
            Invent ALL THE INSANITY!!
        </Button>
    </Form>
)