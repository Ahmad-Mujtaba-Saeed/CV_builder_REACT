import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Button, Card, Alert, Form, ProgressBar, Nav, Tab, Accordion } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FiUpload, FiEdit2, FiCpu, FiFileText, FiDownload } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './CVBuilder.css';
import {
    ModernTemplate,
    ClassicTemplate,
    ProfessionalTemplate2,
    ProfessionalTemplate,
    Template5,
    Template6,
    Template7,
    Template8,
    Template9
} from "../../components/templates";
import { useResume } from '../../context/ResumeContext';

import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const tabs = ['Preview', 'Design', 'Analysis', 'Job Matching', 'Cover Letter'];

const cardTemplate = [
    // { name: 'Template1', template: ModernTemplate, image: 'dummy.jpg' },
    // { name: 'Template2', template: ClassicTemplate, image: 'dummy.jpg' },
    // { name: 'Template3', template: ProfessionalTemplate, image: 'dummy.jpg' },
    // { name: 'Template4', template: ProfessionalTemplate2, image: 'dummy.jpg' },
    { name: 'Professional', template: Template5, image: 'professional.jpg' },
    { name: 'Chrono', template: Template6, image: 'chrono.png' },
    { name: 'Elegant', template: Template7, image: 'elegant.jpg' },
    { name: 'Modern', template: Template8, image: 'modern.jpg' },
    { name: 'Default', template: Template9, image: 'default.png' },
];

const CVBuilder = () => {
    const { parsedResume, setParsedResume } = useResume();
    const [customSections, setCustomSections] = useState([]);

    const [file, setFile] = useState(null);
    const [currentSkill, setCurrentSkill] = useState('');
    //   const [isDragging, setIsDragging] = useState(false);
    //   const [uploadProgress, setUploadProgress] = useState(0);
    //   const [uploadStatus, setUploadStatus] = useState(null);
    //   const [parsedResume, setParsedResume] = useState(null);
    //   const [isParsing, setIsParsing] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState("Default");
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [profilePic, setProfilePic] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [educationEditModes, setEducationEditModes] = useState([]);
    const [employmentEditModes, setEmploymentEditModes] = useState([]);
    const fileInputRef = useRef(null);
    const cvRef = useRef();
    const [activeTab, setActiveTab] = useState('Preview');

    const [currentLanguage, setCurrentLanguage] = useState('');
    const [languageLevel, setLanguageLevel] = useState('Intermediate');
    const [currentHobby, setCurrentHobby] = useState('');

    useEffect(() => {
        if (parsedResume?.skill && parsedResume.skill.length > 0) {
            // Check if any skills have the selected property
            const hasSelectedProperty = parsedResume.skill.some(skill => 'selected' in skill);

            if (!hasSelectedProperty) {
                // Initialize first 5 skills as selected
                const updatedSkills = parsedResume.skill.map((skill, index) => ({
                    ...skill,
                    selected: index < 5
                }));
                updateField("skill", updatedSkills);
            }
        }
    }, [parsedResume?.skill]);

    useEffect(() => {
        if (parsedResume?.education && educationEditModes.length === 0) {
            // Initialize all to false (view mode) by default
            setEducationEditModes(new Array(parsedResume.education.length).fill(true));
        }
    }, [parsedResume?.education]);

    const isEducationComplete = (edu) => {
        return (
            edu?.educationAccreditation?.trim() &&
            edu?.educationOrganization?.trim() &&
            edu?.educationDates?.start?.date?.trim() &&
            edu?.educationDates?.end?.date?.trim()
        );
    };

    const handleAddLanguage = () => {
        if (!currentLanguage.trim()) {
            toast.error("Please enter a language", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        const newLanguage = {
            name: currentLanguage.trim(),
            level: languageLevel,
            fluency: languageLevel
        };

        updateField("languages", [...(parsedResume.languages || []), newLanguage]);
        setCurrentLanguage('');
    };

    const handleAddHobby = () => {
        if (!currentHobby.trim()) {
            toast.error("Please enter a hobby", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        updateField("hobbies", [...(parsedResume.hobbies || []), currentHobby.trim()]);
        setCurrentHobby('');
    };

    const handleAddEducation = () => {
        // Check if there's any empty education card first
        const hasEmptyEducation = parsedResume.education?.some(
            (edu, idx) => educationEditModes[idx] && !isEducationComplete(edu)
        );

        if (hasEmptyEducation) {

            toast.error("Please complete all fields in the current education card before adding a new one", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        const newEdu = {
            educationAccreditation: '',
            educationOrganization: '',
            educationDates: {
                start: { date: '' },
                end: { date: '' }
            },
            educationDescription: ''
        };

        updateField("education", [...(parsedResume.education || []), newEdu]);
        setEducationEditModes(prevModes => [...prevModes, true]);
    };

    const handleCompleteEducation = (index) => {
        const currentEdu = parsedResume.education[index];

        if (!isEducationComplete(currentEdu)) {
            toast.error("Please fill in all required education fields", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        setEducationEditModes(prevModes => {
            const newModes = [...prevModes];
            newModes[index] = false;
            return newModes;
        });
    };

    const isEmploymentComplete = (exp) => {
        return (
            exp?.workExperienceJobTitle?.trim() &&
            exp?.workExperienceOrganization?.trim() &&
            exp?.workExperienceDates?.start?.date?.trim() &&
            exp?.workExperienceDates?.end?.date?.trim()
        );
    };

    useEffect(() => {
        if (parsedResume?.workExperience && employmentEditModes.length === 0) {
            setEmploymentEditModes(new Array(parsedResume.workExperience.length).fill(true));
        }
    }, [parsedResume?.workExperience]);

    const handleAddEmployment = () => {
        const hasEmptyEmployment = parsedResume.workExperience?.some(
            (exp, idx) => employmentEditModes[idx] && !isEmploymentComplete(exp)
        );

        if (hasEmptyEmployment) {
            toast.error("Please complete all fields in the current employment card before adding a new one");
            return;
        }

        const newExp = {
            workExperienceJobTitle: '',
            workExperienceOrganization: '',
            workExperienceDates: {
                start: { date: '' },
                end: { date: '' }
            },
            workExperienceDescription: ''
        };

        updateField("workExperience", [...(parsedResume.workExperience || []), newExp]);
        setEmploymentEditModes(prevModes => [...prevModes, true]);
    };

    const handleCompleteEmployment = (index) => {
        const currentExp = parsedResume.workExperience[index];

        if (!isEmploymentComplete(currentExp)) {
            toast.error("Please fill in all required employment fields");
            return;
        }

        setEmploymentEditModes(prevModes => {
            const newModes = [...prevModes];
            newModes[index] = false;
            return newModes;
        });
    };

    const handleAddSkill = () => {
        if (currentSkill.trim()) {
            const currentSkills = parsedResume?.skill || [];
            updateField("skill", [
                ...currentSkills,
                {
                    name: currentSkill.trim(),
                    selected: true // New skills are selected by default
                }
            ]);
            setCurrentSkill('');
        }
    };


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

    //   const uploadFileToServer = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     try {
    //       const response = await fetch(`http://localhost:8000/api/parse-resume`, {
    //         method: 'POST',
    //         headers: {
    //           'Accept': 'application/json',
    //         },
    //         body: formData,
    //       });
    //       const data = await response.json();
    //       if (!response.ok) {
    //         throw new Error(data.message || 'Failed to parse resume');
    //       }
    //       return data.data?.data;
    //     } catch (error) {
    //       console.error('Error uploading file:', error);
    //       throw error;
    //     }
    //   };

    //   const onDrop = useCallback(async (acceptedFiles) => {
    //     setIsDragging(false);
    //     const pdfFile = acceptedFiles[0];
    //     if (pdfFile && pdfFile.type === "application/pdf") {
    //       setFile(pdfFile);
    //       setIsParsing(true);
    //       let interval;
    //       try {
    //         interval = simulateUpload(pdfFile);
    //         const parsedData = await uploadFileToServer(pdfFile);
    //         setParsedResume(parsedData);
    //         setUploadProgress(100);
    //         setUploadStatus({
    //           type: "success",
    //           message: "Resume parsed successfully!",
    //         });
    //         generateAISuggestions(parsedData);
    //       } catch (error) {
    //         setUploadStatus({
    //           type: "error",
    //           message: error.message || "Failed to parse resume. Please try again.",
    //         });
    //       } finally {
    //         if (interval) clearInterval(interval);
    //         setIsParsing(false);
    //       }
    //     } else {
    //       setUploadStatus({
    //         type: "error",
    //         message: "Please upload a valid PDF file",
    //       });
    //     }
    //   }, []);

    //   const { getRootProps, getInputProps } = useDropzone({
    //     onDrop,
    //     accept: "application/pdf",
    //     onDragEnter: () => setIsDragging(true),
    //     onDragLeave: () => setIsDragging(false),
    //     maxFiles: 1,
    //   });

    //   const simulateUpload = (file) => {
    //     setUploadStatus(null);
    //     setUploadProgress(0);
    //     const interval = setInterval(() => {
    //       setUploadProgress((prev) => {
    //         if (prev >= 90) {
    //           clearInterval(interval);
    //           return 90;
    //         }
    //         return prev + 10;
    //       });
    //     }, 200);
    //     return interval;
    //   };

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

    //   const handleManualCV = () => {
    //     // Initialize a fresh empty resume structure
    //     const emptyResume = {
    //       candidateName: [{ firstName: '', familyName: '' }],
    //       headline: '',
    //       summary: '',
    //       phoneNumber: [{ formattedNumber: '' }],
    //       email: [''],
    //       location: { formatted: '' },
    //       workExperience: [],
    //       education: [],
    //       skill: [],
    //       profilePic: null,
    //       // Add any other required fields your templates expect
    //       website: [''],
    //       certifications: [],
    //       languages: [],
    //       hobbies: []

    //     };

    //     // Clear file first
    //     setFile(null);
    //     setUploadProgress(0);
    //     setIsParsing(false);

    //     // Then set the empty resume
    //     setParsedResume(emptyResume);
    //     setSelectedTemplate("Modern");

    //     // Set success message after a small delay to ensure it shows
    //     setTimeout(() => {
    //       setUploadStatus({
    //         type: "success",
    //         message: "Empty resume created successfully! Start editing your CV."
    //       });
    //     }, 100);

    //     setCurrentPage(1);
    //     setTotalPages(1);
    //     setAiSuggestions([]);
    //     setProfilePic(null);
    //   };

    //   const handleAICV = () => {
    //     alert("Redirecting to AI-powered CV builder");
    //   };

    // const removeFile = () => {
    //     setFile(null);
    //     setUploadProgress(0);
    //     setUploadStatus(null);
    //     setParsedResume(null);
    //     setIsParsing(false);
    //     setAiSuggestions([]);
    //     setCurrentPage(1);
    //     setTotalPages(1);
    // };

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

        // // Center all content elements
        // const centerElements = clonedContent.querySelectorAll('*');
        // centerElements.forEach(el => {
        //   el.style.marginLeft = 'auto';
        //   el.style.marginRight = 'auto';
        //   el.style.maxWidth = '100%';
        // });

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

    const renderTabContent = () => {
        if (activeTab === 'Preview') {
            return (
                <>
                    <Accordion defaultActiveKey="profile">
                        <Accordion.Item eventKey="profile">
                            <Accordion.Header>
                                Personal details
                                <span className="add-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </span>
                                <span className="down-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="border-0">
                                    <Row className="mb-3 g-3">
                                        <Col md={2}>
                                            <div className="photo-upload border d-flex flex-column justify-content-center align-items-center overflow-hidden"
                                                onClick={triggerFileInput}>
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
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleProfilePicChange}
                                                    accept="image/*"
                                                    className="d-none"
                                                />
                                            </div>
                                        </Col>
                                        <Col md={10}>
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>First Name</Form.Label>
                                                        <Form.Control type="text"
                                                            value={`${parsedResume?.candidateName?.[0]?.firstName || ''} ${parsedResume?.candidateName?.[0]?.familyName || ''}`}
                                                            onChange={(e) => updateField("candidateName", [{
                                                                firstName: e.target.value.split(' ')[0],
                                                                familyName: e.target.value.split(' ').slice(1).join(' ')
                                                            }])} />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Last name</Form.Label>
                                                        <Form.Control type="text" />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={12}>
                                                    <Form.Group>
                                                        <Form.Label>Headline</Form.Label>
                                                        <Form.Control type="text"
                                                            value={parsedResume?.headline || ''}
                                                            onChange={(e) => updateField("headline", e.target.value)} />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3 g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email"
                                                    value={parsedResume?.email?.[0] || ''}
                                                    onChange={(e) => updateField("email", [e.target.value])} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Phone number</Form.Label>
                                                <Form.Control type="text"
                                                    value={parsedResume?.phoneNumber?.[0]?.formattedNumber || ''}
                                                    onChange={(e) => updateField("phoneNumber", [{
                                                        formattedNumber: e.target.value
                                                    }])} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3 g-3">
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control type="text"
                                                    value={parsedResume?.location?.formatted || ''}
                                                    onChange={(e) => updateField("location", {
                                                        ...parsedResume?.location,
                                                        formatted: e.target.value
                                                    })} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3 g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Post code</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>City</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3 g-3">
                                        <Col>
                                            <Form.Group>
                                                <Form.Label className="small fw-bold">Summary</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}

                                                    value={parsedResume?.summary || ''}
                                                    onChange={(e) => updateField("summary", e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Addable Fields */}
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        {[
                                            'Date of birth', 'Place of birth', "Driver's license", 'Gender',
                                            'Nationality', 'Civil status', 'Website', 'LinkedIn', 'Custom field'
                                        ].map((label, idx) => (
                                            <Button key={idx} variant="outline-secondary" className="field-button small-btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                                {label}
                                            </Button>
                                        ))}
                                    </div>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="education">
                            <Accordion.Header
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!parsedResume?.education.length) {
                                        handleAddEducation();
                                    }
                                }}
                            >
                                Education
                                <span className="add-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </span>
                                <span className="down-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="border-0">
                                    {parsedResume?.education?.map((edu, index) => (
                                        <div key={index} className="mb-3 p-3 border rounded">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <small className="fw-bold text-muted">Education #{index + 1}</small>
                                            </div>

                                            {educationEditModes[index] ? (
                                                // Edit Mode
                                                <>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label className="">Degree/Qualification</Form.Label>
                                                        <Form.Control
                                                            value={edu.educationAccreditation || ''}
                                                            onChange={(e) => updateField(`education[${index}].educationAccreditation`, e.target.value)}
                                                        />
                                                    </Form.Group>

                                                    <Form.Group className="mb-2">
                                                        <Form.Label className="">Institution</Form.Label>
                                                        <Form.Control
                                                            value={edu.educationOrganization || ''}
                                                            onChange={(e) => updateField(`education[${index}].educationOrganization`, e.target.value)}
                                                        />
                                                    </Form.Group>

                                                    <Row>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="">Start Date</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    placeholder="2017"
                                                                    value={edu.educationDates?.start?.date || ''}
                                                                    onChange={(e) => {
                                                                        const updatedEduData = [...parsedResume.education];
                                                                        updatedEduData[index] = {
                                                                            ...updatedEduData[index],
                                                                            educationDates: {
                                                                                ...(updatedEduData[index].educationDates || {}),
                                                                                start: {
                                                                                    ...(updatedEduData[index].educationDates?.start || {}),
                                                                                    date: e.target.value
                                                                                }
                                                                            }
                                                                        };
                                                                        updateField("education", updatedEduData);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label className="">End Date</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    placeholder="2018"
                                                                    value={edu.educationDates?.end?.date || ''}
                                                                    onChange={(e) => {
                                                                        const updatedEduData = [...parsedResume.education];
                                                                        updatedEduData[index] = {
                                                                            ...updatedEduData[index],
                                                                            educationDates: {
                                                                                ...(updatedEduData[index].educationDates || {}),
                                                                                end: {
                                                                                    ...(updatedEduData[index].educationDates?.end || {}),
                                                                                    date: e.target.value
                                                                                }
                                                                            }
                                                                        };
                                                                        updateField("education", updatedEduData);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <div className="d-flex align-items-center justify-content-end gap-2 mt-2">
                                                        {parsedResume?.education.length > 1 && (
                                                            <Button
                                                                variant="outline-danger"
                                                                className="content-del-btn"
                                                                onClick={() => {
                                                                    const updatedEdu = [...parsedResume.education];
                                                                    updatedEdu.splice(index, 1);
                                                                    updateField("education", updatedEdu);
                                                                    // Update edit modes by removing the corresponding mode
                                                                    setEducationEditModes(prevModes => {
                                                                        const newModes = [...prevModes];
                                                                        newModes.splice(index, 1);
                                                                        return newModes;
                                                                    });
                                                                }}
                                                            >
                                                                <FiTrash2 />
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline-secondary"
                                                            className="content-confirm-btn"
                                                            onClick={() => handleCompleteEducation(index)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                                                            Done
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                // View Mode
                                                <>
                                                    <div className="d-flex gap-2 jestify-content-start align-items-start">
                                                        <div className="icon-span">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-school"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" /><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" /></svg>
                                                        </div>
                                                        <div className="content-d">
                                                            <h6 className="edu-degree">
                                                                {edu.educationAccreditation || ''}
                                                            </h6>
                                                            <h6 className="edu-institute">{edu.educationOrganization || 'N/A'}</h6>
                                                        </div>
                                                    </div>
                                                    <small className="edu-time"><em>
                                                        {edu.educationDates?.start?.date || 'N/A'} / {edu.educationDates?.end?.date || 'N/A'}
                                                    </em></small>
                                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                                        {parsedResume?.education.length > 1 && (
                                                            <Button
                                                                variant="outline-danger"
                                                                className="content-del-btn"
                                                                onClick={() => {
                                                                    const updatedEdu = [...parsedResume.education];
                                                                    updatedEdu.splice(index, 1);
                                                                    updateField("education", updatedEdu);
                                                                    // Update edit modes by removing the corresponding mode
                                                                    setEducationEditModes(prevModes => {
                                                                        const newModes = [...prevModes];
                                                                        newModes.splice(index, 1);
                                                                        return newModes;
                                                                    });
                                                                }}
                                                            >
                                                                <FiTrash2 />
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="outline-secondary"
                                                            className="content-confirm-btn"
                                                            onClick={() => {
                                                                setEducationEditModes(prevModes => {
                                                                    const newModes = [...prevModes];
                                                                    newModes[index] = true; // Only update this card's mode
                                                                    return newModes;
                                                                });
                                                            }}
                                                        >
                                                            <FiEdit2 /> Edit
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        variant="outline-secondary"
                                        className="small-btn mt-2"
                                        onClick={handleAddEducation}
                                    >
                                        <FiPlus /> Add Education
                                    </Button>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="experience">
                            <Accordion.Header
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!parsedResume?.workExperience.length) {
                                        handleAddEmployment();
                                    }
                                }}
                            >
                                Employment
                                <span className="add-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </span>
                                <span className="down-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="border-0">
                                    {parsedResume?.workExperience?.map((exp, index) => (
                                        <div key={index} className="mb-3 p-3 border rounded">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <small className="fw-bold text-muted">Experience #{index + 1}</small>
                                            </div>

                                            {employmentEditModes[index] ? (
                                                // Edit Mode
                                                <>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Job Title</Form.Label>
                                                        <Form.Control
                                                            value={exp.workExperienceJobTitle || ''}
                                                            onChange={(e) => updateField(`workExperience[${index}].workExperienceJobTitle`, e.target.value)}
                                                        />
                                                    </Form.Group>

                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Company</Form.Label>
                                                        <Form.Control
                                                            value={exp.workExperienceOrganization || ''}
                                                            onChange={(e) => updateField(`workExperience[${index}].workExperienceOrganization`, e.target.value)}
                                                        />
                                                    </Form.Group>

                                                    <Row>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>Start Date</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    placeholder="2020"
                                                                    value={exp.workExperienceDates?.start?.date || ''}
                                                                    onChange={(e) => {
                                                                        const updatedWork = [...parsedResume.workExperience];
                                                                        updatedWork[index] = {
                                                                            ...updatedWork[index],
                                                                            workExperienceDates: {
                                                                                ...(updatedWork[index].workExperienceDates || {}),
                                                                                start: {
                                                                                    ...(updatedWork[index].workExperienceDates?.start || {}),
                                                                                    date: e.target.value
                                                                                }
                                                                            }
                                                                        };
                                                                        updateField("workExperience", updatedWork);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={6}>
                                                            <Form.Group className="mb-2">
                                                                <Form.Label>End Date</Form.Label>
                                                                <Form.Control
                                                                    type="date"
                                                                    placeholder="2021 or Present"
                                                                    value={exp.workExperienceDates?.end?.date || ''}
                                                                    onChange={(e) => {
                                                                        const updatedWork = [...parsedResume.workExperience];
                                                                        updatedWork[index] = {
                                                                            ...updatedWork[index],
                                                                            workExperienceDates: {
                                                                                ...(updatedWork[index].workExperienceDates || {}),
                                                                                end: {
                                                                                    ...(updatedWork[index].workExperienceDates?.end || {}),
                                                                                    date: e.target.value
                                                                                }
                                                                            }
                                                                        };
                                                                        updateField("workExperience", updatedWork);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Description (Optional)</Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={5}
                                                            value={exp.workExperienceDescription || ''}
                                                            onChange={(e) => updateField(`workExperience[${index}].workExperienceDescription`, e.target.value)}
                                                        />
                                                    </Form.Group>

                                                    <div className="d-flex align-items-center justify-content-end gap-2 mt-3">
                                                        {parsedResume?.workExperience.length > 1 && (
                                                            <Button
                                                                variant="outline-danger"
                                                                className="content-del-btn"
                                                                onClick={() => {
                                                                    const updatedExp = [...parsedResume.workExperience];
                                                                    updatedExp.splice(index, 1);
                                                                    updateField("workExperience", updatedExp);
                                                                    setEmploymentEditModes(prevModes => {
                                                                        const newModes = [...prevModes];
                                                                        newModes.splice(index, 1);
                                                                        return newModes;
                                                                    });
                                                                }}
                                                            >
                                                                <FiTrash2 />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline-secondary"
                                                            className="content-confirm-btn"
                                                            onClick={() => handleCompleteEmployment(index)}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                                                            Done
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                // View Mode (Content Card)
                                                <>
                                                    <div className="d-flex gap-2 jestify-content-start align-items-start">
                                                        <div className="icon-span">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-briefcase"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /><path d="M12 12l0 .01" /><path d="M3 13a20 20 0 0 0 18 0" /></svg>
                                                        </div>
                                                        <div className="content-d">
                                                            <h6 className="exp-title">
                                                                {exp.workExperienceJobTitle || 'N/A'}
                                                            </h6>
                                                            <h6 className="exp-company">{exp.workExperienceOrganization || 'N/A'}</h6>
                                                            <p className="exp-description">{exp.workExperienceDescription || ''}</p>
                                                        </div>
                                                    </div>
                                                    <small className="exp-time"><em>
                                                        {exp.workExperienceDates?.start?.date || 'N/A'} - {exp.workExperienceDates?.end?.date || 'Present'}
                                                    </em></small>
                                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                                        {parsedResume?.workExperience.length > 1 && (
                                                            <Button
                                                                variant="outline-danger"
                                                                className="content-del-btn"
                                                                onClick={() => {
                                                                    const updatedExp = [...parsedResume.workExperience];
                                                                    updatedExp.splice(index, 1);
                                                                    updateField("workExperience", updatedExp);
                                                                    setEmploymentEditModes(prevModes => {
                                                                        const newModes = [...prevModes];
                                                                        newModes.splice(index, 1);
                                                                        return newModes;
                                                                    });
                                                                }}
                                                            >
                                                                <FiTrash2 />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline-secondary"
                                                            className="content-confirm-btn"
                                                            onClick={() => {
                                                                setEmploymentEditModes(prevModes => {
                                                                    const newModes = [...prevModes];
                                                                    newModes[index] = true;
                                                                    return newModes;
                                                                });
                                                            }}
                                                        >
                                                            <FiEdit2 /> Edit
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}

                                    <Button
                                        variant="outline-secondary"
                                        className="small-btn mt-2"
                                        onClick={handleAddEmployment}
                                    >
                                        <FiPlus /> Add Employment
                                    </Button>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="skills">
                            <Accordion.Header>
                                Skills
                                <span className="add-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </span>
                                <span className="down-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="border-0">
                                    <Form.Group className="border p-3 rounded">
                                        <Form.Label className="">Add Skills (one per line)</Form.Label>
                                        <Form.Control
                                            type="text"

                                            value={currentSkill}
                                            onChange={(e) => setCurrentSkill(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAddSkill();
                                                    // if (currentSkill.trim()) {
                                                    //     const currentSkills = parsedResume?.skill || [];
                                                    //     updateField("skill", [...currentSkills, { name: currentSkill.trim() }]);
                                                    //     setCurrentSkill('');
                                                    // }
                                                }
                                            }}
                                            placeholder="Type a skill and press Enter to add it"
                                            className="me-2"
                                        />
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outline-secondary"
                                                className="small-btn mt-3"
                                                onClick={() => {
                                                    if (currentSkill.trim()) {
                                                        const currentSkills = parsedResume?.skill || [];
                                                        handleAddSkill();
                                                        setCurrentSkill('');
                                                    }
                                                }}
                                            >
                                                <FiPlus /> Add Skill
                                            </Button>
                                        </div>
                                    </Form.Group>
                                    <div className="mt-3">
                                        {/* Selected Skills */}
                                        <div className="mb-3">
                                            <h6>Selected Skills</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {parsedResume?.skill
                                                    ?.filter(skill => skill.selected)
                                                    .map((skill, index) => (
                                                        <span key={index} className="badge bg-primary d-inline-flex align-items-center skill-badge">
                                                            {skill.name}
                                                            <button
                                                                type="button"
                                                                className="ms-1"
                                                                aria-label="Remove"
                                                                onClick={() => {
                                                                    const updatedSkills = [...parsedResume.skill];
                                                                    updatedSkills.splice(updatedSkills.findIndex(s => s.name === skill.name), 1);
                                                                    updateField("skill", updatedSkills);
                                                                }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M18 6l-12 12" />
                                                                    <path d="M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Suggested Skills */}
                                        <div>
                                            <h6>Suggested Skills</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {parsedResume?.skill
                                                    ?.filter(skill => !skill.selected)
                                                    .map((skill, index) => (
                                                        <span key={index} className="badge bg-secondary d-inline-flex align-items-center skill-badge">
                                                            {skill.name}
                                                            <button
                                                                type="button"
                                                                className="ms-1"
                                                                aria-label="Select"
                                                                onClick={() => {
                                                                    const updatedSkills = [...parsedResume.skill];
                                                                    const skillIndex = updatedSkills.findIndex(s => s.name === skill.name);
                                                                    updatedSkills[skillIndex] = {
                                                                        ...updatedSkills[skillIndex],
                                                                        selected: true
                                                                    };
                                                                    updateField("skill", updatedSkills);
                                                                }}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-check">
                                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                    <path d="M5 12l5 5l10 -10" />
                                                                </svg>
                                                            </button>
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                    <small className="text-muted">
                                        Type a skill and press Enter or click Add
                                    </small>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="languages">
                            <Accordion.Header>
                                Languages
                                <span className="add-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </span>
                                <span className="down-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="border-0">
                                    <Form.Group className="border p-3 rounded">
                                        <Form.Label>Add Language</Form.Label>
                                        <Row className="g-2">
                                            <Col md={8}>
                                                <Form.Control
                                                    type="text"
                                                    value={currentLanguage}
                                                    onChange={(e) => setCurrentLanguage(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleAddLanguage();
                                                        }
                                                    }}
                                                    placeholder="Language name"
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <Form.Select
                                                    value={languageLevel}
                                                    onChange={(e) => setLanguageLevel(e.target.value)}
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                    <option value="Native">Native</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>

                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outline-secondary"
                                                className="small-btn mt-3"
                                                onClick={handleAddLanguage}
                                            >
                                                <FiPlus /> Add Language
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <div className="mt-3 d-flex flex-wrap gap-2">
                                        {parsedResume?.languages?.map((lang, index) => (
                                            <span key={index} className="badge bg-secondary d-inline-flex align-items-center skill-badge">
                                                {lang.name} ({lang.level})
                                                <button
                                                    type="button"
                                                    className=""
                                                    aria-label="Remove"
                                                    onClick={() => {
                                                        const updatedLangs = [...parsedResume.languages];
                                                        updatedLangs.splice(index, 1);
                                                        updateField("languages", updatedLangs);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="hobbies">
                            <Accordion.Header>
                                Hobbies
                                <span className="add-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </span>
                                <span className="down-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <Card className="border-0">
                                    <Form.Group className="border p-3 rounded">
                                        <Form.Label>Add Hobby</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentHobby}
                                            onChange={(e) => setCurrentHobby(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAddHobby();
                                                }
                                            }}
                                            placeholder="Hobby name"
                                        />
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                variant="outline-secondary"
                                                className="small-btn mt-3"
                                                onClick={handleAddHobby}
                                            >
                                                <FiPlus /> Add Hobby
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <div className="mt-3 d-flex flex-wrap gap-2">
                                        {parsedResume?.hobbies?.map((hobby, index) => (
                                            <span key={index} className="badge bg-secondary d-inline-flex align-items-center skill-badge">
                                                {hobby}
                                                <button
                                                    type="button"
                                                    className="ms-2"
                                                    aria-label="Remove"
                                                    onClick={() => {
                                                        const updatedHobbies = [...parsedResume.hobbies];
                                                        updatedHobbies.splice(index, 1);
                                                        updateField("hobbies", updatedHobbies);
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </>
            );
        }

        if (activeTab === 'Design') {
            return (
                <Card className="border-0">
                    <Card.Body className="p-0 pt-4">
                        <h5>Template Designs</h5>
                        <Row className="g-3">
                            {cardTemplate.map((template) => (
                                <Col xs={6} sm={4} md={3} lg={4} xl={3}  >
                                    <Button
                                        key={template.name}
                                        variant={selectedTemplate === template.name ? "primary" : "outline-primary"}
                                        onClick={() => setSelectedTemplate(template.name)}
                                        className="d-flex flex-column align-items-center gap-2 cv-template-button"
                                    >
                                        <img
                                            src={`/assets/images/${template.image}`}
                                            alt={template.name}
                                            className="template-thumbnail"
                                        />
                                        {template.name}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            );
        }

        if (activeTab === 'Analysis') {
            return (
                <Card>
                    <Card.Body>
                        <h5>Analysis</h5>
                        <p>This is the Analysis card content.</p>
                    </Card.Body>
                </Card>
            );
        }

        if (activeTab === 'Job Matching') {
            return (
                <Card>
                    <Card.Body>
                        <h5>Job Matching</h5>
                        <p>This is the Job Matching card content.</p>
                    </Card.Body>
                </Card>
            );
        }

        if (activeTab === 'Cover Letter') {
            return (
                <Card>
                    <Card.Body>
                        <h5>Cover Letter</h5>
                        <p>This is the Cover Letter card content.</p>
                    </Card.Body>
                </Card>
            );
        }

        return null;
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
            {
                // cv-builder-container
                parsedResume && (
                    <main className="mb-4">

                        <motion.div
                            className="secondary-header"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-center mb-2 display-6 fw-400">Smart CV Builder, tailored for the Modern Job Market.</h1>
                            <p className="text-center text-muted mb-2 heading-text">
                                MyPathfinder curates job opportunities that match your profile, allowing you to apply quickly and efficiently.
                            </p>
                        </motion.div>

                        <Container fluid className="">
                            <Row>
                                <Col lg={7} xxl={6} className='left-section'>
                                    <Tab.Container className='cv-builder-container' activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                        <Row>
                                            <Col>
                                                <Nav variant="underline cv-uplodaer-tabs" className="mb-3">
                                                    {tabs.map((tab) => (
                                                        <Nav.Item key={tab}>
                                                            <Nav.Link eventKey={tab} className="text-capitalize">
                                                                {tab}
                                                            </Nav.Link>
                                                        </Nav.Item>
                                                    ))}
                                                </Nav>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                {renderTabContent()}
                                            </Col>
                                        </Row>
                                    </Tab.Container>
                                </Col>

                                {/* Right Side - CV Preview */}
                                <Col lg={5} xxl={6} className='right-section'>
                                    <Card className="border-0 shadow-custom mb-3">
                                        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0 py-1" style={{ fontSize: '1rem' }}>CV Preview</h5>
                                            {totalPages > 1 && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <Button
                                                        variant="outline-secondary"
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
                                            className="cv-template-div"
                                        >
                                            <div
                                                ref={cvRef}
                                                style={{
                                                    background: 'white',
                                                    padding: '16px',
                                                    minHeight: `${Math.max(1, totalPages) * 1080}px`,
                                                }}
                                            >
                                                {(() => {
                                                    const selectedTemplateData = cardTemplate.find(t => t.name === selectedTemplate);
                                                    if (!selectedTemplateData) {
                                                        return <div className="alert alert-warning">Please select a template</div>;
                                                    }

                                                    const TemplateComponent = selectedTemplateData.template;
                                                    return (
                                                        <TemplateComponent
                                                            resumeData={{
                                                                ...(parsedResume || {
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
                                                                    website: [''],
                                                                    certifications: [],
                                                                    languages: [],
                                                                    hobbies: []
                                                                }),
                                                                customSections
                                                            }}
                                                        />
                                                    );
                                                })()}
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
                                    <Card className="border-0 shadow-custom">
                                        <Card.Body className="d-flex p-2 justify-content-center alight-items-center gap-2">
                                            <Button
                                                variant="success"
                                                onClick={handleDownloadPDF}
                                                className="d-flex align-items-center gap-2"
                                            >
                                                <FiDownload /> Download PDF
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>

                            </Row>
                        </Container>
                    </main>
                )
            }
        </>
    )

};

export default CVBuilder;