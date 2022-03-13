import React from 'react';
import { Container, Row, Stack, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Title from './Title';
import { Styles } from './Styles';
import Navigation from './Navigation';
import { Footer } from './Footer';
import { Header } from './Header'

export const Layout = () => {
  return (
    <>
      <Title />
      <Styles>
        <div className="body">
          <Stack gap={3}>
            <Container fluid="xl">
              <Row>
                <Col>
                  <Navigation />
                </Col>
              </Row>
            </Container>
            {/* <Container fluid="xl">
              <Row></Row>
              <Row>
                <Col>
                  <Header />
                </Col>
              </Row>
            </Container> */}
            <Container fluid="xl">
            <div className="vertical-center">
              <Row>
                <Outlet />
              </Row>
            </div>
            </Container>
            <Container>
              <Row>
                <Footer />
              </Row>
            </Container>
          </Stack>
        </div>
      </Styles>
    </>
  );
};