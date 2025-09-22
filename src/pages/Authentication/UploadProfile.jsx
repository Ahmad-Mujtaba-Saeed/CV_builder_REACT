import React, { useEffect , useState , useContext } from 'react';
import { Container, Row, Col, Form, Button, Card, } from 'react-bootstrap';
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from 'react-icons/fa';
import { FiEye } from 'react-icons/fi';
import './SignIn.css'; // Custom styles
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Partials/Header';
import Footer from '../../components/Partials/Footer';
import Select from 'react-select';
import { UserContext } from '../../context/UserContext';
import {Spinner} from 'react-bootstrap';

const Signin = () => {
  const navigate = useNavigate();
  const {userData , setUserData} = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [industries , setIndustries] = useState([]);
  const [roles , setRoles] = useState([]);
  const [educationLevels , setEducationLevels] = useState([]);
  const [loading , setLoading] = useState(false);


  const fetchIndustries = async () => {
    try {
      const response = await axios.get('/api/get-industries');
      setIndustries(response.data);
    } catch (error) {
      console.error('Failed to fetch industries:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/get-roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchEducationLevels = async () => {
    try {
      const response = await axios.get('/api/get-education-levels');
      setEducationLevels(response.data);
    } catch (error) {
      console.error('Failed to fetch education levels:', error);
    }
  };

  useEffect(() => {
    fetchIndustries();
    fetchRoles();
    fetchEducationLevels();
  }, []);

  const industryOptions = industries.map(industry => ({ value: industry.id, label: industry.name }));
  const roleOptions = roles.map(role => ({ value: role.id, label: role.name }));
  const educationOptions = educationLevels.map(edu => ({ value: edu.id, label: edu.name }));




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/upload-profile', formData);
      console.log(response.data);
      setLoading(false);
      setUserData(response.data);
      navigate('/');
    } catch (error) {
      setLoading(false);
      console.error('Upload profile failed:', error);
    }
  };

  return (
    <div className="upload-profile-page">
      <Header />
      <Container className="d-flex justify-content-center align-items-center min-vh-90">
        <Card className="signin-card upload-profile border-0">
          <div className="text-center mb-4">
            <h4 className="mb-1 fw-semibold">Let’s get to know you a bit first, Scott.</h4>
            <p className="text-muted small">Mypathfinder curates job opportunities that match your profile, allowing you to apply quickly and efficiently.</p>
          </div>
          <Card.Body className="border rounded">

            <Row className='g-3'>
              <Col>
                <Form.Group className="mb-2" controlId="formPassword">
                  <Form.Label className="text-muted small fw-semibold">YOUR LINKEDIN PROFILE</Form.Label>
                  <div className="input-icon">
                    <Form.Control name='url' type="url" placeholder="Paste here...." className="pe-5" defaultValue="" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="input-icon-end" width="20" height="18" viewBox="0 0 25 21" fill="none">
                      <path d="M6.71875 5.65625C8.90625 3.46875 12.5 3.46875 14.6875 5.65625C16.6406 7.60938 16.9141 10.6953 15.3125 12.9609L15.2734 13C14.8828 13.5859 14.1016 13.7031 13.5156 13.3125C12.9688 12.8828 12.8125 12.1016 13.2422 11.5547L13.2812 11.5156C14.1797 10.2266 14.0234 8.54688 12.9297 7.45312C11.7188 6.20312 9.72656 6.20312 8.47656 7.45312L4.10156 11.8281C2.85156 13.0391 2.85156 15.0312 4.10156 16.2812C5.19531 17.375 6.91406 17.4922 8.16406 16.6328L8.20312 16.5547C8.78906 16.1641 9.57031 16.2812 9.96094 16.8672C10.3516 17.4141 10.2344 18.1953 9.6875 18.625L9.60938 18.6641C7.34375 20.2656 4.29688 19.9922 2.34375 18.0391C0.117188 15.8516 0.117188 12.2578 2.34375 10.0703L6.71875 5.65625ZM18.2422 15.3438C16.0547 17.5703 12.4609 17.5703 10.2734 15.3438C8.32031 13.3906 8.04688 10.3438 9.64844 8.07812L9.6875 8.03906C10.0781 7.45312 10.8594 7.33594 11.4453 7.72656C11.9922 8.11719 12.1484 8.89844 11.7188 9.48438L11.6797 9.52344C10.7812 10.7734 10.9375 12.4922 12.0312 13.5859C13.2422 14.8359 15.2344 14.8359 16.4844 13.5859L20.8594 9.21094C22.1094 7.96094 22.1094 5.96875 20.8594 4.75781C19.7656 3.66406 18.0469 3.50781 16.7969 4.40625L16.7578 4.44531C16.1719 4.875 15.3906 4.71875 15 4.17188C14.6094 3.625 14.7266 2.84375 15.2734 2.41406L15.3516 2.375C17.6172 0.773438 20.6641 1.04688 22.6172 3C24.8438 5.1875 24.8438 8.78125 22.6172 10.9688L18.2422 15.3438Z" fill="#31374A" />
                    </svg>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="sub-card">
              <div className="separator mb-4">
                <span>or complete a short questionnaire</span>
              </div>

              <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formIndustry">
  <Form.Label className="text-muted small fw-semibold">Industry I am looking to work in:</Form.Label>
  <Select
    name="industry"
    options={industryOptions}
    placeholder="Select industry..."
    onChange={(selected) =>
      setFormData((prevData) => ({ ...prevData, industry_id: selected?.value }))
    }
  />
</Form.Group>

<Form.Group className="mb-3" controlId="formRole">
  <Form.Label className="text-muted small fw-semibold">Job Role I am looking to work in:</Form.Label>
  <Select
    name="role"
    options={roleOptions}
    placeholder="Select job role..."
    onChange={(selected) =>
      setFormData((prevData) => ({ ...prevData, role_id: selected?.value }))
    }
  />
</Form.Group>

<Form.Group className="mb-3" controlId="formEducation">
  <Form.Label className="text-muted small fw-semibold">Education Level:</Form.Label>
  <Select
    name="education"
    options={educationOptions}
    placeholder="Select education level..."
    onChange={(selected) =>
      setFormData((prevData) => ({ ...prevData, education_level_id: selected?.value }))
    }
  />
</Form.Group>


                <Button type="submit" variant="dark" className="w-100 py-2 sign-in-btn d-flex align-items-center gap-2 justify-content-center mt-3">
                  Continue
                  {loading ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>  
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none">
                      <path d="M1.5 14.5C1.21875 14.5 0.96875 14.4062 0.78125 14.2188C0.375 13.8438 0.375 13.1875 0.78125 12.8125L6.0625 7.5L0.78125 2.21875C0.375 1.84375 0.375 1.1875 0.78125 0.8125C1.15625 0.40625 1.8125 0.40625 2.1875 0.8125L8.1875 6.8125C8.59375 7.1875 8.59375 7.84375 8.1875 8.21875L2.1875 14.2188C2 14.4062 1.75 14.5 1.5 14.5Z" fill="white" />
                    </svg>
                  )}
                </Button>

              </Form>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
};

export default Signin;