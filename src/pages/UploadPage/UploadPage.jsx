import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Button, Card, Alert, Form, ProgressBar, Nav, Tab, Accordion } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FiUpload, FiEdit2, FiCpu, FiFileText, FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";

import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './uploadPage.css';
import { useResume } from '../../context/ResumeContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Partials/Header';


const UploadPage = () => {
  const navigate = useNavigate();
  const { parsedResume, setParsedResume } = useResume();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isParsing, setIsParsing] = useState(false);



  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`https://deepskyblue-donkey-692108.hostingersite.com/api/parse-resume`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to parse resume');
      }
      return data.data?.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsDragging(false);
    const pdfFile = acceptedFiles[0];
    if (pdfFile && pdfFile.type === "application/pdf") {
      setFile(pdfFile);
      setIsParsing(true);
      let interval;
      try {
        interval = simulateUpload(pdfFile);
        const parsedData = await uploadFileToServer(pdfFile);
        setParsedResume(parsedData);
        setUploadProgress(100);
        setUploadStatus({
          type: "success",
          message: "Resume parsed successfully!",
        });
        navigate('/cv-builder');
        // generateAISuggestions(parsedData);
      } catch (error) {
        setUploadStatus({
          type: "error",
          message: error.message || "Failed to parse resume. Please try again.",
        });
      } finally {
        if (interval) clearInterval(interval);
        setIsParsing(false);
      }
    } else {
      setUploadStatus({
        type: "error",
        message: "Please upload a valid PDF file",
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "application/pdf",
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    maxFiles: 1,
  });

  const simulateUpload = (file) => {
    setUploadStatus(null);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    return interval;
  };

  const handleManualCV = () => {
    // Initialize a fresh empty resume structure
    const emptyResume = {
      candidateName: [{ firstName: '', familyName: '' }],
      headline: '',
      summary: '',
      phoneNumber: [{ formattedNumber: '' }],
      email: [''],
      location: { formatted: '' },
      workExperience: [],
      education: [],
      skill: [],
      profilePic: null,
      // Add any other required fields your templates expect
      website: [''],
      certifications: [],
      languages: [],
      hobbies: []

    };

    // Clear file first
    setFile(null);
    setUploadProgress(0);
    setIsParsing(false);

    // Then set the empty resume
    setParsedResume(emptyResume);
    navigate('/cv-builder');
    setSelectedTemplate("Modern");

    // Set success message after a small delay to ensure it shows
    setTimeout(() => {
      setUploadStatus({
        type: "success",
        message: "Empty resume created successfully! Start editing your CV."
      });
    }, 100);

    setCurrentPage(1);
    setTotalPages(1);
    setAiSuggestions([]);
    setProfilePic(null);
  };

  const handleAICV = () => {
    alert("Redirecting to AI-powered CV builder");
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus(null);
    setParsedResume(null);
    setIsParsing(false);
    setAiSuggestions([]);
    setCurrentPage(1);
    setTotalPages(1);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      <Container className="mb-4 cv-uploder-container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-center mb-2 display-6 fw-400">Upload existing CV or build a new one with Mypathfinder</h1>
          <p className="text-center text-muted mb-4 heading-text">
            MyPathfinder curates job opportunities that match your profile, allowing you to apply quickly and efficiently.
          </p>
        </motion.div>
        <Row className="justify-content-center">
          <Col md={8} lg={8}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className={`dropzone-card ${isDragging ? "dragging" : ""}`}>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <Card.Body className="text-center p-4 upload-section">
                    {file ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <FiFileText size={48} className="mb-3 text-blue-600" />
                        <h5>{file.name}</h5>
                        <p className="text-muted">{Math.round(file.size / 1024)} KB</p>
                        {uploadProgress < 100 || isParsing ? (
                          <ProgressBar
                            animated
                            now={uploadProgress}
                            label={`${uploadProgress}%`}
                            className="my-3"
                          />
                        ) : (
                          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                            <Button
                              variant="outline-primary"

                              onClick={removeFile}
                              className="mt-2"
                            >
                              Change File
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <>
                        <div className="icon-content-uploder d-flex justify-content-center align-items-center mb-3 gap-3">
                          <FiUpload size={30} className=" text-blue-600" />

                          <h4 className="m-0">Upload Existing CV</h4>
                        </div>
                        <p className="text-muted m-0 heading-text">Please upload your file in one of the following formats: PDF, DOC, or DOCX.</p>
                        <p className="text-muted my-1 heading-text">Ensure that your file does not exceed the maximum allowed size of [insert size limit, e.g., 10MB].</p>
                        <p className="text-muted m-0 heading-text">Files outside of these formats or limits may not be accepted.</p>

                        {/* <small className="text-muted">Supported format: PDF (Max 5MB)</small> */}
                      </>
                    )}
                  </Card.Body>
                </div>
              </Card>
            </motion.div>

            {uploadStatus && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Alert
                  variant={uploadStatus.type == "success" ? "success" : "danger"}
                  className="mt-3"
                  dismissible
                  onClose={() => setUploadStatus(null)}
                >
                  {uploadStatus.message}
                </Alert>
              </motion.div>
            )}

            <div className="text-center mt-4">
              <p className="text-muted mb-3">
                {file ? "Enhance your CV with our tools below" : ""}
              </p>
              <div className="d-flex justify-content-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    // variant="primary"
                    onClick={handleManualCV}
                    className="d-flex align-items-center gap-2 cv-build-from-scratch-btn custom-button"
                  >
                    <FiEdit2 /> Build from scratch
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    disabled={true}
                    // variant="success"
                    onClick={handleAICV}
                    className="d-flex align-items-center gap-2 cv-with-ai-btn custom-button"
                  >
                    <FiCpu /> Build my CV with AI
                  </Button>
                </motion.div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default UploadPage;
