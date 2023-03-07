import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const FourOhFour = () => (
  <Container>
    <Row>
        <div className="vertical-center">
          <Col>
            <div className="cah_card_inverted">
              <p>
                What happens when you go to a page that doesn't exist?
              </p>
            </div>
          </Col>
          <Col>
            <div className="cah_card">
              <p>
                A Pithy 404 Error Message.
              </p>
            </div>
          </Col>
        </div>
    </Row>
  </Container>
)
