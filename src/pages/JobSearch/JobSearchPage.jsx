import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, InputGroup, Spinner, Alert, Modal, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Partials/Footer';
import axios from '../../utils/axios';

const JobSearchPage = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('software developer');
    const [location, setLocation] = useState('New York');
    const [country, setCountry] = useState('us');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchJobs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/fetch-jobs?q=${encodeURIComponent(searchQuery + ' job')}&gl=${country}&location=${encodeURIComponent(location)}`);
            setJobs(response.data.data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to fetch jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedJob(null);
    };

    const formatSalary = (job) => {
        if (job.job_min_salary && job.job_max_salary) {
            return `$${job.job_min_salary.toLocaleString()} - $${job.job_max_salary.toLocaleString()} ${job.job_salary_period?.toLowerCase() || 'year'}`;
        }
        return 'Salary not specified';
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
                                        <Col md={3}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Country</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter country"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
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
                        
                        {jobs.length === 0 ? (
                            <Row>
                                <Col>
                                    <Alert variant="info">
                                        Please try searching again!
                                    </Alert>
                                </Col>
                            </Row>
                        ) : (
                            <Row>
                                {jobs.map((job, index) => (
                                    <Col md={6} lg={4} key={index} className="mb-4">
                                        <Card className="h-100 job-card">
                                            <Card.Body>
                                                <Card.Title className="h6">{job.job_title}</Card.Title>
                                                <div className="d-flex align-items-center mb-2">
                                                    {job.employer_logo && (
                                                        <img 
                                                            src={job.employer_logo} 
                                                            alt={job.employer_name}
                                                            className="me-2"
                                                            style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                                        />
                                                    )}
                                                    <Card.Subtitle className="text-muted small">
                                                        {job.employer_name}
                                                    </Card.Subtitle>
                                                </div>
                                                <div className="mb-2">
                                                    <Badge bg="secondary" className="me-1">
                                                        {job.job_employment_type}
                                                    </Badge>
                                                    {job.job_is_remote && (
                                                        <Badge bg="success">Remote</Badge>
                                                    )}
                                                </div>
                                                <Card.Text className="text-truncate-3">
                                                    {job.job_description}
                                                </Card.Text>
                                                {job.job_posted_at && (
                                                    <small className="text-muted">
                                                        Posted: {job.job_posted_at}
                                                    </small>
                                                )}
                                            </Card.Body>
                                            <Card.Footer className="bg-transparent">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">
                                                        {job.job_location}
                                                    </small>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => handleJobClick(job)}
                                                    >
                                                        View Details
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

            {/* Job Details Modal */}
            <Modal show={showModal} style={{ zIndex: 1050 }} onHide={handleCloseModal} size="lg" centered>
                {selectedJob && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedJob.job_title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <h5>{selectedJob.employer_name}</h5>
                                <div className="d-flex flex-wrap gap-2 mb-2">
                                    <Badge bg="primary">{selectedJob.job_employment_type}</Badge>
                                    {selectedJob.job_is_remote && (
                                        <Badge bg="success">Remote</Badge>
                                    )}
                                    <Badge bg="info">{selectedJob.job_location}</Badge>
                                </div>
                                {selectedJob.job_posted_at && (
                                    <p className="text-muted">Posted: {selectedJob.job_posted_at}</p>
                                )}
                                {(selectedJob.job_min_salary || selectedJob.job_max_salary) && (
                                    <p className="fw-bold">{formatSalary(selectedJob)}</p>
                                )}
                            </div>

                            <div className="mb-3">
                                <h6>Job Description</h6>
                                <p>{selectedJob.job_description}</p>
                            </div>

                            {selectedJob.job_highlights && Object.keys(selectedJob.job_highlights).length > 0 && (
                                <div className="mb-3">
                                    <h6>Highlights</h6>
                                    {Object.entries(selectedJob.job_highlights).map(([key, values]) => (
                                        <div key={key} className="mb-2">
                                            <strong>{key}:</strong>
                                            <ul className="mb-1">
                                                {values.map((value, i) => (
                                                    <li key={i}>{value}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mb-3">
                                <h6>Apply Options</h6>
                                <div className="d-grid gap-2">
                                    {selectedJob.apply_options && selectedJob.apply_options.map((option, index) => (
                                        <Button 
                                            key={index}
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => window.open(option.apply_link, '_blank')}
                                        >
                                            Apply via {option.publisher}
                                        </Button>
                                    ))}
                                    {selectedJob.job_apply_link && (
                                        <Button 
                                            variant="primary"
                                            onClick={() => window.open(selectedJob.job_apply_link, '_blank')}
                                        >
                                            Apply Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
            
            <style>{`
                .text-truncate-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .job-card {
                    transition: transform 0.2s;
                    cursor: pointer;
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