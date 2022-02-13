import React from 'react';
import { Container, Row, Col, Stack } from 'react-bootstrap';
import { Header } from './Components/Header';
import { Explainer } from './Components/Explainer';
import { Instructions } from './Components/Instructions';
import { Footer } from './Components/Footer';
import Title from './Components/Title';
import Navigation from './Components/Navigation';

export default function Layout() {

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
                            <Row>
                                <Outlet />
                            </Row>
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