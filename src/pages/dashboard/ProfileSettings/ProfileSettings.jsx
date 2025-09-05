import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Button, Modal, Alert, Spinner, Form } from 'react-bootstrap';
import { UserContext } from '../../../context/UserContext';
import axios , {stripe_public_key} from '../../../utils/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
// Initialize Stripe with your publishable key
const stripePromise = loadStripe(stripe_public_key);

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserContext);
  const stripe = useStripe();
  const elements = useElements();
  const [activeTab, setActiveTab] = useState('subscription');
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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
      const { subscription } = response.data;
      
      if (subscription) {
        setSubscription({
          id: subscription.id,
          planName: subscription.plan?.title || subscription.name,
          amount: `$${subscription.plan?.price || '0.00'}`,
          interval: subscription.plan?.interval || 'monthly',
          status: subscription.status,
          nextBillingDate: subscription.ends_at,
          features: subscription.plan?.features || [],
          subId: subscription.sub_id,
          cus_id: subscription.cus_id,
          subscriptionDetails: subscription
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('/api/subscription/payment-method');
      const paymentMethods = response.data.data.map(method => ({
        id: method.id,
        type: method.type,
        default: method.default,
        card: {
          brand: method.card.brand,
          last4: method.card.last4,
          expMonth: method.card.exp_month,
          expYear: method.card.exp_year,
          country: method.card.country
        },
        billing: {
          name: method.billing_details.name,
          email: method.billing_details.email,
          country: method.billing_details.address?.country
        },
        created: new Date(method.created * 1000).toISOString()
      }));
      setPaymentMethods(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    }
  };


  const [paymentMethodToRemove, setPaymentMethodToRemove] = useState(null);

  const handleRemovePaymentMethod = async () => {
    if (!paymentMethodToRemove) return;
    
    try {
      setLoading(true);
      await axios.delete(`/api/subscription/payment-method/${paymentMethodToRemove}`);
      await fetchPaymentMethods();
      toast.success('Payment method removed successfully');
      setPaymentMethodToRemove(null); // Reset the state
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast.error('Failed to remove payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    alert('handleAddPaymentMethod');
    try {
      setLoading(true);
      // Get the customer ID from the first subscription or user data
      const customerId = subscription?.cus_id;
      if (!customerId) {
        throw new Error('Customer ID not found');
      }
      
      // Get client secret for setup intent
      const response = await axios.get(`/api/subscription/payment-method-intent/${customerId}`);
      setClientSecret(response.data.clientSecret);
      setShowAddPaymentModal(true);
    } catch (error) {
      console.error('Error setting up payment method:', error);
      toast.error('Failed to set up payment method');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userData?.name || '',
            email: userData?.email || ''
          },
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Payment method added successfully');
      setShowAddPaymentModal(false);
      await axios.post(`/api/subscription/payment-method-default/${subscription?.cus_id}`, { payment_method_id: setupIntent.payment_method });
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast.error(error.message || 'Failed to add payment method');
    } finally {
      setIsProcessing(false);
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

  const handleUpdatePaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true);
      // Here you would typically update the default payment method
      await axios.post('/api/update-default-payment', { paymentMethodId });
      toast.success('Payment method updated successfully');
      await fetchPaymentMethods();
    } catch (error) {
      console.error('Error updating payment method:', error);
      toast.error('Failed to update payment method');
    } finally {
      setLoading(false);
    }
  };


  const handleMakeDefault = async (paymentMethodId) => {
    try {
      setLoading(true);
      await axios.post(`/api/subscription/payment-method-default/${subscription?.cus_id}`, { payment_method_id: paymentMethodId });
      toast.success('Payment method updated successfully');
      await fetchPaymentMethods();
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
                            onClick={() => navigate('/subscription')}
                          >
                            Upgrade Subscription
                          </Button>

                        </div>
                      </>
                    ) : (
                      <p>No active subscription found.</p>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
{/* 
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
              </Tab.Pane> */}

              <Tab.Pane eventKey="payment">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Payment Methods</h5>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={handleAddPaymentMethod}
                      disabled={loading}
                    >
                      Add Payment Method
                    </Button>
                  </Card.Header>
                  <Card.Body>
                  {paymentMethods.length > 0 ? (
  paymentMethods.map((method) => (
    <Card key={method.id} className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">
              <i className={`fab fa-cc-${method.card.brand} me-2`}></i>
              {method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} 
              ending in {method.card.last4}
              {method.default && (
                <span className="badge bg-success ms-2">
                  <i className="fas fa-check-circle me-1"></i> Default
                </span>
              )}
            </h6>
            <p className="mb-1 text-muted">
              Expires: {method.card.expMonth.toString().padStart(2, '0')}/{method.card.expYear.toString().slice(-2)}
            </p>
            <small className="text-muted">
              Added on {new Date(method.created).toLocaleDateString()}
            </small>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary disabled " 
              size="sm"
              onClick={() => handleUpdatePaymentMethod(method.id)}
            >
              Update
            </Button>
            <Button 
              variant={`outline-warning ${method.default ? 'disabled' : ''}`} 
              size="sm"
              onClick={() => handleMakeDefault(method.id)}
            >
              Make Default
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => setPaymentMethodToRemove(method.id)}
              disabled={paymentMethods.length <= 1}
            >
              Remove
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
))
) : (
  <div className="text-center py-4">
    <i className="fas fa-credit-card fa-3x text-muted mb-3"></i>
    <p>No payment methods found</p>
    <Button 
      variant="primary"
      onClick={handleAddPaymentMethod}
    >
      <i className="fas fa-plus me-2"></i> Add Payment Method
    </Button>
  </div>
)}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>



<Modal show={!!paymentMethodToRemove} onHide={() => setPaymentMethodToRemove(null)}>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Removal</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Are you sure you want to remove this payment method?
  </Modal.Body>
  <Modal.Footer>
    <Button 
      variant="secondary" 
      onClick={() => setPaymentMethodToRemove(null)}
      disabled={loading}
    >
      Cancel
    </Button>
    <Button 
      variant="danger" 
      onClick={handleRemovePaymentMethod}
      disabled={loading}
    >
      {loading ? 'Removing...' : 'Remove'}
    </Button>
  </Modal.Footer>
</Modal>



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

      {/* Add Payment Method Modal */}
      <Modal show={showAddPaymentModal} onHide={() => setShowAddPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePaymentSubmit}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
            <Button 
              type="submit" 
              className="mt-3"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Add Payment Method'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

// Wrap the component with Elements provider
const ProfileSettingsWrapper = () => (
  <Elements stripe={stripePromise}>
    <ProfileSettings />
  </Elements>
);

export default ProfileSettingsWrapper;