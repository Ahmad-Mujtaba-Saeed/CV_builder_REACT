import React from 'react';
import { Container, Row, Col, Form, Button, Card, } from 'react-bootstrap';
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import './SignIn.css'; // Custom styles
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../../components/Partials/Header';
import Footer from '../../components/Partials/Footer';

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', formData);
      console.log(response.data);
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="upload-profile-page">
      <Header />
      <Container className="d-flex justify-content-center align-items-center min-vh-90">
        <Card className="signin-card link-vacancy border-0">
          <div className="text-center mb-2">
            <h4 className="mb-1 fw-semibold">Do you have a vacancy in mind?</h4>
            <p className="text-muted small">MyPathfinder curates job opportunities that match your profile, allowing you to apply quickly and efficiently.</p>
          </div>
          <Card.Body>
            <div className="vacancy-image">
              <img src="assets/images/link-vacancy-image.png" alt="" />
              <h4 className="sub-heading">Please paste a link to your vacancy link below (optional)</h4>
            </div>
            <div className="link-card border rounded p-3">
              <Row className='g-3'>
                <Col>
                  <Form.Group className="mb-2" controlId="formPassword">
                    <Form.Label className="text-muted small fw-semibold">VACANCY LINK</Form.Label>
                    <div className="input-icon">
                      <Form.Control name='url' type="url" placeholder="Paste here...." className="pe-5" defaultValue="" />
                      <svg xmlns="http://www.w3.org/2000/svg" className="input-icon-end" width="20" height="18" viewBox="0 0 25 21" fill="none">
                        <path d="M6.71875 5.65625C8.90625 3.46875 12.5 3.46875 14.6875 5.65625C16.6406 7.60938 16.9141 10.6953 15.3125 12.9609L15.2734 13C14.8828 13.5859 14.1016 13.7031 13.5156 13.3125C12.9688 12.8828 12.8125 12.1016 13.2422 11.5547L13.2812 11.5156C14.1797 10.2266 14.0234 8.54688 12.9297 7.45312C11.7188 6.20312 9.72656 6.20312 8.47656 7.45312L4.10156 11.8281C2.85156 13.0391 2.85156 15.0312 4.10156 16.2812C5.19531 17.375 6.91406 17.4922 8.16406 16.6328L8.20312 16.5547C8.78906 16.1641 9.57031 16.2812 9.96094 16.8672C10.3516 17.4141 10.2344 18.1953 9.6875 18.625L9.60938 18.6641C7.34375 20.2656 4.29688 19.9922 2.34375 18.0391C0.117188 15.8516 0.117188 12.2578 2.34375 10.0703L6.71875 5.65625ZM18.2422 15.3438C16.0547 17.5703 12.4609 17.5703 10.2734 15.3438C8.32031 13.3906 8.04688 10.3438 9.64844 8.07812L9.6875 8.03906C10.0781 7.45312 10.8594 7.33594 11.4453 7.72656C11.9922 8.11719 12.1484 8.89844 11.7188 9.48438L11.6797 9.52344C10.7812 10.7734 10.9375 12.4922 12.0312 13.5859C13.2422 14.8359 15.2344 14.8359 16.4844 13.5859L20.8594 9.21094C22.1094 7.96094 22.1094 5.96875 20.8594 4.75781C19.7656 3.66406 18.0469 3.50781 16.7969 4.40625L16.7578 4.44531C16.1719 4.875 15.3906 4.71875 15 4.17188C14.6094 3.625 14.7266 2.84375 15.2734 2.41406L15.3516 2.375C17.6172 0.773438 20.6641 1.04688 22.6172 3C24.8438 5.1875 24.8438 8.78125 22.6172 10.9688L18.2422 15.3438Z" fill="#31374A" />
                      </svg>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <Button
                  variant='secondary'
                  className="d-flex align-items-center gap-2 cv-build-from-scratch-btn custom-button"
                >
                  Build from scratch
                </Button>
                <Button
                  variant='primary'
                  className="d-flex align-items-center gap-2 cv-with-ai-btn custom-button"
                >
                  Build my CV with AI
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
};

export default Signin;