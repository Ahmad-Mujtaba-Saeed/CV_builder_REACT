import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Button, Modal, Alert, Spinner, Form } from 'react-bootstrap';
import { UserContext } from '../../../context/UserContext';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileSettings = () => {
  const { userData, setUserData } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('subscription');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      country: '',
      postal_code: ''
    }
  });

  useEffect(() => {
    fetchSubscriptionDetails();
    fetchPaymentMethods();
  }, []);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/subscription/details');
      setSubscription(response.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('/api/payment-methods');
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await axios.post('/api/subscription/cancel');
      setShowCancelModal(false);
      await fetchSubscriptionDetails();
      toast.success('Subscription has been cancelled successfully');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      setLoading(true);
      // This would typically redirect to Stripe's payment setup
      const response = await axios.post('/api/payment-methods/setup');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleBillingInfoUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/billing-info', billingInfo);
      toast.success('Billing information updated successfully');
    } catch (error) {
      console.error('Error updating billing info:', error);
      toast.error('Failed to update billing information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Profile Settings</h2>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col md={3}>
            <Card>
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="subscription">Subscription</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="billing">Billing Information</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="payment">Payment Methods</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="subscription">
                <Card>
                  <Card.Header>
                    <h5>Your Subscription</h5>
                  </Card.Header>
                  <Card.Body>
                    {loading ? (
                      <div className="text-center">
                        <Spinner animation="border" />
                      </div>
                    ) : subscription ? (
                      <>
                        <div className="mb-4">
                          <h4>{subscription.planName}</h4>
                          <p className="text-muted">
                            {subscription.amount} / {subscription.interval}
                          </p>
                          <p>
                            Status: <span className={`badge bg-${subscription.status === 'active' ? 'success' : 'warning'}`}>
                              {subscription.status}
                            </span>
                          </p>
                          <p>Next billing date: {formatDate(subscription.nextBillingDate)}</p>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-danger" 
                            onClick={() => setShowCancelModal(true)}
                            disabled={subscription.status !== 'active'}
                          >
                            Cancel Subscription
                          </Button>
                          <Button 
                            variant="outline-primary"
                            onClick={() => setShowUpdatePaymentModal(true)}
                          >
                            Update Payment Method
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p>No active subscription found.</p>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="billing">
                <Card>
                  <Card.Header>
                    <h5>Billing Information</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleBillingInfoUpdate}>
                      <Row className="mb-3">
                        <Form.Group as={Col} md={6} className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={billingInfo.name}
                            onChange={(e) => setBillingInfo({...billingInfo, name: e.target.value})}
                            required
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={6} className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control 
                            type="email" 
                            value={billingInfo.email}
                            onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Row>
                      
                      <h6 className="mb-3">Billing Address</h6>
                      <Row>
                        <Form.Group as={Col} md={12} className="mb-3">
                          <Form.Label>Address Line 1</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={billingInfo.address.line1}
                            onChange={(e) => setBillingInfo({
                              ...billingInfo, 
                              address: {...billingInfo.address, line1: e.target.value}
                            })}
                            required
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={6} className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={billingInfo.address.city}
                            onChange={(e) => setBillingInfo({
                              ...billingInfo, 
                              address: {...billingInfo.address, city: e.target.value}
                            })}
                            required
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={6} className="mb-3">
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={billingInfo.address.postal_code}
                            onChange={(e) => setBillingInfo({
                              ...billingInfo, 
                              address: {...billingInfo.address, postal_code: e.target.value}
                            })}
                            required
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={6} className="mb-3">
                          <Form.Label>Country</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={billingInfo.address.country}
                            onChange={(e) => setBillingInfo({
                              ...billingInfo, 
                              address: {...billingInfo.address, country: e.target.value}
                            })}
                            required
                          />
                        </Form.Group>
                      </Row>
                      
                      <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="payment">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Payment Methods</h5>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={handleUpdatePaymentMethod}
                      disabled={loading}
                    >
                      Add Payment Method
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {paymentMethods.length > 0 ? (
                      paymentMethods.map((method) => (
                        <Card key={method.id} className="mb-3">
                          <Card.Body className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">
                                {method.brand} ending in {method.last4}
                              </h6>
                              <p className="mb-0 text-muted">
                                Expires {method.exp_month}/{method.exp_year}
                              </p>
                            </div>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              disabled={method.isDefault || loading}
                            >
                              Remove
                            </Button>
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p>No payment methods found.</p>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Cancel Subscription Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Subscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.</p>
          <Alert variant="warning" className="mt-3">
            <strong>Note:</strong> You can reactivate your subscription anytime before the end of your billing period.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelSubscription} disabled={loading}>
            {loading ? 'Processing...' : 'Yes, Cancel Subscription'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Payment Method Modal */}
      <Modal show={showUpdatePaymentModal} onHide={() => setShowUpdatePaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You'll be redirected to a secure page to update your payment information.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdatePaymentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePaymentMethod} disabled={loading}>
            {loading ? 'Redirecting...' : 'Continue to Payment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfileSettings;