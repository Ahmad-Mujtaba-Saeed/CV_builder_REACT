import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; // Optional for additional styling

const Footer = () => {
    return (
        <footer className="bg-dark py-5 mt-auto">
            <Container>
                {/* Links Row */}
                <div className="d-flex justify-content-between flex-wrap gap-4">
                    <Row className="g-5 flex-shrink-0">
                        <Col xs="auto">
                            <a href="/about" className="text-light text-decoration-none">About</a>
                        </Col>
                        <Col xs="auto">
                            <a href="/news" className="text-light text-decoration-none">Latest News</a>
                        </Col>
                        <Col xs="auto">
                            <a href="/careers" className="text-light text-decoration-none">Careers</a>
                        </Col>
                        <Col xs="auto">
                            <a href="/login" className="text-light text-decoration-none">Login</a>
                        </Col>
                        <Col xs="auto">
                            <a href="/signup" className="text-light text-decoration-none">Sign Up</a>
                        </Col>
                        <Col xs="auto">
                            <a href="/support" className="text-light text-decoration-none">Support</a>
                        </Col>
                        <Col xs="auto">
                            <a href="/faq" className="text-light text-decoration-none">FAQ</a>
                        </Col>
                    </Row>

                    <Row className="g-5 flex-shrink-0 justify-content-end">
                        <Col xs="auto">
                            <a href="/" className="text-light text-decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                                    <path d="M13.2996 6.2C13.2996 9.3 11.0246 11.875 8.04961 12.325V8H9.49961L9.77461 6.2H8.04961V5.05C8.04961 4.55 8.29961 4.075 9.07461 4.075H9.84961V2.55C9.84961 2.55 9.14961 2.425 8.44961 2.425C7.04961 2.425 6.12461 3.3 6.12461 4.85V6.2H4.54961V8H6.12461V12.325C3.14961 11.875 0.899609 9.3 0.899609 6.2C0.899609 2.775 3.67461 -1.63913e-07 7.09961 -1.63913e-07C10.5246 -1.63913e-07 13.2996 2.775 13.2996 6.2Z" fill="#EFF2F6" />
                                </svg>
                            </a>
                        </Col>
                        <Col xs="auto">
                            <a href="/" className="text-light text-decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                                    <path d="M11.8758 2.6C11.8758 2.725 11.8758 2.825 11.8758 2.95C11.8758 6.425 9.25078 10.4 4.42578 10.4C2.92578 10.4 1.55078 9.975 0.400781 9.225C0.600781 9.25 0.800781 9.275 1.02578 9.275C2.25078 9.275 3.37578 8.85 4.27578 8.15C3.12578 8.125 2.15078 7.375 1.82578 6.325C2.00078 6.35 2.15078 6.375 2.32578 6.375C2.55078 6.375 2.80078 6.325 3.00078 6.275C1.80078 6.025 0.900781 4.975 0.900781 3.7V3.675C1.25078 3.875 1.67578 3.975 2.10078 4C1.37578 3.525 0.925781 2.725 0.925781 1.825C0.925781 1.325 1.05078 0.875 1.27578 0.5C2.57578 2.075 4.52578 3.125 6.70078 3.25C6.65078 3.05 6.62578 2.85 6.62578 2.65C6.62578 1.2 7.80078 0.0249999 9.25078 0.0249999C10.0008 0.0249999 10.6758 0.325 11.1758 0.85C11.7508 0.725 12.3258 0.5 12.8258 0.2C12.6258 0.825 12.2258 1.325 11.6758 1.65C12.2008 1.6 12.7258 1.45 13.1758 1.25C12.8258 1.775 12.3758 2.225 11.8758 2.6Z" fill="#EFF2F6" />
                                </svg>
                            </a>
                        </Col>
                        <Col xs="auto">
                            <a href="/" className="text-light text-decoration-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2.9 12H0.575V4.525H2.9V12ZM1.725 3.525C1 3.525 0.4 2.9 0.4 2.15C0.4 1.125 1.5 0.475 2.4 1C2.825 1.225 3.075 1.675 3.075 2.15C3.075 2.9 2.475 3.525 1.725 3.525ZM11.575 12H9.275V8.375C9.275 7.5 9.25 6.4 8.05 6.4C6.85 6.4 6.675 7.325 6.675 8.3V12H4.35V4.525H6.575V5.55H6.6C6.925 4.975 7.675 4.35 8.8 4.35C11.15 4.35 11.6 5.9 11.6 7.9V12H11.575Z" fill="#EFF2F6" />
                                </svg>
                            </a>
                        </Col>
                    </Row>

                </div>

                <hr />

                {/* Copyright Row */}
                <Row className="justify-content-between">
                    <Col xs="auto">
                        <span className="text-light small">Copyright © MyPathFinder</span>
                    </Col>
                    <Col xs="auto">
                        <span className="text-light small">Made with love by Vision Launch</span>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;