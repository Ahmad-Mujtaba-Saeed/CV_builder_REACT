import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { UserContext } from '../../context/UserContext';

const Subscription = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/plans');
                setPlans(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load subscription plans. Please try again later.');
                console.error('Error fetching plans:', err);
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

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

    const handleSubscribe = (planId) => {
        axios.get(`/api/stripe/create-subscription-session/${planId}`)
            .then(response => {
                window.location.href = response.data.checkoutUrl;
            })
            .catch(error => {
                console.error('Error creating subscription session:', error);
                setError('Failed to initiate subscription. Please try again.');
            });
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

    return (
        <Container className="py-5">
            <Row className="text-center mb-5">
                <Col>
                    <h1 className="display-4 fw-bold">Choose Your Plan</h1>
                    <p className="lead text-muted">Select the perfect plan for your needs</p>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            <Row className="justify-content-center">
                {plans.map((plan) => (
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
                                    {userData?.plan_id == plan.id && (
                                        <p className="text-success">Your Current Plan</p>
                                    )}
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
                                    <Button 
                                        variant={userData?.plan_id == plan.id ? 'outline-primary' : 'primary'} 
                                        className="w-100" 
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={userData?.plan_id === plan.id}
                                    >
                                        {userData?.plan_id == plan.id ? 'Current Plan' : 'Get Started'}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Subscription;