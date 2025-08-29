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
import avatar from "../../assets/images/2.jpg";


const JobSearchPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("frontend developer");
  const [location, setLocation] = useState("uk");
  const [country, setCountry] = useState("uk");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [salaryRange, setSalaryRange] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showSalaryFilter, setShowSalaryFilter] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ukCities = [
    "All",
    "London",
    "Birmingham",
    "Manchester",
    "Leeds",
    "Liverpool",
    "Newcastle upon Tyne",
    "Sheffield",
    "Bristol",
    "Nottingham",
    "Leicester",
    "Coventry",
    "Cardiff",
    "Glasgow",
    "Edinburgh",
    "Belfast",
    "Southampton",
    "Portsmouth",
    "Stoke-on-Trent",
    "Sunderland",
    "Derby",
];


const [salaryRanges, setSalaryRanges] = useState([
    { label: "All Salaries", value: "0-0" },
    { label: "Up to £20,000", value: "0-20000" },
    { label: "£20,000 - £25,000", value: "20000-25000" },
    { label: "£25,000 - £30,000", value: "25000-30000" },
    { label: "£30,000 - £35,000", value: "30000-35000" },
    { label: "£35,000 - £40,000", value: "35000-40000" },
    { label: "£40,000 - £50,000", value: "40000-50000" },
    { label: "£50,000 - £60,000", value: "50000-60000" },
    { label: "£60,000 - £70,000", value: "60000-70000" },
    { label: "£70,000 - £80,000", value: "70000-80000" },
    { label: "£80,000 - £100,000", value: "80000-100000" },
    { label: "£100,000 - £150,000", value: "100000-150000" },
    { label: "£150,000+", value: "150000-1000000" }
  ]);
  
  // Update the fetchJobs function
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/fetch-jobs?q=${encodeURIComponent(
          searchQuery + " job"
        )}&gl=${country}&location=${encodeURIComponent(location)}`
      );
      
      // Process the jobs data to include salary information
      const jobsWithSalary = (response.data.jobs || []).map(job => {
        const salaryInfo = (response.data.data?.jobs || []).find(
          j => j.job_id === job.job_id
        )?.salary_data;
        
        return {
          ...job,
          job_min_salary: salaryInfo?.min_amount || 0,
          job_max_salary: salaryInfo?.max_amount || 0,
          job_salary_currency: salaryInfo?.currency || 'GBP',
          job_salary_period: salaryInfo?.period || 'year'
        };
      });
  
      setJobs(jobsWithSalary);
      setFilteredJobs(jobsWithSalary);
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
                            src={avatar} // replace with real image
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
                          <option value="frontend developer">Frontend Developer</option>
                          <option value="backend developer">Backend Developer</option>
                          <option value="fullstack developer">
                            Full Stack Developer
                          </option>
                          <option value="ui/ux designer">UI/UX Designer</option>
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
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          style={{ fontSize: "14px" }}
                        >
                          {ukCities.map((city, index) => (
                            <option key={index} value={city.toLowerCase()=="all"?"uk":city.toLowerCase()}>
                              {city}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    {/* <Col md={12}>
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
                          <option value="anytime">Anytime</option>
                          <option value="yesterday">Yesterday</option>
                        </Form.Select>
                      </Form.Group>
                    </Col> */}
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          style={{ fontSize: "11px", marginLeft: "-8px" }}
                        >
                          Salary Expectation
                        </Form.Label>
                        <Form.Select
  value={salaryRange}
  onChange={(e) => {
    setSalaryRange(e.target.value);
    if (e.target.value === "0-0") {
      setFilteredJobs(jobs);
      return;
    }
    const [min, max] = e.target.value.split("-").map(Number);
    const filtered = jobs.filter((job) => {
      const salary = job.job_max_salary || job.job_min_salary || 0;
      return salary >= min && salary <= max;
    });
    setFilteredJobs(filtered);
  }}
  style={{ fontSize: "14px" }}
>
  {salaryRanges.map((range, index) => (
    <option key={index} value={range.value}>
      {range.label}
    </option>
  ))}
</Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="w-100" onClick={handleSearch}>
                    Search
                  </Button>
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
        className=" p-1 py-2 pl-7 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none bg-transparent"
      />
    </div>

      {/* Job table */}
{/* Replace the entire Results section with this */}
{/* Loading State */}
{loading && (
    <center>
  <tr>
    <td colSpan="6" className="py-8">
      <div className="d-flex justify-content-center w-100">
        <div className="text-center" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
          <Spinner 
            animation="border" 
            role="status" 
            variant="primary"
            className="mb-2 d-block mx-auto"
            style={{ 
              width: '2rem', 
              height: '2rem',
              color: '#BA67EF'
            }}
          />
          <p className="text-muted mb-0">Searching for jobs...</p>
        </div>
      </div>
    </td>
  </tr>
  </center>
)}
{!loading && !error && (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="w-100 text-left">
      <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
        <tr style={{ fontSize: "11px"}} className="border-bottom">
          <th className="py-3 px-4">Job Position</th>
          <th className="py-3 px-4">Company</th>
          <th className="py-3 px-4">Location</th>
          <th className="py-3 px-4">Salary</th>
          <th className="py-3 px-4">Posted</th>
          <th className="py-3 px-4"></th>
        </tr>
      </thead>
      <tbody>
{/* Loading State */}

{/* Error State */}
{!loading && error && (
  <tr>
    <td colSpan="6" className="py-4 text-center">
      <Alert variant="danger" className="mb-0">
        {error}
      </Alert>
    </td>
  </tr>
)}

{/* No Results State */}
{!loading && !error && filteredJobs.length === 0 && (
  <tr>
    <td colSpan="6" className="py-8 text-center">
      <div className="d-flex flex-column align-items-center">
        <i className="bi bi-search mb-3" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
        <h5 className="text-muted">No jobs found</h5>
        <p className="text-muted">Try adjusting your search filters</p>
      </div>
    </td>
  </tr>
)}

{/* Results */}
{!loading && !error && filteredJobs.length > 0 && filteredJobs.map((job) => (
  <tr
    key={job.job_id}
    className="border-top"
    style={{ fontSize: "11px" }}
  >
    <td 
      className="py-3 px-4 font-medium" 
      style={{color:'#BA67EF'}}
    >
      <div 
        className="d-flex align-items-center cursor-pointer"
        onClick={() => handleJobClick(job)}
      >
        {job.employer_logo && (
          <img 
            src={job.employer_logo} 
            alt={job.employer_name}
            className="me-2"
            style={{ 
              width: '24px', 
              height: '24px', 
              objectFit: 'contain',
              borderRadius: '4px'
            }}
          />
        )}
        <span>{job.job_title}</span>
      </div>
    </td>
    <td className="py-3 px-4 align-middle">{job.employer_name}</td>
    <td className="py-3 px-4 align-middle">
      <div className="d-flex align-items-center">
        <i className="bi bi-geo-alt me-1 text-muted"></i>
        {job.job_location}
      </div>
    </td>
    <td className="py-3 px-4 align-middle">
      {job.job_min_salary || job.job_max_salary ? (
        <div className="d-flex align-items-center">
          <i className="bi bi-cash-coin me-1 text-muted"></i>
          <span>
            {job.job_salary_currency} 
            {job.job_min_salary === job.job_max_salary
              ? job.job_min_salary.toLocaleString()
              : `${job.job_min_salary?.toLocaleString() || '0'} - ${job.job_max_salary?.toLocaleString()}`}
            /year
          </span>
        </div>
      ) : (
        <span className="text-muted">Not specified</span>
      )}
    </td>
    <td className="py-3 px-4 align-middle">
      {job.job_posted_at ? (
        <div className="d-flex align-items-center">
          <i className="bi bi-clock-history me-1 text-muted"></i>
          {new Date(job.job_posted_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      ) : 'N/A'}
    </td>
    <td className="py-3 px-4 align-middle">
      <div className="d-flex gap-2">
        <button 
          className="d-flex align-items-center gap-1 px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300" 
          style={{
            color: '#000',
            fontSize: '10px',
            border: 'none',
            transition: 'all 0.2s'
          }}
          onClick={() => window.open(job.job_apply_link, '_blank')}
        >
          APPLY NOW <FaArrowRight size={10} />
        </button>
        <button 
          className="d-flex align-items-center gap-1 px-3 py-1 text-sm rounded" 
          style={{
            background: 'rgba(186, 103, 239, 0.1)',
            color: '#BA67EF',
            fontSize: '10px',
            border: '1px solid rgba(186, 103, 239, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(186, 103, 239, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(186, 103, 239, 0.1)';
          }}
        >
          APPLY WITH CV <FaArrowRight size={10} />
        </button>
      </div>
    </td>
  </tr>
))}
      </tbody>
    </table>
    
    {/* Pagination */}
    {filteredJobs.length > 0 && (
      <div className="mx-4 mb-2 d-flex justify-content-between items-center mt-4 text-sm text-gray-600" style={{fontSize:'11px'}}>
        <p>
          Showing {Math.min(filteredJobs.length, 10)} of {filteredJobs.length} jobs
        </p>
        <div className="d-flex items-center gap-2" style={{fontSize:'11px'}}>
          <button 
            className="px-2 py-1 border rounded" 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          <span className="px-3 py-1 rounded" style={{background:'#BA67EF', color: 'white'}}>
            {page}
          </span>
          <button 
            className="px-2 py-1 border rounded"
            onClick={() => setPage(p => p + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    )}
  </div>
)}
      

    </div>
          </Col>
        </Row>


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
{(selectedJob.job_min_salary || selectedJob.job_max_salary) ? (
  <div className="mt-2">
    <span className="fw-bold">
      {selectedJob.job_salary_currency} {selectedJob.job_min_salary === selectedJob.job_max_salary
        ? `${selectedJob.job_min_salary.toLocaleString()}/year`
        : `${selectedJob.job_min_salary.toLocaleString()} - ${selectedJob.job_max_salary.toLocaleString()}/year`}
    </span>
  </div>
) : (
  <span className="text-muted">Salary not specified</span>
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