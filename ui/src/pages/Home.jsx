import React from 'react';
import { Container, Row, Col, Stack } from 'react-bootstrap';
import { Header } from './Components/Header';
import { Explainer } from './Components/Explainer';
import { Instructions } from './Components/Instructions';
import { Footer } from './Components/Footer';
import { Controls } from './Components/Controls';
import { Cards } from './Components/Cards';
import Title from './Components/Title';
import { Styles } from './Components/Styles';
import Navigation from './Components/Navigation';
import axios from 'axios';

export default function App() {

  const baseUrl = `http://localhost:8000/api/v1/answer?num_cards=1&attempts=10000`;

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
          <Stack gap={3}>
          <Container fluid="xxl">
              <Row>
                <Navigation />
              </Row>
            </Container>
            <Container fluid="xl">
              <Header />
              <Row>
                <Col>
                  <Explainer />
                </Col>
                <Col xs={3}>
                  <Controls />
                </Col>
                <Col>
                  <Cards>
                    {post.answer}
                  </Cards>
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
            </Stack>
          </div>
        </Styles>
      </>
    );
};