import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Header } from '../Components/Header';
import { Explainer } from '../Components/Explainer';
import Controls from '../Components/Controls';
import { Cards } from '../Components/Cards';

export default class Home extends Component {
  render() {
    return(
      <Container fluid="xl">
        <Row>
          <Col>
            <Header />
          </Col>
        </Row>
        <Row>
          <Col>
            <Explainer />
          </Col>
          <Col xs={3}>
            <Controls />
          </Col>
          <Col>
            <Cards>
              jibby jabby
              {formData}
            </Cards>
          </Col>
        </Row>
      </Container>
  );
  }
}

// export default function Home() {

//   // const baseUrl = `http://localhost:8000/api/v1/answer?num_cards=1&attempts=10000`;

//   // const [post, setPost] = React.useState(null);

//   // React.useEffect(() => {
//   //     axios.get(baseUrl).then((response) => {
//   //       setPost(response.data);
//   //     });
//   //   }, []);

//   //   if (!post) return null;

// };
