import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

// Validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
});

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await axios.post('/api/login', values);
      localStorage.setItem('access_token', response.data.access_token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      setApiError(errorMessage);
      
      if (error.response?.data?.errors) {
        // Handle field-specific errors from the API
        Object.entries(error.response.data.errors).forEach(([field, message]) => {
          setFieldError(field, Array.isArray(message) ? message[0] : message);
        });
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="signin-card shadow-sm">
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="logo mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="170" height="45" viewBox="0 0 170 45" fill="none">
                  <path d="M131.849 29.3051C127.743 25.3073 121.147 27.0271 118.895 32.0999C116.256 38.0427 120.255 45.5179 127.168 44.9718C129.32 44.8019 130.189 43.9916 131.763 42.7894C131.849 42.7237 131.872 42.6233 132.021 42.6619L132.193 44.6307H136.143V18.9453H131.849L131.849 29.3051ZM126.751 41.0238C121.249 40.5641 121.234 31.4817 126.766 31.0431C133.532 30.5065 133.506 41.5882 126.751 41.0238Z" fill="#191E31" />
                  <path d="M64.6536 27.933L63.1531 28.9626V18.9453H58.8594V44.6307H63.1531V34.6562C63.1531 32.7089 64.7371 31.2214 66.6277 31.1002C69.2084 30.9348 70.4896 32.6612 70.5374 35.0851L70.5382 44.6307H74.8319L74.831 33.7153C74.4667 28.2665 69.5109 25.6137 64.6536 27.933Z" fill="#191E31" />
                  <path d="M153.272 28.8795C150.738 26.9195 147.059 26.5975 144.106 27.7842C136.906 30.6783 136.997 42.1391 144.579 44.4821C149.003 45.8492 154.737 44.5011 156.065 39.5799L152.086 38.8029C151.232 40.8563 149.165 41.3886 147.093 41.2048C145.01 41.0201 143.455 39.4133 143.27 37.3534H156.065C156.685 34.2729 155.815 30.8464 153.272 28.8795ZM143.442 34.0143C144.242 29.7356 151.07 29.4265 151.686 34.0143H143.442Z" fill="#191E31" />
                  <path d="M36.3785 27.2755C32.1086 26.5554 27.6941 28.0268 26.4883 32.517L30.6925 33.3297C31.2283 30.0217 37.1276 29.6312 37.642 33.1508C33.516 34.3337 25.7613 34.6795 26.6655 40.8124C27.3694 45.5868 34.2111 46.0807 37.2106 43.2096C37.375 43.0522 37.5493 42.7805 37.71 42.6002C37.7609 42.5432 37.705 42.4352 37.9059 42.491L38.0781 44.631H41.9424V33.0298C41.9424 30.0472 39.1345 27.7403 36.3785 27.2755ZM37.7346 37.6532C37.7346 38.4077 36.8901 39.7661 36.3151 40.2619C34.9397 41.448 31.0337 42.2708 31.0318 39.6224C31.0306 37.9288 32.9074 37.6531 34.1953 37.2922C35.3641 36.9647 36.5641 36.7315 37.7346 36.4117V37.6532Z" fill="#191E31" />
                  <path d="M106.966 27.3993C105.87 27.7069 104.852 28.3129 104.068 29.1334C103.861 29.1707 103.965 29.0385 103.943 28.9183C103.863 28.4711 103.814 28.0166 103.752 27.5662L103.64 27.4217H99.8184V44.631H104.198V34.0571C104.198 33.4495 104.927 32.3122 105.407 31.9238C107.727 30.0493 111.497 31.4077 111.497 34.5708V44.631H115.791L115.79 33.5443C115.457 28.8861 111.485 26.1317 106.966 27.3993Z" fill="#191E31" />
                  <path d="M168.305 27.1613C166.247 27.0242 164.332 27.8393 163.107 29.4764L162.849 27.4215H158.812V44.6308H163.192V34.9131C163.192 34.4168 163.742 33.2817 164.065 32.8729C165.267 31.3552 167.25 31.2622 169.024 31.6101L169.551 27.5517C169.502 27.2668 168.584 27.18 168.305 27.1613Z" fill="#191E31" />
                  <path d="M92.8393 19.735C91.0951 20.3273 90.6253 22.6677 91.8631 23.9664C93.1419 25.308 95.7839 24.7956 96.3253 22.9537C96.9672 20.7701 94.9739 19.0101 92.8393 19.735Z" fill="#BA67EF" />
                  <path d="M91.6611 27.4215H84.1906V24.6389C84.1906 24.5769 84.3422 24.0808 84.3811 23.9727C84.9788 22.3146 86.9489 22.2914 88.3942 22.7103L89.2541 19.0344C86.1031 18.0719 82.4158 18.6086 80.7111 21.6835C80.3261 22.3778 79.97 23.4223 79.8969 24.2108C79.8021 25.2329 79.9671 26.3853 79.8969 27.4215H74.5156C75.6282 28.4355 76.4489 29.7542 76.9162 31.2743H79.8969V44.6308H84.1906V31.2743H91.6611V44.6308H95.9548V27.4215H91.6611Z" fill="#191E31" />
                  <path d="M25.4046 23.7198C23.0728 16.0294 11.8806 15.1389 7.15923 21.0248C5.20332 23.4631 4.48266 26.72 4.66614 29.7979C4.28687 29.8581 3.07724 28.7149 2.86706 28.8598L0.555296 32.9394C0.530113 33.0519 0.615367 33.0755 0.684953 33.1256C1.17068 33.4752 2.04959 33.9221 2.60375 34.2095C3.54043 34.6952 4.50659 35.1287 5.50818 35.4668C6.181 38.1275 7.48212 42.1647 8.68245 44.6308H13.8778L10.8495 36.7342C11.8566 36.8423 12.8703 36.9035 13.8778 36.897V32.5291C12.4236 32.5544 10.9658 32.3473 9.74378 32.0135C9.32266 28.8581 9.37047 25.0083 12.0506 22.8194C14.0946 21.15 17.6706 21.0526 19.5784 22.979C20.838 24.2509 21.1815 26.2062 20.8581 27.919C20.3653 30.5287 18.3765 31.8199 16.0362 32.3011L17.5128 36.514C18.7644 36.2358 19.9786 35.791 21.1262 35.1214C25.14 32.7795 26.7456 28.1425 25.4046 23.7198Z" fill="#191E31" />
                  <path d="M36.5345 0C29.929 0 24.5742 5.34425 24.5742 11.9367C24.5742 18.5291 29.929 23.8734 36.5345 23.8734C43.1399 23.8734 48.4947 18.5292 48.4947 11.9367C48.4947 5.34423 43.1399 0 36.5345 0ZM37.8061 14.4705H36.4532V10.9748C36.4532 10.9265 36.3694 10.6834 36.3418 10.6271C36.0456 10.0237 34.9967 10.0788 34.7163 10.6727C34.6864 10.7361 34.6133 10.9165 34.6133 10.9748V14.4705H33.2604V11.1098C33.2604 10.9446 33.1716 10.6527 33.0709 10.5159C32.725 10.0457 31.8153 10.1229 31.534 10.6291C31.5053 10.6807 31.4204 10.8768 31.4204 10.9208V14.4705H30.0405V9.08518L30.0811 9.04469H31.2446C31.3052 9.06437 31.3295 9.4106 31.3405 9.48933C31.3458 9.52793 31.3149 9.56894 31.3795 9.55736C32.0968 8.68521 33.6537 8.74181 34.2482 9.71986C34.2879 9.72019 34.4753 9.48617 34.5317 9.4358C35.4498 8.61638 37.0544 8.81792 37.5942 9.97139C37.6651 10.1229 37.806 10.5507 37.806 10.7049L37.8061 14.4705ZM43.9752 9.39567L41.0936 16.846H39.7001L40.6154 14.4367L38.3202 9.04474H39.7948L41.3371 12.6892L42.6476 9.08346C42.6715 9.04869 42.7057 9.04845 42.7428 9.04346C43.1131 8.99393 43.5926 9.08289 43.9752 9.04472V9.39567Z" fill="#BA67EF" />
                  <path d="M56.5809 31.274V27.4212H50.7869V23.5684H46.6493V27.41H41.5195C42.7646 28.4064 43.7495 29.73 44.1844 31.274H46.4073V40.1354C46.4073 40.3316 46.5774 41.0363 46.6406 41.2727C47.7857 45.5482 53.1034 45.6326 56.4444 44.0204L55.5522 40.5212C55.4241 40.328 55.1614 40.5921 54.9931 40.6476C53.7156 41.0691 51.6595 41.3306 50.9805 39.8567C50.9475 39.7849 50.7869 39.3097 50.7869 39.2793V31.274H56.5809Z" fill="#191E31" />
                </svg>
              </div>
              <h4 className="mb-1 fw-semibold">Sign In</h4>
              <p className="text-muted small">Get access to your account</p>
            </div>

            <Button variant="light" className="w-100 mb-3 gap-2 d-flex align-items-center justify-content-center border google-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M10.3609 5.79453C10.3609 8.62344 8.42852 10.6156 5.57969 10.6156C2.83047 10.6156 0.639062 8.42422 0.639062 5.675C0.639062 2.9457 2.83047 0.734375 5.57969 0.734375C6.89453 0.734375 8.03008 1.23242 8.88672 2.0293L7.53203 3.32422C5.77891 1.63086 2.51172 2.90586 2.51172 5.675C2.51172 7.4082 3.88633 8.80273 5.57969 8.80273C7.53203 8.80273 8.26914 7.4082 8.36875 6.67109H5.57969V4.97773H10.2812C10.3211 5.23672 10.3609 5.47578 10.3609 5.79453ZM6.025 7.8C6.6 8.225 7.375 8.225 7.95 7.8L13.4 3.7V8.9C13.4 9.8 12.675 10.5 11.8 10.5H2.2C1.3 10.5 0.6 9.8 0.6 8.9V3.7L6.025 7.8Z" fill="#CC1B00" />
              </svg>
              <span>Sign in with google</span>
            </Button>

            <Button variant="light" className="w-100 mb-3 gap-2 d-flex align-items-center justify-content-center border facebook-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M10.4406 5.675C10.4406 8.14531 8.62773 10.1973 6.25703 10.5559V7.10938H7.4125L7.63164 5.675H6.25703V4.75859C6.25703 4.36016 6.45625 3.98164 7.07383 3.98164H7.69141V2.76641C7.69141 2.76641 7.13359 2.6668 6.57578 2.6668C5.46016 2.6668 4.72305 3.36406 4.72305 4.59922V5.675H3.46797V7.10938H4.72305V10.5559C2.35234 10.1973 0.559375 8.14531 0.559375 5.675C0.559375 2.9457 2.7707 0.734375 5.5 0.734375C8.2293 0.734375 10.4406 2.9457 10.4406 5.675Z" fill="#003CC7" />
              </svg>
              <span>Sign in with facebook</span>
            </Button>

            <div className="separator my-4">
              <span>or use email</span>
            </div>

            <Formik
              initialValues={{
                email: '',
                password: '',
                remember: false
              }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  {apiError && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="me-2" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      <div>{apiError}</div>
                    </div>
                  )}

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-muted small fw-semibold">EMAIL</Form.Label>
                    <div className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="input-icon-start" width="14" height="11" viewBox="0 0 14 11" fill="none">
                        <path d="M12.2 0.9C12.85 0.9 13.4 1.45 13.4 2.1C13.4 2.5 13.2 2.85 12.9 3.075L7.475 7.15C7.175 7.375 6.8 7.375 6.5 7.15L1.075 3.075C0.775 2.85 0.6 2.5 0.6 2.1C0.6 1.45 1.125 0.9 1.8 0.9H12.2ZM6.025 7.8C6.6 8.225 7.375 8.225 7.95 7.8L13.4 3.7V8.9C13.4 9.8 12.675 10.5 11.8 10.5H2.2C1.3 10.5 0.6 9.8 0.6 8.9V3.7L6.025 7.8Z" fill="#31374A" />
                      </svg>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        className={`ps-5 ${touched.email && errors.email ? 'is-invalid' : ''}`}
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                      />
                    </div>
                    {touched.email && errors.email && (
                      <div className="invalid-feedback d-block">{errors.email}</div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="text-muted small fw-semibold">PASSWORD</Form.Label>
                    <div className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="input-icon-start" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7.65 8.9L6.8 9.725C6.7 9.85 6.55 9.9 6.4 9.9H5.4V10.9C5.4 11.25 5.125 11.5 4.8 11.5H3.8V12.5C3.8 12.85 3.525 13.1 3.2 13.1H1.2C0.85 13.1 0.6 12.85 0.6 12.5V10.5C0.6 10.35 0.65 10.2 0.775 10.075L4.8 6.05C4.65 5.625 4.6 5.175 4.6 4.7C4.6 2.275 6.55 0.3 9 0.3C11.425 0.3 13.4 2.275 13.4 4.7C13.4 7.15 11.425 9.1 9 9.1C8.525 9.1 8.075 9.05 7.65 8.9ZM10 4.7C10.55 4.7 11 4.275 11 3.7C11 3.15 10.55 2.7 10 2.7C9.425 2.7 9 3.15 9 3.7C9 4.275 9.425 4.7 10 4.7Z" fill="#31374A" />
                      </svg>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        className={`ps-5 pe-5 ${touched.password && errors.password ? 'is-invalid' : ''}`}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                      />
                      <div 
                        className="input-icon-end" 
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer', padding: '0 10px' }}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={16} color="#525B75" />
                        ) : (
                          <FaEye size={16} color="#525B75" />
                        )}
                      </div>
                    </div>
                    {touched.password && errors.password && (
                      <div className="invalid-feedback d-block">{errors.password}</div>
                    )}
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="remember"
                      name="remember"
                      label="Remember me"
                      className="text-muted"
                      checked={values.remember}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <a href="/forgot-password" className="small text-decoration-none text-purple forget-password">
                      Forgot Password?
                    </a>
                  </div>

                  <Button 
                    type="submit" 
                    variant="dark" 
                    className="w-100 py-2 sign-in-btn d-flex align-items-center gap-2 justify-content-center"
                    disabled={isLoading || isSubmitting}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none">
                          <path d="M1.5 14.5C1.21875 14.5 0.96875 14.4062 0.78125 14.2188C0.375 13.8438 0.375 13.1875 0.78125 12.8125L6.0625 7.5L0.78125 2.21875C0.375 1.84375 0.375 1.1875 0.78125 0.8125C1.15625 0.40625 1.8125 0.40625 2.1875 0.8125L8.1875 6.8125C8.59375 7.1875 8.59375 7.84375 8.1875 8.21875L2.1875 14.2188C2 14.4062 1.75 14.5 1.5 14.5Z" fill="white" />
                      </svg>
                    </>
                  )}
                  </Button>

                  <div className="text-center mt-2 d-flex justify-content-center">
                    <a href="/register" className="small text-purple text-decoration-none" style={{ fontSize: '13px', fontWeight: '600' }}>Create an account</a>
                  </div>
                </Form>
              )}
            </Formik>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Signin;