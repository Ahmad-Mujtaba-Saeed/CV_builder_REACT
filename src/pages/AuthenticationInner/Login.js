import React from "react"
// Redux
import { Link } from "react-router-dom"

import { Row, Col, CardBody, Card, Container, Input, Form } from "reactstrap"

// import images
import logoLightPng from "../../assets/images/logo-light.png"
import logoDark from "../../assets/images/logo-dark.png"

const Login = () => {
  document.title = "Login | Equity Circle - Responsive Bootstrap 5 Admin Dashboard";

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
                      <img src={logoLightPng} alt="" height="30" className="auth-logo-light" />
                    </Link>
                  </h3>
                  <div className="p-3">
                    <h4 className="text-muted font-size-18 mb-1 text-center">Welcome Back !</h4>
                    <p className="text-muted text-center">Sign in to continue to Equity Circle.</p>
                    <Form
                      className="form-horizontal mt-4"
                    >

                      <div className="mb-3">
                        <Input
                          name="email"
                          label="Email"
                          defaultValue=""
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <Input
                          name="password"
                          label="Password"
                          defaultValue=""
                          type="password"
                          required
                          placeholder="Enter Password"
                        />
                      </div>

                      <div className="mb-3 row mt-4">
                        <div className="col-6">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="customControlInline"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="customControlInline"
                            >
                              Remember me
                            </label>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Log In</button>
                        </div>
                      </div>
                      <div className="form-group mb-0 row">
                        <div className="col-12 mt-4">
                          <Link to="/page-recoverpw" className="text-muted"><i className="mdi mdi-lock"></i> Forgot your password?</Link>
                        </div>
                      </div>

                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Don&#39;t have an account ?{" "}
                  <Link
                    to="/pages-register"
                    className="text-primary"
                  >
                    {" "}
                    Signup now{" "}
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Equity Circle
                  <span className="d-none d-sm-inline-block"> - Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand.</span>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Login
