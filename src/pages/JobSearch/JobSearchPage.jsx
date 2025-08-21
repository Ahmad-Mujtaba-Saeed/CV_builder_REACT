import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Partials/Footer';
import axios from '../../utils/axios';

const JobSearchPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('software developer');
    const [location, setLocation] = useState('New York');

    const [country, setCountry] = useState('us');

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
                        const response = await axios.get(`/api/fetch-jobs?q=${encodeURIComponent(searchQuery + ' job')}&gl=${country}&location=${encodeURIComponent(location)}`);
            setJobs(response.data.organic || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to fetch jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <>
            <Container className="py-4">
                <Row>
                    <Col>
                        <h1 className="mb-4">Job Search</h1>
                    </Col>
                </Row>

                {/* Search Form */}
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Form onSubmit={handleSearch}>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Job Title</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter job title"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Location</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter location"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={2} className="d-flex align-items-end">
                                            <Button variant="primary" type="submit" className="w-100">
                                                Search
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Loading State */}
                {loading && (
                    <Row className="justify-content-center my-5">
                        <Col md={6} className="text-center">
                            <Spinner animation="border" role="status" variant="primary" />
                            <p className="mt-2">Loading jobs...</p>
                        </Col>
                    </Row>
                )}

                {/* Error State */}
                {error && (
                    <Row className="my-4">
                        <Col>
                            <Alert variant="danger">{error}</Alert>
                        </Col>
                    </Row>
                )}

                {/* Results */}
                {!loading && !error && (
                    <>
                        <Row className="mb-3">
                            <Col>
                                <h4>Found {jobs.length} job results</h4>
                            </Col>
                        </Row>
                        
                        {jobs.length === 0 ? (
                            <Row>
                                <Col>
                                    <Alert variant="info">
                                        No jobs found. Try adjusting your search criteria.
                                    </Alert>
                                </Col>
                            </Row>
                        ) : (
                            <Row>
                                {jobs.map((job, index) => (
                                    <Col md={6} lg={4} key={index} className="mb-4">
                                        <Card className="h-100 job-card">
                                            <Card.Body>
                                                <Card.Title className="h6">{job.title}</Card.Title>
                                                {job.date && (
                                                    <Card.Subtitle className="mb-2 text-muted small">
                                                        {formatDate(job.date)}
                                                    </Card.Subtitle>
                                                )}
                                                <Card.Text className="text-truncate-3">
                                                    {job.snippet}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer className="bg-transparent">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">
                                                        Position: {job.position}
                                                    </small>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => window.open(job.link, '_blank')}
                                                    >
                                                        View Job
                                                    </Button>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </>
                )}
            </Container>
            
            <style>{`
                .text-truncate-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .job-card {
                    transition: transform 0.2s;
                }
                .job-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
            `}</style>
        </>
    );
};

export default JobSearchPage;