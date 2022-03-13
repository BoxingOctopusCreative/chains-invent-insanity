import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Header } from '../Components/Header';
import { Controls } from '../Components/Controls';
import { Cards } from '../Components/Cards';
import axios from 'axios';
import ApiClient from '../Components/ApiClient';

export default class Home extends Component {
    render() {
      return(
        <Container fluid="xl">
          <Header />
          <Row>
            <Col xs={3}>
              <Controls />
            </Col>
            <Col>
              <Cards>
                jibby jabby
                {/* {post.answer} */}
              </Cards>
            </Col>
          </Row>
        </Container>
    );
    }
  }