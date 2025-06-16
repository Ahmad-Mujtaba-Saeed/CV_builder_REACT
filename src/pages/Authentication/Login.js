import React from 'react'
import { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Label, Form, Alert, Input, FormFeedback, Button } from 'reactstrap';
import logoDark from "../../assets/images/logo-light-eq.png";
import logoLight from "../../assets/images/logo-light-eq.png";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import withRouter from 'components/Common/withRouter';

// actions
import { loginUser, socialLogin } from "../../store/actions";

const Login = props => {
  document.title = "Login | Equity Circle - Admin Dashboard";

  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this  flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "" || '',
      password: "" || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
      const formData = {
        email: values.email,
        password: values.password,
      };
      axios.post(`${baseUrl}/api/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then((response) => {
          setLoader(false);
          console.log('Login successful:', response.data);
          // You can store the token in localStorage or a state management library
          localStorage.setItem('access_token', response.data.access_token);
          window.location.href = '/'
        })
        .catch((error) => {
          setLoader(false);
          console.error('Login failed:', error.response ? error.response.data : error.message);
        });
    }
  });


  const selectLoginState = (state) => state.Login;
  const LoginProperties = createSelector(
    selectLoginState,
    (login) => ({
      error: login.error
    })
  );

  const {
    error
  } = useSelector(LoginProperties);

  const signIn = type => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  //for facebook and google authentication
  const socialResponse = type => {
    signIn(type);
  };


  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <CardBody className="pt-0">

                  <h3 className="text-center mt-5 mb-4">
                    <Link to="/" className="d-block auth-logo">
                      <img src={logoDark} alt="" height="30" className="auth-logo-dark" />
                      <img src={logoLight} alt="" height="30" className="auth-logo-light" />
                    </Link>
                  </h3>

                  <div className="p-3">
                    <h4 className="text-muted font-size-18 mb-1 text-center">Welcome Back !</h4>
                    <p className="text-muted text-center">Sign in to continue to Equity Circle.</p>
                    <Form
                      className="form-horizontal mt-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}
                      <div className="mb-3">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label htmlFor="userpassword">Password</Label>
                        <div className="input-group">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                            className="form-control"
                          />
                          <div className="input-group-append">
                            <Button 
                              className="btn btn-light"
                              color="light"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{
                                padding: '0.5rem 0.75rem',
                                borderLeft: '1px solid #ced4da',
                                borderTopRightRadius: '0.25rem',
                                borderBottomRightRadius: '0.25rem'
                              }}
                            >
                              {showPassword ? <FaEyeSlash style={{ color: '#6c757d' }} /> : <FaEye style={{ color: '#6c757d' }} />}
                            </Button>
                          </div>
                        </div>
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>
                      <Row className="mb-3 mt-4">
                        <div className="col-6">
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="customControlInline" />
                            <label className="form-check-label" htmlFor="customControlInline">Remember me
                            </label>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Log In</button>
                        </div>
                      </Row>
                      <Row className="form-group mb-0">
                        <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock"></i> Forgot your password?</Link>
                        <div className="col-12 mt-4 d-flex justify-content-center">
                          <Link
                            to="#"
                            className="social-list-item bg-danger text-white border-danger"
                            onClick={e => {
                              e.preventDefault();
                              socialResponse("google");
                            }}
                          >
                            <i className="mdi mdi-google" />
                          </Link>
                        </div>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-5 text-center">
                <p>Don't have an account ? <Link to="/register" className="text-primary"> Signup Now </Link></p>
                © {new Date().getFullYear()} Equity Circle <span className="d-none d-sm-inline-block"> - Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand.</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

    </React.Fragment>
  )
}

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
