import React, { useState, useEffect , useRef } from 'react';
import { Container, Row, Col, Button, Card, Form, InputGroup, Spinner, Alert, Modal, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RevolutCheckout from "@revolut/checkout";
import axios from '../../../utils/axios';


const PlanManagement = () => {
    const containerRef = useRef(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    



    const initRevolutPay = async () => {
        try {
          // Initialize Revolut Pay with your static public API key
          const { revolutPay } = await RevolutCheckout.payments({
            locale: 'en',
            mode: 'sandbox', // Switch to 'production' for live
            publicToken: 'pk_HSkjhkcgVbq2HNgkJ5z51SKm21PNWBDBlqGM12utU6OzQ98d', // <-- IMPORTANT: Use your public key here
          });

          const paymentOptions = {
            currency: 'USD',
            totalAmount: 10000,
            customer: { email: 'customer@example.com' },
            savePaymentMethodForMerchant: true,
            // This function is called by the widget when the user clicks the button
            createOrder: async () => {
              const response = await axios.post('/api/subscription/create-order', {
                amount: 10000,
                email: 'customer@example.com',
              });

              console.log(response);
            //   if (!response.ok) {
            //     throw new Error(`Backend error: ${response.statusText}`);
            //   }
              
              const data = response.data;
              if (!data.token) {
                throw new Error('No token returned from backend');
              }
              // Return the token to the widget as publicId
              return { publicId: data.token };
            },
          };

          // Mount Revolut Pay widget
          revolutPay.mount(containerRef.current, paymentOptions);

          // Set up event listeners
          revolutPay.on('payment', async (event) => {
            switch (event.type) {
              case 'success':
                console.log('✅ Payment success:', event);
                // You can now confirm the payment status on your backend if needed
                // await confirmPaymentStatus(event.orderId);
                break;
              case 'error':
                console.error('❌ Payment failed:', event.error);
                break;
              case 'cancel':
                console.log('⚠️ Payment cancelled');
                break;
            }
          });
          
        } catch (error) {
          console.error('Error initializing Revolut Pay:', error);
          alert('Failed to initialize payment. Please try again.');
        }
      };
    
      // Optional: Poll backend to confirm payment status
      const confirmPaymentStatus = async (orderId) => {
        try {
          const response = await axios.get(`/api/subscription/order/${orderId}/payments`);
          const payments = response.data;
          console.log('Payment Status:', payments);
          // Check if payment is completed and update UI accordingly
          if (payments[0]?.state === 'completed') {
            console.log('Payment confirmed as completed');
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      };
      


    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/plans');
                setPlans(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load plans. Please try again later.');
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSubscribe = (plan) => {
        setCurrentPlan(plan);
        setShowSubscriptionModal(true);
    };

    const handleShowEditModal = (plan) => {
        setCurrentPlan(plan ? { ...plan } : { title: '', subdesc: '', price: 0, interval: 'monthly', features: [] });
        setIsEditing(!!plan);
        setShowEditModal(true);
    };


    const handleCloseModals = () => {
        setShowSubscriptionModal(false);
        setShowEditModal(false);
        setCurrentPlan(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentPlan(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...currentPlan.features];
        newFeatures[index] = value;
        setCurrentPlan(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setCurrentPlan(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const removeFeature = (index) => {
        const newFeatures = currentPlan.features.filter((_, i) => i !== index);
        setCurrentPlan(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSaveChanges = async () => {
        try {
            if (isEditing) {
                // Update existing plan
                const response = await axios.put(`/api/plans/${currentPlan.id}`, currentPlan);
                setPlans(plans.map(p => p.id === currentPlan.id ? response.data : p));
            } else {
                // Create new plan
                const response = await axios.post('/api/plans', currentPlan);
                setPlans([...plans, response.data]);
            }
            handleCloseModals();
        } catch (err) {
            setError('Failed to save plan. Please check the details and try again.');
        }
    };

    const handleDelete = async (planId) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            try {
                await axios.delete(`/api/plans/${planId}`);
                setPlans(plans.filter(p => p.id !== planId));
            } catch (err) {
                setError('Failed to delete plan.');
            }
        }
    };

    const confirmSubscription = () => {
        // Here you would typically process the subscription
        setShowSubscriptionModal(false);
        navigate('/payment', { state: { plan: currentPlan } });
    };

    const getIntervalText = (interval) => {
        switch (interval) {
            case 'monthly': return '/month';
            case 'quarterly': return '/quarter';
            case 'yearly': return '/year';
            case 'weekly': return '/week';
            case 'daily': return '/day';
            default: return '';
        }
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status" className="mb-3">
                    <span className="visually-hidden">Loading plans...</span>
                </Spinner>
                <p>Loading available plans...</p>
            </Container>
        );
    }


    const handleBuyNow = (planId) => {
        axios.get(`/api/stripe/create-subscription-session/${planId}`)
        .then(response => {
            window.location.href = response.data.checkoutUrl;
        })
        .catch(error => {
            console.error('Error creating subscription session:', error);
        });
    }


      

    return (
        <>
            <Container className="py-5">
                <Row className="text-center mb-5">
                    <Col>
                        <h1 className="display-4 fw-bold">Plan Management</h1>
                        
                        {/* <p className="lead text-muted">Add, edit, or remove subscription plans.</p> */}
                        <div ref={containerRef}></div>
                        {/* <button className="btn btn-primary" onClick={initRevolutPay}>Payment link</button> */}
                    </Col>
                </Row>

                {error && (
                    <Alert variant="danger" className="mb-4">
                        {error}
                    </Alert>
                )}

                <Row className="justify-content-center">
                    {plans.map((plan, index) => (
                        <Col key={plan.id} md={6} lg={4} className="mb-4">
                            <Card 
                                className={`h-100 shadow-sm ${plan.interval === 'monthly' ? 'border-primary' : ''}`}
                                style={plan.interval === 'monthly' ? { transform: 'scale(1.05)', zIndex: 1 } : {}}
                            >
                                {plan.interval === 'monthly' && (
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <Badge bg="primary">Most Popular</Badge>
                                    </div>
                                )}
                                <Card.Body className="d-flex flex-column p-4">
                                    <div className="text-center mb-4">
                                        <h3 className="card-title fw-bold">{plan.title}</h3>
                                        <p className="text-muted">{plan.subdesc}</p>
                                    </div>
                                    
                                    <div className="text-center my-4">
                                        <span className="display-4 fw-bold text-primary">
                                            £{plan.price}
                                        </span>
                                        <span className="text-muted">{getIntervalText(plan.interval)}</span>
                                    </div>
                                    
                                    <ul className="list-unstyled mt-3 mb-4 flex-grow-1">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="mb-2">
                                                <i className="fas fa-check text-success me-2"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <div className="mt-auto">
                                        
                                        <Button variant="primary" className="w-100 mb-2" onClick={() => handleBuyNow(plan.id)}>Buy Now</Button>
                                        <Button variant="secondary" className="w-100 mb-2" onClick={() => handleShowEditModal(plan)}>Edit</Button>
                                        {/* <Button variant="danger" className="w-100" onClick={() => handleDelete(plan.id)}>Delete</Button> */}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            <Modal show={showSubscriptionModal} onHide={handleCloseModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentPlan && (
                        <>
                            <p>You are about to subscribe to the <strong>{currentPlan.title}</strong> plan.</p>
                            <p>Price: <strong>£{currentPlan.price}{getIntervalText(currentPlan.interval)}</strong></p>
                            <p>Are you sure you want to proceed?</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmSubscription}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit/Create Modal */}
            <Modal show={showEditModal} onHide={handleCloseModals} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Plan' : 'Create New Plan'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentPlan && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" value={currentPlan.title} onChange={handleFormChange} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Sub-description</Form.Label>
                                <Form.Control as="textarea" rows={2} name="subdesc" value={currentPlan.subdesc} onChange={handleFormChange} />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price (£)</Form.Label>
                                        <Form.Control type="number" name="price" value={currentPlan.price} onChange={handleFormChange} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Interval</Form.Label>
                                        <Form.Select name="interval" value={currentPlan.interval} onChange={handleFormChange}>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="yearly">Yearly</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Features</Form.Label>
                                {currentPlan.features.map((feature, index) => (
                                    <InputGroup className="mb-2" key={index}>
                                        <Form.Control type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} />
                                        <Button variant="outline-danger" onClick={() => removeFeature(index)}>Remove</Button>
                                    </InputGroup>
                                ))}
                                <Button variant="outline-primary" onClick={addFeature}>Add Feature</Button>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PlanManagement;