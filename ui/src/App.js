import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Header } from './Components/Header';
import { Explainer } from './Components/Explainer';
import { Instructions } from './Components/Instructions';
import { Footer } from './Components/Footer';
import { Controls } from './Components/Controls';
import { Cards } from './Components/Cards';
import Title from './Components/Title';
import styled from 'styled-components';
import axios from 'axios';

const Styles = styled.div`
    .body {
      background-color: black;
      color: white;
    }

    .container {
      background-color: black;
      color: white;
    }

    .jumbotron {
      background-color: lightgray;
      color: black;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      padding: 20px;
      padding-left: 50px;
      border-radius: 10px;
    }

    .h1 {
        font-weight: bold;
    }

    .h3 {
      font-weight: bold;
    }

    hr {
      background-color: lightgray;
      color: lightgray;
    }

    .section-title {
      padding-top: 25px;
    }

    .page-footer {
      background-color: black;
      color: gray;
    }

    .img-fluid {
      height: 70px;
      padding: 10px;
    }

    .cah_card {
      position: relative;
      float: left;
      width: 225px;
      height: 315px;
      padding: 1em;
      margin: .5em;
      background: white;
      border: .1em black solid;
      border-radius: 1em;
    }
    
    .cah_card p {
      color: black;
      font-weight: 700;
      font-size: 16px;
      font-family: "Helvetica";
      line-height: 1.6em;
      margin-top: 0;
    }
    
    .cah_card .cahlogo {
      position: absolute;
      bottom: 0.05em;
      left: 0em;
    }
`

const baseUrl = 'http://localhost:8000/api/v1/answer';

export default function App() {

  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseUrl).then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!post) return null;

    return(
      <>
        <Title />
        <Styles>
          <div className="body">
            <Container fluid="xl">
              <Header />
              <Row>
                <Col xs={3}>
                  <Controls />
                </Col>
                <Col>
                  <Cards>
                    {post.answer}
                  </Cards>
                </Col>
                <Col>
                  <Explainer />
                </Col>
              </Row>
              <Row><hr /></Row>
              <Row>
                <Col>
                  <Instructions />
                </Col>
              </Row>
              <Footer />
            </Container>
          </div>
        </Styles>
      </>
    );
};