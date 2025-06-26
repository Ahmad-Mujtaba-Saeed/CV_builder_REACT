import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Row, Col, Button, Card, Alert, Form, ProgressBar, Nav, Tab, Accordion } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp, FiMinus } from "react-icons/fi";
import { FiEdit2, FiCpu, FiFileText } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './CVBuilder.css';
import Header from '../../components/Partials/Header';
import {
    ModernTemplate,
    ClassicTemplate,
    ProfessionalTemplate2,
    ProfessionalTemplate,
    Template5,
    Template6,
    Template7,
    Template8,
    Template9,
    Template10,
    Template11,
    Template12,
    Template13
} from "../../components/templates";
import { useResume } from '../../context/ResumeContext';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const tabs = [
    {
        active: true,
        text: 'Preview', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
            <path d="M8.6 2.4C9.25 2.4 9.8 2.95 9.8 3.6V12.4C9.8 13.075 9.25 13.6 8.6 13.6H1.4C0.725 13.6 0.2 13.075 0.2 12.4V3.6C0.2 2.95 0.725 2.4 1.4 2.4H2.725C3.075 1.475 3.95 0.8 5 0.8C6.025 0.8 6.9 1.475 7.25 2.4H8.6ZM5 2.4C4.55 2.4 4.2 2.775 4.2 3.2C4.2 3.65 4.55 4 5 4C5.425 4 5.8 3.65 5.8 3.2C5.8 2.775 5.425 2.4 5 2.4ZM7 6.4C7.2 6.4 7.4 6.225 7.4 6C7.4 5.8 7.2 5.6 7 5.6H3C2.775 5.6 2.6 5.8 2.6 6C2.6 6.225 2.775 6.4 3 6.4H7Z" fill="#31374A" />
        </svg>)
    },
    {
        active: true,
        text: 'Design', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path d="M12.35 1.825C12.9 2.375 12.9 3.25 12.35 3.8L11.6 4.55L9.15 2.1L9.9 1.35C10.45 0.8 11.325 0.8 11.875 1.35L12.35 1.825ZM4.4 6.85L8.575 2.675L11.025 5.125L6.85 9.3C6.7 9.45 6.5 9.575 6.3 9.65L4.075 10.375C3.85 10.45 3.625 10.4 3.475 10.225C3.3 10.075 3.25 9.825 3.325 9.625L4.05 7.4C4.125 7.2 4.25 7 4.4 6.85ZM4.9 2.4C5.325 2.4 5.7 2.775 5.7 3.2C5.7 3.65 5.325 4 4.9 4H2.5C2.05 4 1.7 4.375 1.7 4.8V11.2C1.7 11.65 2.05 12 2.5 12H8.9C9.325 12 9.7 11.65 9.7 11.2V8.8C9.7 8.375 10.05 8 10.5 8C10.925 8 11.3 8.375 11.3 8.8V11.2C11.3 12.525 10.225 13.6 8.9 13.6H2.5C1.15 13.6 0.0999999 12.525 0.0999999 11.2V4.8C0.0999999 3.475 1.15 2.4 2.5 2.4H4.9Z" fill="#31374A" />
        </svg>),
    },
    {
        active: true,
        text: 'Analysis', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6.9 1.225C6.9 1 7.05 0.8 7.3 0.8C10.375 0.8 12.9 3.325 12.9 6.4C12.9 6.625 12.7 6.8 12.475 6.8H6.9V1.225ZM0.0999997 7.6C0.0999997 4.575 2.35 2.075 5.25 1.675C5.5 1.625 5.7 1.825 5.7 2.05V8L9.6 11.925C9.775 12.1 9.75 12.375 9.575 12.5C8.575 13.2 7.375 13.6 6.1 13.6C2.775 13.6 0.0999997 10.925 0.0999997 7.6ZM13.25 8C13.475 8 13.675 8.2 13.625 8.425C13.45 9.825 12.775 11.075 11.775 12C11.625 12.125 11.4 12.125 11.25 11.975L7.3 8H13.25Z" fill="#BA67EF" />
        </svg>)
    },
    {
        active: false,
        text: 'Job Matching', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M4.3 4.1C5.7 2.7 8 2.7 9.4 4.1C10.65 5.35 10.825 7.325 9.8 8.775L9.775 8.8C9.525 9.175 9.025 9.25 8.65 9C8.3 8.725 8.2 8.225 8.475 7.875L8.5 7.85C9.075 7.025 8.975 5.95 8.275 5.25C7.5 4.45 6.225 4.45 5.425 5.25L2.625 8.05C1.825 8.825 1.825 10.1 2.625 10.9C3.325 11.6 4.425 11.675 5.225 11.125L5.25 11.075C5.625 10.825 6.125 10.9 6.375 11.275C6.625 11.625 6.55 12.125 6.2 12.4L6.15 12.425C4.7 13.45 2.75 13.275 1.5 12.025C0.075 10.625 0.075 8.325 1.5 6.925L4.3 4.1ZM11.675 10.3C10.275 11.725 7.975 11.725 6.575 10.3C5.325 9.05 5.15 7.1 6.175 5.65L6.2 5.625C6.45 5.25 6.95 5.175 7.325 5.425C7.675 5.675 7.775 6.175 7.5 6.55L7.475 6.575C6.9 7.375 7 8.475 7.7 9.175C8.475 9.975 9.75 9.975 10.55 9.175L13.35 6.375C14.15 5.575 14.15 4.3 13.35 3.525C12.65 2.825 11.55 2.725 10.75 3.3L10.725 3.325C10.35 3.6 9.85 3.5 9.6 3.15C9.35 2.8 9.425 2.3 9.775 2.025L9.825 2C11.275 0.975 13.225 1.15 14.475 2.4C15.9 3.8 15.9 6.1 14.475 7.5L11.675 10.3Z" fill="#31374A" />
        </svg>)
    },
    {
        active: false,
        text: 'Cover Letter', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path d="M9.5 2.9C8.875 2.3 7.9 2.3 7.275 2.9L2.675 7.5C1.625 8.55 1.625 10.275 2.675 11.325C3.725 12.375 5.45 12.375 6.5 11.325L10.3 7.525C10.575 7.25 11 7.25 11.275 7.525C11.55 7.8 11.55 8.225 11.275 8.5L7.475 12.3C5.875 13.9 3.3 13.9 1.7 12.3C0.1 10.7 0.1 8.125 1.7 6.525L6.3 1.925C7.45 0.75 9.325 0.75 10.475 1.925C11.65 3.075 11.65 4.95 10.475 6.1L6.075 10.5C5.375 11.225 4.2 11.225 3.5 10.5C2.775 9.8 2.775 8.625 3.5 7.925L7.1 4.325C7.375 4.05 7.8 4.05 8.075 4.325C8.35 4.6 8.35 5.025 8.075 5.3L4.475 8.9C4.325 9.075 4.325 9.35 4.475 9.525C4.65 9.675 4.925 9.675 5.1 9.525L9.5 5.125C10.1 4.5 10.1 3.525 9.5 2.9Z" fill="#31374A" />
        </svg>)
    },
];

const cardTemplate = [
    // { name: 'Template1', template: ModernTemplate, image: 'dummy.jpg' },
    // { name: 'Template2', template: ClassicTemplate, image: 'dummy.jpg' },
    // { name: 'Template3', template: ProfessionalTemplate, image: 'dummy.jpg' },
    // { name: 'Template4', template: ProfessionalTemplate2, image: 'dummy.jpg' },
    { name: 'Luxe', template: Template13, image: 'default.png' },
    { name: 'Classic', template: Template12, image: 'default.png' },
    { name: 'Unique', template: Template11, image: 'chrono.png' },
    { name: 'Simple', template: Template10, image: 'default.png' },
    { name: 'Default', template: Template9, image: 'default.png' },
    { name: 'Professional', template: Template5, image: 'professional.jpg' },
    { name: 'Chrono', template: Template6, image: 'chrono.png' },
    { name: 'Elegant', template: Template7, image: 'elegant.jpg' },
    { name: 'Modern', template: Template8, image: 'modern.jpg' },
];

const CVBuilder = () => {
    const navigate = useNavigate();
    const baseUrl = "https://deepskyblue-donkey-692108.hostingersite.com";
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
    const [zoom, setZoom] = useState(1);

    const zoomIn = () => {
        setZoom(prev => {
            const newZoom = Math.min(prev + 0.1, 2);
            console.log('Zoom In clicked. New zoom level:', newZoom);
            return newZoom;
        });
    };

    const zoomOut = () => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.1, 0.5);
            console.log('Zoom Out clicked. New zoom level:', newZoom);
            return newZoom;
        });
    };
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

    const [issues, setIssues] = useState([]);
    const [suggestedParagraph, setSuggestedParagraph] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisRequestLoading, setAnalysisRequestLoading] = useState(false);
    const handleAnalysis = async () => {
        try {
            setAnalysisRequestLoading(true);
            const formData = new FormData();
            formData.append('paragraph', parsedResume?.summary || '');

            const response = await fetch(`${baseUrl}/api/analyze-paragraph`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setAnalysisRequestLoading(false);
                throw new Error(result.message || 'Failed to analyze resume');
            }

            // Parse the response data
            const { data } = result;
            if (data) {
                // Parse the JSON strings from the response
                const parsedIssues = JSON.parse(data.issues.replace(/```json\n|\n```/g, ''));
                const parsedSuggestions = JSON.parse(data.suggested_changes.replace(/```json\n|\n```/g, ''));
                console.log(parsedIssues);
                console.log(parsedSuggestions);
                setIssues(parsedIssues.issues);
                setSuggestedParagraph(parsedSuggestions.revised_profile);
                setAnalysisResult({
                    originalParagraph: data.original_paragraph
                });
                setAnalysisRequestLoading(false);
            }

            return data;
        } catch (error) {
            setAnalysisRequestLoading(false);
            console.error('Error analyzing paragraph:', error);
            // You might want to set some error state here for the UI
            throw error;
        }
    }

    // useEffect(() => {
    //     if (activeTab == "Analysis" && parsedResume?.summary != '' && !analysisRequestLoading) {
    //         handleAnalysis();
    //     }
    // }, [activeTab]);

    const handleApplyChanges = (suggestedParagraph) => {
        setParsedResume({
            ...parsedResume,
            summary: suggestedParagraph
        });
    }

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


    const handlePreviousStep = () => {
        if (activeTab == "Preview") {
            setActiveTab("Preview");
        } else if (activeTab == "Design") {
            setActiveTab("Preview");
        } else if (activeTab == "Analysis") {
            setActiveTab("Design");
        } else if (activeTab == "Job Matching") {
            setActiveTab("Analysis");
        } else if (activeTab == "Cover Letter") {
            setActiveTab("Job Matching");
        }
    }


    const handleNextStep = () => {
        if (activeTab == "Preview") {
            setActiveTab("Design");
        } else if (activeTab == "Design") {
            setActiveTab("Analysis");
        } else if (activeTab == "Analysis") {
            setActiveTab("Job Matching");
        } else if (activeTab == "Job Matching") {
            setActiveTab("Cover Letter");
        } else if (activeTab == "Cover Letter") {
            setActiveTab("Cover Letter");
        }
    }

    const handleUploadNew = () => {
        navigate('/upload');
    }

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
                    <h4 className="tab-heading">
                        Basic Information
                    </h4>
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
                                    <Col xs={2} md={3}>
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
                                        <Col xs={10} md={9}>
                                            <Row className="g-3">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>First Name</Form.Label>
                                                        <Form.Control type="text"
                                                            value={`${parsedResume?.candidateName?.[0]?.firstName || ''}`}
                                                            onChange={(e) => updateField("candidateName", [{
                                                                firstName: e.target.value,
                                                                familyName: parsedResume?.candidateName?.[0]?.familyName || '',
                                                            }])} />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Last name</Form.Label>
                                                        <Form.Control type="text"
                                                            value={`${parsedResume?.candidateName?.[0]?.familyName || ''}`}
                                                            onChange={(e) => updateField("candidateName", [{
                                                                firstName: parsedResume?.candidateName?.[0]?.firstName || '',
                                                                familyName: e.target.value,
                                                            }])} />
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
                <>
                    <Card className="border-0">
                        <Card.Body className="p-0">
                            <h4 className="tab-heading">
                                Template Design
                            </h4>
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
                </>
            );
        }

        if (activeTab === 'Analysis') {
            return (
                <Card className="border-0">
                    <Card.Body className="p-0">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="tab-heading">
                                Template Analysis
                            </h4>
                            <button
                                disabled={analysisRequestLoading}
                                onClick={handleAnalysis}
                                className="btn btn-primary"
                            >
                                {analysisRequestLoading ? "Analyzing..." : "Analyze"}
                            </button>
                        </div>

                        {/* LinkedIn Section */}
                        <div className="analysis-section d-flex flex-column justify-content-start align-items-start gap-2">
                            <div className="d-flex justify-content-start gap-3 align-items-start">
                                <Button variant="primary" className="btn-blue btn-blue-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                                        <path d="M4.0518 3.46445C5.16742 2.34883 7.00023 2.34883 8.11586 3.46445C9.11195 4.46055 9.25141 6.03438 8.43461 7.18984L8.41469 7.20977C8.21547 7.50859 7.81703 7.56836 7.5182 7.36914C7.2393 7.15 7.15961 6.75156 7.37875 6.47266L7.39867 6.45273C7.85688 5.79531 7.77719 4.93867 7.21938 4.38086C6.6018 3.74336 5.58578 3.74336 4.94828 4.38086L2.71703 6.61211C2.07953 7.22969 2.07953 8.2457 2.71703 8.8832C3.27484 9.44102 4.15141 9.50078 4.78891 9.0625L4.80883 9.02266C5.10766 8.82344 5.50609 8.8832 5.70531 9.18203C5.90453 9.46094 5.84477 9.85937 5.56586 10.0785L5.52602 10.0984C4.37055 10.9152 2.81664 10.7758 1.82055 9.77969C0.685 8.66406 0.685 6.83125 1.82055 5.71563L4.0518 3.46445ZM9.92875 8.40508C8.81313 9.54063 6.98031 9.54063 5.86469 8.40508C4.86859 7.40898 4.72914 5.85508 5.54594 4.69961L5.56586 4.67969C5.76508 4.38086 6.16352 4.32109 6.46234 4.52031C6.74125 4.71953 6.82094 5.11797 6.6018 5.4168L6.58188 5.43672C6.12367 6.07422 6.20336 6.95078 6.76117 7.50859C7.37875 8.14609 8.39477 8.14609 9.03227 7.50859L11.2635 5.27734C11.901 4.63984 11.901 3.62383 11.2635 3.00625C10.7057 2.44844 9.82914 2.36875 9.19164 2.82695L9.17172 2.84688C8.87289 3.06602 8.47445 2.98633 8.27523 2.70742C8.07602 2.42852 8.13578 2.03008 8.41469 1.81094L8.45453 1.79102C9.61 0.974219 11.1639 1.11367 12.16 2.10977C13.2955 3.22539 13.2955 5.0582 12.16 6.17383L9.92875 8.40508Z" fill="#003CC7" />
                                    </svg>
                                </Button>
                                <div className="section-header">
                                    <h3>LinkedIn Missing</h3>
                                    <p className="section-description">
                                        Please ensure that LinkedIn Profile is present in your contact information.
                                    </p>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="input-section border rounded p-3 w-100">
                                <div className='position-relative linked-form'>
                                    <Form.Control
                                        type="text"
                                        placeholder="Type Linked Profile here..."
                                    />
                                    <Button className="form-buttom">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21" fill="none">
                                            <path d="M6.71875 5.65625C8.90625 3.46875 12.5 3.46875 14.6875 5.65625C16.6406 7.60938 16.9141 10.6953 15.3125 12.9609L15.2734 13C14.8828 13.5859 14.1016 13.7031 13.5156 13.3125C12.9688 12.8828 12.8125 12.1016 13.2422 11.5547L13.2812 11.5156C14.1797 10.2266 14.0234 8.54688 12.9297 7.45312C11.7188 6.20312 9.72656 6.20312 8.47656 7.45312L4.10156 11.8281C2.85156 13.0391 2.85156 15.0312 4.10156 16.2812C5.19531 17.375 6.91406 17.4922 8.16406 16.6328L8.20312 16.5547C8.78906 16.1641 9.57031 16.2812 9.96094 16.8672C10.3516 17.4141 10.2344 18.1953 9.6875 18.625L9.60938 18.6641C7.34375 20.2656 4.29688 19.9922 2.34375 18.0391C0.117188 15.8516 0.117188 12.2578 2.34375 10.0703L6.71875 5.65625ZM18.2422 15.3438C16.0547 17.5703 12.4609 17.5703 10.2734 15.3438C8.32031 13.3906 8.04688 10.3438 9.64844 8.07812L9.6875 8.03906C10.0781 7.45312 10.8594 7.33594 11.4453 7.72656C11.9922 8.11719 12.1484 8.89844 11.7188 9.48438L11.6797 9.52344C10.7812 10.7734 10.9375 12.4922 12.0312 13.5859C13.2422 14.8359 15.2344 14.8359 16.4844 13.5859L20.8594 9.21094C22.1094 7.96094 22.1094 5.96875 20.8594 4.75781C19.7656 3.66406 18.0469 3.50781 16.7969 4.40625L16.7578 4.44531C16.1719 4.875 15.3906 4.71875 15 4.17188C14.6094 3.625 14.7266 2.84375 15.2734 2.41406L15.3516 2.375C17.6172 0.773438 20.6641 1.04688 22.6172 3C24.8438 5.1875 24.8438 8.78125 22.6172 10.9688L18.2422 15.3438Z" fill="#31374A" />
                                        </svg>
                                    </Button>
                                </div>
                                <div className="button-group d-flex justify-content-center gap-3">
                                    <Button variant="secondary" className="resolve-btn">
                                        Resolve Manually
                                    </Button>
                                    <Button variant="primary" className="action-btn">
                                        Add LinkedIn Profile
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Personal Statement Section */}
                        <div className="analysis-section d-flex gap-3 justify-content-start align-items-start">

                            {parsedResume?.summary ? (
                                <>
                                    <Button variant="primary" className="btn-blue btn-blue-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path d="M6.98852 6.04648C7.2475 6.28555 7.2475 6.70391 6.98852 6.94297C6.86898 7.0625 6.70961 7.12227 6.55023 7.12227C6.37094 7.12227 6.21156 7.0625 6.09203 6.94297L4.00023 4.85117L1.88852 6.94297C1.76898 7.0625 1.60961 7.12227 1.45023 7.12227C1.27094 7.12227 1.11156 7.0625 0.992031 6.94297C0.733047 6.70391 0.733047 6.28555 0.992031 6.04648L3.08383 3.93477L0.992031 1.84297C0.733047 1.60391 0.733047 1.18555 0.992031 0.946485C1.23109 0.6875 1.64945 0.6875 1.88852 0.946485L4.00023 3.03828L6.09203 0.946485C6.33109 0.6875 6.74945 0.6875 6.98852 0.946485C7.2475 1.18555 7.2475 1.60391 6.98852 1.84297L4.89672 3.95469L6.98852 6.04648Z" fill="#003CC7" />
                                        </svg>
                                    </Button>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="section-header">
                                            <h3>Original Statement</h3>
                                            <p className="example-statement">
                                                {analysisResult?.originalParagraph || parsedResume?.summary}
                                            </p>
                                        </div>
                                        {!analysisRequestLoading ? (
                                            <>
                                                <div className="issues-section">
                                                    <h4>Issues:</h4>
                                                    <ul className="issues-list">
                                                        {issues?.map((issue, index) => (
                                                            <li key={index}>{issue.issue} - {issue.description}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="suggested-changes">
                                                    <h4>Suggested Changes:</h4>
                                                    <p className="improved-statement">
                                                        {suggestedParagraph}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="d-flex justify-content-center">
                                                    {/* <Loader type="Oval" color="#003CC7" height={20} width={20} />
                                                     */}
                                                    Loading...
                                                </div>
                                            </>
                                        )}


                                    </div></>
                            ) : (
                                <p>No personal statement found.</p>
                            )}
                        </div>

                        <div className="button-group border rounded p-3 d-flex justify-content-center">
                            <Button variant="outline-secondary" className="resolve-btn">
                                Resolve Manually
                            </Button>
                            <Button variant="primary" className="action-btn" onClick={() => handleApplyChanges(suggestedParagraph)}>
                                Apply Suggested Changes
                            </Button>
                        </div>
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
                    <main className="">

                        <Header />

                        <motion.div
                            className="secondary-header"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-center mb-2 fw-400 form-header">Smart CV Builder, tailored for the Modern Job Market.</h1>
                            <p className="text-center text-muted mb-2 heading-text">
                                MyPathfinder curates job opportunities that match your profile, allowing you to apply quickly and efficiently.
                            </p>
                        </motion.div>

                        <Container fluid className="">
                            <Row className="mt-3">
                                <Col lg={7} xxl={6} className='left-section'>
                                    <Tab.Container className='cv-builder-container' activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                        <Row>
                                            <Col>
                                                <Nav variant="underline cv-uplodaer-tabs" className="mb-3">
                                                    {tabs.map((tab, index) => (
                                                        <Nav.Item key={index}>
                                                            <Nav.Link eventKey={tab.text} className="text-capitalize d-flex align-items-center gap-2">
                                                                {tab.icon && <span>{tab.icon}</span>}
                                                                {tab.text}
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
                                        <Card.Header className="bg-white border-bottom p-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.1rem' }}>CV Preview</h5>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="d-flex align-items-center gap-1">
                                                        <Button variant="outline-primary" size="sm" onClick={zoomOut}>
                                                            <FiMinus />
                                                        </Button>
                                                        <Button variant="outline-primary" size="sm" onClick={zoomIn}>
                                                            <FiPlus />
                                                        </Button>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={handleUploadNew}
                                                            className="btn btn-outline-primary"
                                                        >
                                                            <FiUpload size={14} /> 
                                                            <span className="d-none d-xl-inline ms-1">New Upload</span>
                                                        </Button>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={handleDownloadPDF}
                                                            className="btn btn-outline-primary"
                                                        >
                                                            <FiDownload size={14} /> 
                                                            <span className="d-none d-xl-inline ms-1">Download PDF</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                            </div>
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
                                                    transform: `scale(${zoom})`,
                                                    transformOrigin: 'top center',
                                                    transition: 'transform 0.2s ease-in-out',
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
                                        <Card.Body className="p-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={handlePreviousStep}
                                                    disabled={activeTab === "Preview"}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <FiChevronLeft /> Previous
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    onClick={handleNextStep}
                                                    disabled={activeTab === "Cover Letter"}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    Next <FiChevronRight />
                                                </Button>
                                            </div>
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