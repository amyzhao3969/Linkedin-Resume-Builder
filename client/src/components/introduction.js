import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import slide_1 from '../slide1.png';
import slide_2 from '../slide2.png';
import "./style.css";
import { Carousel, Container, Col, Row, Image } from 'react-bootstrap/'


export default class Introduction extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    <Container fluid="md">
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <h2>Create Your Resume in 2 Steps</h2>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className='content'>
                    <p className="text-center">We've made it easy for you to generate a resume based on the content 
                        of your Linkedin profile.</p>
                <div className="carousel">
                    <Carousel style={{width: 500, height: 'auto'}}>
                    <Carousel.Item style={{width: 500, height: 'auto'}} interval={1000}>
                        <img
                        className="d-block w-100"
                        src={slide_1}
                        alt="First slide"
                        />
                        <Carousel.Caption>
                        <h3>Step 1</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item style={{width: 500, height: 'auto'}} interval={1000}>
                        <img
                        className="d-block w-100"
                        src={slide_2}
                        alt="Second slide"
                        />

                        <Carousel.Caption>
                        <h3>Step 2</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    </Carousel>
                </div>
                </div>
            </div>

        );
    }
}