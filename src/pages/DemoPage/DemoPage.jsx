import React, {useState,useEffect , useRef , useCallback} from "react";
import { Container, Row, Col, Button, Card, Alert, Form, ProgressBar } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";  
import { FiUpload, FiEdit2, FiCpu, FiFileText, FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ModernTemplate, ClassicTemplate } from "../../components/templates";
import { ProfessionalTemplate } from "../../components/templates";
import { ProfessionalTemplate2 } from "../../components/templates";

const templates = {
  Modern: ModernTemplate,
  Classic: ClassicTemplate,
  Professional: ProfessionalTemplate,
  Professional2: ProfessionalTemplate2
};

const DemoPage = () => {
  const [customSections, setCustomSections] = useState([]);
  
  const [file, setFile] = useState(null);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [parsedResume, setParsedResume] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("Professional2");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef(null);
  const cvRef = useRef();



  // Add these helper functions
const addCustomSection = (type) => {
  const newSection = {
    id: Date.now(),
    type,
    title: `Custom ${type}`,
    content: type === 'description' ? '' : [],
    skillLevels: type === 'skills' ? [] : null
  };
  setCustomSections([...customSections, newSection]);
};

const removeCustomSection = (id) => {
  setCustomSections(customSections.filter(section => section.id !== id));
};

const updateCustomSection = (id, field, value) => {
  setCustomSections(customSections.map(section => {
    if (section.id === id) {
      return { ...section, [field]: value };
    }
    return section;
  }));
};

const addCustomEntry = (sectionId) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const newEntry = {
        title: '',
        subtitle: '',
        date: '',
        description: ''
      };
      return {
        ...section,
        content: [...section.content, newEntry]
      };
    }
    return section;
  }));
};

const updateCustomEntry = (sectionId, entryIndex, field, value) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const updatedContent = [...section.content];
      updatedContent[entryIndex] = {
        ...updatedContent[entryIndex],
        [field]: value
      };
      return {
        ...section,
        content: updatedContent
      };
    }
    return section;
  }));
};

const removeCustomEntry = (sectionId, entryIndex) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const updatedContent = [...section.content];
      updatedContent.splice(entryIndex, 1);
      return {
        ...section,
        content: updatedContent
      };
    }
    return section;
  }));
};

const addCustomSkill = (sectionId) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const newSkill = {
        name: '',
        level: 'Beginner'
      };
      return {
        ...section,
        content: [...section.content, newSkill]
      };
    }
    return section;
  }));
};

const updateCustomSkill = (sectionId, skillIndex, field, value) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const updatedContent = [...section.content];
      updatedContent[skillIndex] = {
        ...updatedContent[skillIndex],
        [field]: value
      };
      return {
        ...section,
        content: updatedContent
      };
    }
    return section;
  }));
};

const removeCustomSkill = (sectionId, skillIndex) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const updatedContent = [...section.content];
      updatedContent.splice(skillIndex, 1);
      return {
        ...section,
        content: updatedContent
      };
    }
    return section;
  }));
};

const addCustomListItem = (sectionId) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      return {
        ...section,
        content: [...section.content, '']
      };
    }
    return section;
  }));
};

const updateCustomListItem = (sectionId, itemIndex, value) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const updatedContent = [...section.content];
      updatedContent[itemIndex] = value;
      return {
        ...section,
        content: updatedContent
      };
    }
    return section;
  }));
};

const removeCustomListItem = (sectionId, itemIndex) => {
  setCustomSections(customSections.map(section => {
    if (section.id === sectionId) {
      const updatedContent = [...section.content];
      updatedContent.splice(itemIndex, 1);
      return {
        ...section,
        content: updatedContent
      };
    }
    return section;
  }));
};
  


  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        updateField("profilePic", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
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
        generateAISuggestions(parsedData);
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

  const generateAISuggestions = (resumeData) => {
    const suggestions = [];
    if (!resumeData.summary) {
      suggestions.push("Add a professional summary to highlight your career goals and strengths.");
    }
    if (resumeData.workExperience?.length < 2) {
      suggestions.push("Consider adding more work experiences to showcase your expertise.");
    }
    if (!resumeData.skill || resumeData.skill.length < 5) {
      suggestions.push("Include additional skills relevant to your target job role.");
    }
    resumeData.workExperience?.forEach((exp, index) => {
      if (!exp.workExperienceDescription.includes("achieved") && !exp.workExperienceDescription.includes("increased")) {
        suggestions.push(`Enhance work experience #${index + 1} with quantifiable achievements (e.g., 'increased traffic by 20%').`);
      }
    });
    setAiSuggestions(suggestions);
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
      languages: []
    };
  
    // Clear file first
    setFile(null);
    setUploadProgress(0);
    setIsParsing(false);
    
    // Then set the empty resume
    setParsedResume(emptyResume);
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

  const updateField = (path, value) => {
    setParsedResume((prev) => {
      const newResume = { ...prev };
      const pathParts = path.match(/(\w+)(?:\[(\d+)\])?\.?(\w+)?/);
      if (!pathParts) {
        newResume[path] = value;
        return newResume;
      }
      
      const [_, key, index, subKey] = pathParts;
      if (index && subKey) {
        if (!newResume[key]) newResume[key] = [];
        if (!newResume[key][index]) newResume[key][index] = {};
        newResume[key][index][subKey] = value;
      } else if (index) {
        if (!newResume[key]) newResume[key] = [];
        newResume[key][index] = value;
      } else {
        newResume[key] = value;
      }
      return newResume;
    });
  };

  const calculatePages = () => {
    if (!cvRef.current) return 1;
    
    const a4HeightPx = 1123; // A4 height in pixels at 96 DPI
    const contentHeight = cvRef.current.scrollHeight;
    const calculatedPages = Math.ceil(contentHeight / a4HeightPx);
    
    // Check if the last page has meaningful content (at least 20% filled)
    const lastPageContent = contentHeight % a4HeightPx;
    if (calculatedPages > 1 && lastPageContent < (a4HeightPx * 0.2)) {
      return calculatedPages - 1;
    }
    return calculatedPages;
  };

  // Update total pages when resume data changes
  // Update total pages when resume data changes
  useEffect(() => {
    if (parsedResume && cvRef.current) {
      setTimeout(() => {
        const pages = calculatePages();
        setTotalPages(pages);
        if (currentPage > pages) {
          setCurrentPage(pages);
        }
      }, 100);
    }
  }, [parsedResume, currentPage]);

 // Improved PDF generation that matches preview
 const handleDownloadPDF = async () => {
  if (!cvRef.current) return;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const a4Width = 210; // A4 width in mm
  const a4Height = 297; // A4 height in mm
  const a4WidthPx = 794; // A4 width in pixels at 96 DPI
  const a4HeightPx = 1123; // A4 height in pixels at 96 DPI
  const padding = 0; // Padding in pixels
  
  // Create a temporary container for the entire content
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = `${a4WidthPx}px`;
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.padding = `${padding}px`;
  tempContainer.style.boxSizing = 'border-box';
  
  // Clone the CV content
  const clonedContent = cvRef.current.cloneNode(true);
  
  // Apply PDF-specific styles to center the content
  clonedContent.style.width = `${a4WidthPx - 2 * padding}px`; // Account for padding on both sides
  clonedContent.style.margin = '0 auto'; // Center horizontally
  clonedContent.style.padding = '0';
  clonedContent.style.fontSize = '12px';
  clonedContent.style.lineHeight = '1.4';
  
  // Center all content elements
  const centerElements = clonedContent.querySelectorAll('*');
  centerElements.forEach(el => {
    el.style.marginLeft = 'auto';
    el.style.marginRight = 'auto';
    el.style.maxWidth = '100%';
  });
  
  // Adjust heading sizes
  const headings = clonedContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const currentSize = window.getComputedStyle(heading).fontSize;
    const newSize = parseFloat(currentSize) * 0.8;
    heading.style.fontSize = `${newSize}px`;
    heading.style.marginBottom = '8px';
    heading.style.marginTop = '12px';
  });
  
  // Center sections
  const sections = clonedContent.querySelectorAll('section, .section');
  sections.forEach(section => {
    section.style.marginLeft = 'auto';
    section.style.marginRight = 'auto';
    section.style.maxWidth = '100%';
  });
  
  tempContainer.appendChild(clonedContent);
  document.body.appendChild(tempContainer);
  
  try {
    const totalPages = calculatePages();
    
    for (let i = 0; i < totalPages; i++) {
      const canvas = await html2canvas(clonedContent, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: a4WidthPx,
        height: a4HeightPx,
        scrollY: i * a4HeightPx,
        windowHeight: a4HeightPx,
        y: i * a4HeightPx,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      if (i > 0) {
        pdf.addPage();
      }
      
      // Center the image on the PDF page
      const imgWidth = a4Width;
      const imgHeight = (canvas.height * a4Width) / canvas.width;
      
      // Calculate vertical position to center content
      const yPos = (a4Height - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', 0, yPos > 0 ? yPos : 0, imgWidth, imgHeight);
    }
    
    pdf.save('professional_cv.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    document.body.removeChild(tempContainer);
  }
};
  // Create a ref for the scrollable container
  const previewContainerRef = useRef(null);

  const scrollToPage = useCallback((pageNumber) => {
    if (!cvRef.current || !previewContainerRef.current || pageNumber < 1 || pageNumber > totalPages) return;
    
    const pageHeight = cvRef.current.scrollHeight / totalPages;
    const scrollPosition = (pageNumber - 1) * pageHeight;
    
    previewContainerRef.current.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentPage(pageNumber);
  }, [totalPages]);

  // Handle page navigation
  const goToPage = useCallback((page) => {
    scrollToPage(page);
  }, [scrollToPage]);

  return (
    <Container fluid className="my-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-2">Mypathfinder</h1>
        <p className="text-center text-muted mb-4">
          Create, enhance, and perfect your professional resume
        </p>
      </motion.div>

      {!parsedResume ? (
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className={`dropzone-card ${isDragging ? "dragging" : ""}`}>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <Card.Body className="text-center p-4">
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
                              size="sm"
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
                        <FiUpload size={48} className="mb-3 text-blue-600" />
                        <h4>Drag & Drop your CV here</h4>
                        <p className="text-muted">or click to browse files</p>
                        <small className="text-muted">Supported format: PDF (Max 5MB)</small>
                      </>
                    )}
                  </Card.Body>
                </div>
              </Card>
            </motion.div>

            {uploadStatus && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Alert
                  variant={uploadStatus.type}
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
                {file ? "Enhance your CV with our tools below" : "Create a new CV from scratch"}
              </p>
              <div className="d-flex justify-content-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleManualCV}
                    className="d-flex align-items-center gap-2"
                  >
                    <FiEdit2 /> Make CV Manually
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                  disabled={true}
                    variant="success"
                    size="lg"
                    onClick={handleAICV}
                    className="d-flex align-items-center gap-2"
                  >
                    <FiCpu /> Make CV with AI
                  </Button>
                </motion.div>
              </div>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          {/* Template Selection */}
          <Row className="mb-3">
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                      <h5 className="mb-0 me-3">Template:</h5>
                      {Object.keys(templates).map((template) => (
                        <Button
                          key={template}
                          size="sm"
                          variant={selectedTemplate === template ? "primary" : "outline-primary"}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          {template}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      variant="success" 
                      size="sm"
                      onClick={handleDownloadPDF} 
                      className="d-flex align-items-center gap-2"
                    >
                      <FiDownload /> Download PDF
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Content - Side by Side */}
          <Row>
            <Col lg={5}>
              <Card className="border-0 shadow-sm" style={{ maxHeight: '800px', overflowY: 'auto' }}>
                <Card.Header className="bg-white border-bottom sticky-top">
                  <h5 className="mb-0">Edit Your CV</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    {/* Personal Information */}
                    <div className="mb-4">
                      <h6 className="text-primary mb-3">Personal Information</h6>
                      
                      {/* Profile Picture Upload */}
                      {(selectedTemplate === "Professional" || selectedTemplate === "Professional2" ) && (
                      <div className="text-center mb-3">
                        <div className="position-relative d-inline-block">
                          <div 
                            className="rounded-circle overflow-hidden border border-2 border-primary" 
                            style={{
                              width: '120px', 
                              height: '120px',
                              cursor: 'pointer',
                              background: '#f8f9fa',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onClick={triggerFileInput}
                          >
                            {profilePic || (parsedResume?.profilePic) ? (
                              <img 
                                src={profilePic || parsedResume.profilePic} 
                                alt="Profile" 
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <div className="text-muted">
                                <i className="bi bi-person-circle" style={{ fontSize: '3rem' }}></i>
                                <div className="small mt-1">Click to upload</div>
                              </div>
                            )}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfilePicChange}
                            accept="image/*"
                            className="d-none"
                          />
                        </div>
                      </div>
                      )}
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Full Name</Form.Label>
                        <Form.Control
                          size="sm"
                          value={`${parsedResume?.candidateName?.[0]?.firstName || ''} ${parsedResume?.candidateName?.[0]?.familyName || ''}`}
                          onChange={(e) => updateField("candidateName", [{
                            firstName: e.target.value.split(' ')[0],
                            familyName: e.target.value.split(' ').slice(1).join(' ')
                          }])}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Headline/Title</Form.Label>
                        <Form.Control
                          size="sm"
                          value={parsedResume?.headline || ''}
                          onChange={(e) => updateField("headline", e.target.value)}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Summary</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          size="sm"
                          value={parsedResume?.summary || ''}
                          onChange={(e) => updateField("summary", e.target.value)}
                        />
                      </Form.Group>
                    </div>

                    {/* Contact Information */}
                    <div className="mb-4">
                      <h6 className="text-primary mb-3">Contact Information</h6>
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Phone</Form.Label>
                        <Form.Control
                          size="sm"
                          value={parsedResume?.phoneNumber?.[0]?.formattedNumber || ''}
                          onChange={(e) => updateField("phoneNumber", [{
                            formattedNumber: e.target.value
                          }])}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Email</Form.Label>
                        <Form.Control
                          type="email"
                          size="sm"
                          value={parsedResume?.email?.[0] || ''}
                          onChange={(e) => updateField("email", [e.target.value])}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="small fw-bold">Location</Form.Label>
                        <Form.Control
                          size="sm"
                          value={parsedResume?.location?.formatted || ''}
                          onChange={(e) => updateField("location", {
                            ...parsedResume?.location,
                            formatted: e.target.value
                          })}
                        />
                      </Form.Group>
                    </div>

                    {/* Work Experience */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary mb-0">Work Experience</h6>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            const newExp = {
                              workExperienceJobTitle: '',
                              workExperienceOrganization: '',
                              workExperienceStartDate: '',
                              workExperienceEndDate: '',
                              workExperienceDescription: ''
                            };
                            updateField("workExperience", [...(parsedResume.workExperience || []), newExp]);
                          }}
                        >
                          + Add
                        </Button>
                      </div>
                      {parsedResume?.workExperience?.map((exp, index) => (
                        <div key={index} className="mb-3 p-3 border rounded bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="fw-bold text-muted">Experience #{index + 1}</small>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                const updatedExp = [...parsedResume.workExperience];
                                updatedExp.splice(index, 1);
                                updateField("workExperience", updatedExp);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                          <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold">Job Title</Form.Label>
                            <Form.Control
                              size="sm"
                              value={exp.workExperienceJobTitle || ''}
                              onChange={(e) => updateField(`workExperience[${index}].workExperienceJobTitle`, e.target.value)}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold">Company</Form.Label>
                            <Form.Control
                              size="sm"
                              value={exp.workExperienceOrganization || ''}
                              onChange={(e) => updateField(`workExperience[${index}].workExperienceOrganization`, e.target.value)}
                            />
                          </Form.Group>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-2">
                                <Form.Label className="small fw-bold">Start</Form.Label>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  placeholder="2020"
                                  value={exp.workExperienceStartDate || ''}
                                  onChange={(e) => updateField(`workExperience[${index}].workExperienceStartDate`, e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-2">
                                <Form.Label className="small fw-bold">End</Form.Label>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  placeholder="2021 or Present"
                                  value={exp.workExperienceEndDate || ''}
                                  onChange={(e) => updateField(`workExperience[${index}].workExperienceEndDate`, e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                          
                          <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold">Description</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              size="sm"
                              value={exp.workExperienceDescription || ''}
                              onChange={(e) => updateField(`workExperience[${index}].workExperienceDescription`, e.target.value)}
                            />
                          </Form.Group>
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary mb-0">Education</h6>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => {
                            const newEdu = {
                              educationAccreditation: '',
                              educationOrganization: '',
                              educationStartDate: '',
                              educationEndDate: ''
                            };
                            updateField("education", [...(parsedResume.education || []), newEdu]);
                          }}
                        >
                          + Add
                        </Button>
                      </div>
                      {parsedResume?.education?.map((edu, index) => (
                        <div key={index} className="mb-3 p-3 border rounded bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="fw-bold text-muted">Education #{index + 1}</small>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                const updatedEdu = [...parsedResume.education];
                                updatedEdu.splice(index, 1);
                                updateField("education", updatedEdu);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                          <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold">Degree/Qualification</Form.Label>
                            <Form.Control
                              size="sm"
                              value={edu.educationAccreditation || ''}
                              onChange={(e) => updateField(`education[${index}].educationAccreditation`, e.target.value)}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold">Institution</Form.Label>
                            <Form.Control
                              size="sm"
                              value={edu.educationOrganization || ''}
                              onChange={(e) => updateField(`education[${index}].educationOrganization`, e.target.value)}
                            />
                          </Form.Group>
                          
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-2">
                                <Form.Label className="small fw-bold">Start</Form.Label>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  placeholder="2017"
                                  value={edu.educationStartDate || ''}
                                  onChange={(e) => updateField(`education[${index}].educationStartDate`, e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-2">
                                <Form.Label className="small fw-bold">End</Form.Label>
                                <Form.Control
                                  type="text"
                                  size="sm"
                                  placeholder="2018"
                                  value={edu.educationEndDate || ''}
                                  onChange={(e) => updateField(`education[${index}].educationEndDate`, e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <h6 className="text-primary mb-3">Skills</h6>
                      <Form.Group>
                        <Form.Label className="small fw-bold">Add Skills (one per line)</Form.Label>
                        <div className="d-flex align-items-center mb-2">
                          <Form.Control
                            type="text"
                            size="sm"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (currentSkill.trim()) {
                                  const currentSkills = parsedResume?.skill || [];
                                  updateField("skill", [...currentSkills, { name: currentSkill.trim() }]);
                                  setCurrentSkill('');
                                }
                              }
                            }}
                            placeholder="Type a skill and press Enter to add it"
                            className="me-2"
                          />
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => {
                              if (currentSkill.trim()) {
                                const currentSkills = parsedResume?.skill || [];
                                updateField("skill", [...currentSkills, { name: currentSkill.trim() }]);
                                setCurrentSkill('');
                              }
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        <div className="mt-2">
                          {parsedResume?.skill?.map((skill, index) => (
                            <span key={index} className="badge bg-primary me-2 mb-2 d-inline-flex align-items-center">
                              {skill.name}
                              <button 
                                type="button" 
                                className="btn-close btn-close-white ms-2" 
                                aria-label="Remove"
                                onClick={() => {
                                  const updatedSkills = [...parsedResume.skill];
                                  updatedSkills.splice(index, 1);
                                  updateField("skill", updatedSkills);
                                }}
                              />
                            </span>
                          ))}
                        </div>
                        <Form.Text className="text-muted">
                          Type a skill and press Enter or click Add
                        </Form.Text>
                      </Form.Group>
                    </div>

                    {/* Custom Sections */}
<div className="mb-4">
  <h6 className="text-primary mb-3">Custom Sections</h6>
  <div className="mb-3">
    <Button
      variant="outline-primary"
      size="sm"
      className="me-2"
      onClick={() => addCustomSection('description')}
    >
      <FiPlus /> Add Description Section
    </Button>
    <Button
      variant="outline-primary"
      size="sm"
      className="me-2"
      onClick={() => addCustomSection('entries')}
    >
      <FiPlus /> Add Entries Section
    </Button>
    <Button
      variant="outline-primary"
      size="sm"
      className="me-2"
      onClick={() => addCustomSection('skills')}
    >
      <FiPlus /> Add Skills Section
    </Button>
    <Button
      variant="outline-primary"
      size="sm"
      onClick={() => addCustomSection('list')}
    >
      <FiPlus /> Add List Section
    </Button>
  </div>

  {customSections.map((section) => (
    <div key={section.id} className="mb-4 p-3 border rounded bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          size="sm"
          value={section.title}
          onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
          className="me-2"
          style={{ width: 'auto' }}
        />
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => removeCustomSection(section.id)}
        >
          <FiTrash2 />
        </Button>
      </div>

      {section.type === 'description' && (
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            size="sm"
            value={section.content}
            onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
          />
        </Form.Group>
      )}

      {section.type === 'entries' && (
        <div>
          {section.content.map((entry, index) => (
            <div key={index} className="mb-3 p-3 border rounded bg-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="fw-bold text-muted">Entry #{index + 1}</small>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeCustomEntry(section.id, index)}
                >
                  ×
                </Button>
              </div>
              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Title</Form.Label>
                <Form.Control
                  size="sm"
                  value={entry.title}
                  onChange={(e) => updateCustomEntry(section.id, index, 'title', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Subtitle</Form.Label>
                <Form.Control
                  size="sm"
                  value={entry.subtitle}
                  onChange={(e) => updateCustomEntry(section.id, index, 'subtitle', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Date</Form.Label>
                <Form.Control
                  size="sm"
                  value={entry.date}
                  onChange={(e) => updateCustomEntry(section.id, index, 'date', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  size="sm"
                  value={entry.description}
                  onChange={(e) => updateCustomEntry(section.id, index, 'description', e.target.value)}
                />
              </Form.Group>
            </div>
          ))}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => addCustomEntry(section.id)}
          >
            <FiPlus /> Add Entry
          </Button>
        </div>
      )}

      {section.type === 'skills' && (
        <div>
          {section.content.map((skill, index) => (
            <div key={index} className="mb-3 p-3 border rounded bg-white">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="fw-bold text-muted">Skill #{index + 1}</small>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeCustomSkill(section.id, index)}
                >
                  ×
                </Button>
              </div>
              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Skill Name</Form.Label>
                <Form.Control
                  size="sm"
                  value={skill.name}
                  onChange={(e) => updateCustomSkill(section.id, index, 'name', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold">Skill Level</Form.Label>
                <Form.Select
                  size="sm"
                  value={skill.level}
                  onChange={(e) => updateCustomSkill(section.id, index, 'level', e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Good">Good</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Excellent">Excellent</option>
                </Form.Select>
              </Form.Group>
            </div>
          ))}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => addCustomSkill(section.id)}
          >
            <FiPlus /> Add Skill
          </Button>
        </div>
      )}

      {section.type === 'list' && (
        <div>
          {section.content.map((item, index) => (
            <div key={index} className="mb-3 p-3 border rounded bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Control
                  size="sm"
                  value={item}
                  onChange={(e) => updateCustomListItem(section.id, index, e.target.value)}
                  className="me-2"
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeCustomListItem(section.id, index)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => addCustomListItem(section.id)}
          >
            <FiPlus /> Add List Item
          </Button>
        </div>
      )}
    </div>
  ))}
</div>

                    {/* AI Suggestions */}
                    {aiSuggestions.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-warning mb-3">💡 AI Suggestions</h6>
                        <div className="bg-light p-3 rounded">
                          {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                            <div key={index} className="mb-2">
                              <small className="text-muted">• {suggestion}</small>
                            </div>
                          ))}
                          {aiSuggestions.length > 3 && (
                            <small className="text-muted">+ {aiSuggestions.length - 3} more suggestions</small>
                          )}
                        </div>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Right Side - CV Preview */}
            <Col lg={7} className="mb-4">
      <Card className="h-100 border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">CV Preview</h5>
          {totalPages > 1 && (
            <div className="d-flex align-items-center gap-2">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </Card.Header>
        <div 
          ref={previewContainerRef}
          style={{ 
            maxHeight: '800px', 
            overflowY: 'auto',
            position: 'relative',
            scrollBehavior: 'smooth'
          }}
        >
          <div 
            ref={cvRef}
            style={{ 
              background: 'white',
              padding: '40px',
              minHeight: `${Math.max(1, totalPages) * 1123}px`,
            }}
          >
{React.createElement(templates[selectedTemplate], {
  resumeData: { ...parsedResume, customSections }
})}
          </div>
          
          {/* Only show page dividers if we have multiple pages with content */}
          {totalPages > 1 && Array.from({ length: totalPages - 1 }).map((_, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(index + 1) * 1123}px`,
                borderTop: '2px dashed #ccc',
                pointerEvents: 'none'
              }}
            />
          ))}
        </div>
      </Card>
    </Col>
    
          </Row>
        </>
      )}
    </Container>
  );
};

export default DemoPage;