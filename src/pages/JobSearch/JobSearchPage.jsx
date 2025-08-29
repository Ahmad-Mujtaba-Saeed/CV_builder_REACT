import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  InputGroup,
  Spinner,
  Alert,
  Modal,
  Badge,
} from "react-bootstrap";
import { FaSearch,FaArrowRight  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Partials/Footer";
import axios from "../../utils/axios";
const JobSearchPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("software developer");
  const [location, setLocation] = useState("New York");
  const [country, setCountry] = useState("us");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [salaryRange, setSalaryRange] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showSalaryFilter, setShowSalaryFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const jobss = [
    {
      id: 1,
      title: "Team Developer",
      location: "Manchester",
      date: "01/08/2025",
      salary: "£53,000+",
    },
    {
      id: 2,
      title: "Team Leader",
      location: "Stockport",
      date: "01/08/2025",
      salary: "£60,000+",
    },
  ];
  const filteredJobss = jobss.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/fetch-jobs?q=${encodeURIComponent(
          searchQuery + " job"
        )}&gl=${country}&location=${encodeURIComponent(location)}`
      );
      const jobsData = response.data.data || [];
      setJobs(jobsData);
      setFilteredJobs(jobsData); // Initialize filtered jobs with all jobs
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to fetch jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    if (!job.job_min_salary && !job.job_max_salary) {
      return "Salary not specified";
    }

    // Convert to yearly amounts if needed
    const period = job.job_salary_period?.toLowerCase() || "year";

    const convertToYearly = (amount, period) => {
      if (!amount) return 0;
      switch (period) {
        case "hour" || "hourly" || "hr" || "hrly":
          return amount * 40 * 52; // 40 hours/week * 52 weeks
        case "week" || "weekly" || "wk" || "wkl":
          return amount * 52; // 52 weeks/year
        case "month" || "monthly" || "mnth" || "mnthly":
          return amount * 12; // 12 months/year
        case "year" || "yearly" || "yr" || "yrly":
        default:
          return amount;
      }
    };

    const minYearly = job.job_min_salary
      ? convertToYearly(job.job_min_salary, period)
      : 0;
    const maxYearly = job.job_max_salary
      ? convertToYearly(job.job_max_salary, period)
      : 0;

    // Format the display string
    if (minYearly && maxYearly) {
      return `$${Math.round(minYearly).toLocaleString()} - $${Math.round(
        maxYearly
      ).toLocaleString()}/year`;
    } else if (minYearly) {
      return `From $${Math.round(minYearly).toLocaleString()}/year`;
    } else if (maxYearly) {
      return `Up to $${Math.round(maxYearly).toLocaleString()}/year`;
    }

    return "Salary not specified";
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
          <Col className="col-4">
            <Card className="mb-3">
                <Card.Body>
                    <div className="flex items-center justify-between p-0 bg-white rounded-2xl shadow-md relative w-80">
                        {/* Left section: Avatar + Info */}
                        <div className="flex items-center space-x-4">
                        {/* Avatar */}
                        <div className="d-flex gap-3 space-x-4">
                            <img
                            width={50}
                            height={50}
                            style={{ borderRadius: "25px" }}
                            src="/assets/images/2.jpg" // replace with real image
                            alt="Profile"
                            className="w-12 h-12 rounded-full"
                            />

                            {/* Name & Role */}
                            <div className="mt-1">
                            <h6 className="fw-bold text-gray-900 mb-0">
                                Alex Dobricic
                            </h6>
                            <p className="text-sm text-gray-500">
                                Senior Software Developer
                            </p>

                            {/* Skills */}
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {["SKILL 1", "SKILL 2", "SKILL 3", "SKILL 4"].map(
                            (skill, index) => (
                                <span
                                style={{ fontSize: "11px" }}
                                key={index}
                                className="px-2 py-0 text-xs font-medium text-gray-600 border rounded-md"
                                >
                                {skill}
                                </span>
                            )
                            )}
                        </div>
                        </div>

                        {/* Online dot */}
                        <span className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSearch}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "11px", marginLeft: "-8px" }}
                        >
                          Industry
                        </Form.Label>
                        <Form.Select
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          required
                          style={{ fontSize: "14px" }}
                        >
                          <option value="">Tech</option>
                          <option value="frontend">Frontend Developer</option>
                          <option value="backend">Backend Developer</option>
                          <option value="fullstack">
                            Full Stack Developer
                          </option>
                          <option value="designer">UI/UX Designer</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "11px", marginLeft: "-8px" }}
                        >
                          Location
                        </Form.Label>
                        <Form.Select
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          required
                          style={{ fontSize: "14px" }}
                        >
                          <option value="">London</option>
                          <option value="frontend">Manchester</option>
                          <option value="backend">Lords</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "11px", marginLeft: "-8px" }}
                        >
                          Date Posted
                        </Form.Label>
                        <Form.Select
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          required
                          style={{ fontSize: "14px" }}
                        >
                          <option value="">Anytime</option>
                          <option value="frontend">Yesterday</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "11px", marginLeft: "-8px" }}
                        >
                          Salary Expectation
                        </Form.Label>
                        <Form.Select
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          required
                          style={{ fontSize: "14px" }}
                        >
                          <option value="">£50,000 - £60,000</option>
                          <option value="frontend">£60,000 - £100,000</option>
                        </Form.Select>
                        {showSalaryFilter && (
                          <Form.Select
                            value={salaryRange}
                            onChange={(e) => {
                              setSalaryRange(e.target.value);
                              if (e.target.value === "") {
                                setFilteredJobs(jobs);
                                return;
                              }
                              const [min, max] = e.target.value
                                .split("-")
                                .map(Number);
                              const filtered = jobs.filter((job) => {
                                const salary =
                                  job.job_max_salary || job.job_min_salary || 0;
                                return salary >= min && salary <= max;
                              });
                              setFilteredJobs(filtered);
                            }}
                          >
                            <option value="">All Salaries</option>
                            <option value="0-50000">$0 - $50,000</option>
                            <option value="50000-100000">
                              $50,000 - $100,000
                            </option>
                            <option value="100000-150000">
                              $100,000 - $150,000
                            </option>
                            <option value="150000-200000">
                              $150,000 - $200,000
                            </option>
                            <option value="200000-1000000">$200,000+</option>
                          </Form.Select>
                        )}
                      </Form.Group>
                    </Col>
                    {/* <Col md={2} className="d-flex align-items-end">
                                            <Button variant="primary" type="submit" className="w-100">
                                                Search
                                            </Button>
                                        </Col> */}
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col className="col-8">
            <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search box */}
      <div className="relative w-full max-w-md mb-4">
      {/* Search Icon */}
      {/* <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-2 h-4" /> */}

      {/* Input Field */}
      <input
        style={{ fontSize: "11px",width:'30%',borderRadius:'5px' }}
        type="text"
        placeholder="Search vacancies"
        value={search}
        
        onChange={(e) => setSearch(e.target.value)}
        className=" p-1 py-2 pl-7 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />
    </div>

      {/* Job table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="mx-4 w-95 text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr style={{ fontSize: "11px"}} className="border-bottom">
              <th className="py-3 px-4">Job Position</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Salary</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobss.map((job) => (
              <tr
              style={{ fontSize: "11px" }}
                key={job.id}
                className="border-t hover:bg-gray-50 transition border-bottom"
              >
                <td className="py-3 px-4 text-purple-600 font-medium cursor-pointer" style={{color:'#BA67EF'}}>
                  {job.title}
                </td>
                <td className="py-3 px-4">{job.location}</td>
                <td className="py-3 px-4">{job.date}</td>
                <td className="py-3 px-4">{job.salary}</td>
                <td className="py-3 px-4 d-flex gap-2">
                  <button className="d-flex align-items-center gap-1 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300" style={{color:'#000',fontSize:'9px',border:'unset'}}>
                    APPLY NOW <FaArrowRight/>
                  </button>
                  <button className="d-flex align-items-center gap-1 py-1 text-sm rounded bg-purple-200 text-purple-700 hover:bg-purple-300" style={{color:'#BA67EF',fontSize:'9px',border:'unset'}}>
                    APPLY WITH MFP CV <FaArrowRight/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
        
        
      {/* Footer */}
      <div className="mx-4 mb-2 d-flex justify-content-between items-center mt-4 text-sm text-gray-600" style={{fontSize:'11px'}}>
        <p>
          1 to {filteredJobss.length} Items of {jobs.length}{" "}
          <span className="text-purple-600 cursor-pointer" style={{color:'#BA67EF'}}>View all</span>
        </p>
        <div className="d-flex items-center gap-2" style={{fontSize:'11px'}}>
          <button className="px-2 py-1 border rounded">&lt;</button>
          <span className="px-3 py-2 text-white rounded" style={{background:'#BA67EF'}}>1</span>
          <button className="px-2 py-1 border rounded">&gt;</button>
        </div>
      </div>
      </div>
      

    </div>
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
            {filteredJobs.length === 0 ? (
              <Row>
                <Col>
                  <Alert variant="info">Please try searching again!</Alert>
                </Col>
              </Row>
            ) : (
              <Row>
                {filteredJobs.map((job, index) => (
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
                              style={{
                                width: "30px",
                                height: "30px",
                                objectFit: "contain",
                              }}
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
      <Modal
        show={showModal}
        style={{ zIndex: 1050 }}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
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
                  <p className="text-muted">
                    Posted: {selectedJob.job_posted_at}
                  </p>
                )}
                {(selectedJob.job_min_salary || selectedJob.job_max_salary) && (
                  <p className="fw-bold">{formatSalary(selectedJob)}</p>
                )}
              </div>

              <div className="mb-3">
                <h6>Job Description</h6>
                <p>{selectedJob.job_description}</p>
              </div>

              {selectedJob.job_highlights &&
                Object.keys(selectedJob.job_highlights).length > 0 && (
                  <div className="mb-3">
                    <h6>Highlights</h6>
                    {Object.entries(selectedJob.job_highlights).map(
                      ([key, values]) => (
                        <div key={key} className="mb-2">
                          <strong>{key}:</strong>
                          <ul className="mb-1">
                            {values.map((value, i) => (
                              <li key={i}>{value}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}

              <div className="mb-3">
                <h6>Apply Options</h6>
                <div className="d-grid gap-2">
                  {selectedJob.apply_options &&
                    selectedJob.apply_options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline-primary"
                        size="sm"
                        onClick={() => window.open(option.apply_link, "_blank")}
                      >
                        Apply via {option.publisher}
                      </Button>
                    ))}
                  {selectedJob.job_apply_link && (
                    <Button
                      variant="primary"
                      onClick={() =>
                        window.open(selectedJob.job_apply_link, "_blank")
                      }
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
