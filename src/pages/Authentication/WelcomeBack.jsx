import React, { useRef, useEffect, useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap'; // Removed unused Row, Col
import './SignIn.css'; // Custom styles
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Signin = () => {

  const navigate = useNavigate();

  const GoBack = () => {
    navigate('/');
  };

  return (
    <div className="signin-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="signin-card welcomeCard shadow-sm">
          <Card.Body className="p-3">
            <div className="image-header d-flex flex-column align-items-center p-4">
              <img src="assets/images/Avaters.png" class='mb-4' alt="" />
              <h4 className="title text-center">Welcome back, <span className="fw-bolder">Scott</span></h4>
              <p className="content text-center">Enter your password to access your dashboard</p>
            </div>
            <div className="welcome-content mt-0">
              <Form.Group className="mb-3" controlId="formPassword">
                <div className="input-icon">
                  <Form.Control
                    name="password"
                    type={'password'}
                    placeholder="Enter Password"
                    className={`pe-5`}
                  />
                  <div
                    className="input-icon-end"
                    style={{ cursor: 'pointer' }}
                  >
                    <FiEye size={16} />
                  </div>
                </div>
              </Form.Group>
              <Button
                variant="dark"
                className="w-100 py-1 sign-in-btn d-flex align-items-center gap-2 justify-content-center"
                onClick={GoBack}
              >
                Sign In
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M0.9 11.3C0.675 11.3 0.475 11.225 0.325 11.075C2.23517e-08 10.775 2.23517e-08 10.25 0.325 9.95L4.55 5.7L0.325 1.475C2.23517e-08 1.175 2.23517e-08 0.65 0.325 0.35C0.625 0.0249998 1.15 0.0249998 1.45 0.35L6.25 5.15C6.575 5.45 6.575 5.975 6.25 6.275L1.45 11.075C1.3 11.225 1.1 11.3 0.9 11.3Z" fill="#fff" />
                </svg>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div >
  );
};

export default Signin;