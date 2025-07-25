import React, { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useResume } from '../../context/ResumeContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';

const BuildCVAI = () => {
  const { setParsedResume , parsedResume } = useResume();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    jobTitle: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      jobTitle: formData.jobTitle,
      description: formData.description,
    };

    try {
      const response = await axios.post("/api/generate-cv-ai", data);
      const updatedResume = {
         ...response.data?.data,
         id: parsedResume.id
       }
      setParsedResume(updatedResume);
      toast.success('CV generated successfully!');
      navigate("/cv-builder");
    } catch (error) {
      console.error('Error generating CV:', error);
      toast.error(error.response?.data?.message || 'Failed to generate CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-primary text-white py-4">
              <h1 className="h3 mb-0 text-center fw-bold text-black">Build Your AI-Powered CV</h1>
              <p className="text-center mb-0 mt-2 opacity-75 text-black">Fill in your details and let our AI craft the perfect CV for you</p>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label fw-semibold">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label fw-semibold">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="jobTitle" className="form-label fw-semibold">
                    Professional Title (e.g., "Frontend Developer") *
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label fw-semibold">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-semibold">
                    Professional Summary *
                    <span className="text-muted small ms-1">(Min. 100 characters)</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    minLength={100}
                    rows={6}
                    className="form-control form-control-lg"
                    placeholder="Describe your professional background, key skills, achievements, and career goals. Be specific about technologies, methodologies, and results..."
                    disabled={isLoading}
                  />
                  <div className="form-text text-end">
                    {formData.description.length}/1000 characters
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg py-3 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Generating Your CV...
                      </>
                    ) : (
                      'Generate My AI CV'
                    )}
                  </button>
                  <p className="text-muted small text-center mt-2 mb-0">
                    This may take a few moments. Please don't close this page.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildCVAI;