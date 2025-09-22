import React, { useRef, useEffect, useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap'; // Removed unused Row, Col
import './SignIn.css'; // Custom styles
import { useNavigate } from 'react-router-dom';

const Signin = () => {

  const navigate = useNavigate();

  const GoBack = () => {
    navigate('/');
  };

  return (
    <div className="signin-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="signin-card lockCard shadow-sm">
          <Card.Body className="p-3">
            <div className="image-header">
              <img src="assets/images/lock-screen.png" alt="" />
            </div>
            <div className="lock-content">
              <h4 className="title text-center">Come back soon!</h4>
              <p className="content text-center">Thanks for using Mypathfinder. You are now successfully signed out.</p>
              <Button
                variant="dark"
                className="w-100 py-1 mt-5 sign-in-btn d-flex align-items-center gap-2 justify-content-center"
                onClick={GoBack}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path d="M6.1 11.3C5.875 11.3 5.675 11.225 5.525 11.075L0.725 6.275C0.4 5.975 0.4 5.45 0.725 5.15L5.525 0.35C5.825 0.0249998 6.35 0.0249998 6.65 0.35C6.975 0.65 6.975 1.175 6.65 1.475L2.425 5.7L6.65 9.95C6.975 10.25 6.975 10.775 6.65 11.075C6.5 11.225 6.3 11.3 6.1 11.3Z" fill="white" />
                </svg>
                Go to login page
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div >
  );
};

export default Signin;