import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  InputGroup, 
  FormControl, 
  Modal, 
  Spinner 
} from "react-bootstrap";
import { Search, Filter, SortAsc, Video, RotateCcw, Play } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";


const questions = [
    {
        title: "Tell Me About Yourself",
        desc: "Master the art of introduction",
        dark: false,
    },
    {
        title: "What are your Strengths and Weaknesses?",
        desc: "Show self-awareness with balance",
        dark: false,
    },
    {
        title: "Why do you want to work here?",
        desc: "Align your goals with the company",
        dark: false,
    },
    {
        title: "Tell Me About Yourself",
        desc: "Master the art of introduction",
        dark: false,
    },
    {
        title: "What are your Strengths and Weaknesses?",
        desc: "Show self-awareness with balance",
        dark: false,
    },
    {
        title: "Random question",
        desc: "Practice a completely random question towards this industry",
        dark: true,
    },
];

const history = [
    {
        title: "Tell Me About Yourself",
        desc: "Master the art of introduction",
        yourScore: 33,
        avgScore: 67,
    },
    {
        title: "What are your Strengths and Weaknesses?",
        desc: "Show self-awareness with balance",
        yourScore: 45,
        avgScore: 29,
    },
    {
        title: "Why do you want to work here?",
        desc: "Align your goals with the company",
        yourScore: 100,
        avgScore: 72,
    },
];

const InterviewQuestions = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Filter options
    const [difficulties, setDifficulties] = useState([]);
    const [questionTypes, setQuestionTypes] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    
    // Selected filters
    const [filters, setFilters] = useState({
        difficulty: null,
        questionType: null,
        subcategory: null,
        searchQuery: ""
    });
    
    // Questions data
    const [questionsData, setQuestionsData] = useState([]);
    const [isLoadingFilters, setIsLoadingFilters] = useState(false);


    const [historyQuestions, setHistoryQuestions] = useState([]);

    const fetchHistoryQuestions = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`/api/interview/history`);
            setHistoryQuestions(res.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setIsLoading(false);
        }
    };
    // Fetch questions based on filters
    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            
            if (filters.difficulty) params.append('difficulty_slug', filters.difficulty.slug);
            if (filters.questionType) params.append('questiontype_slug', filters.questionType.slug);
            if (filters.subcategory) params.append('subcategories_slug', filters.subcategory.slug);
            if (filters.searchQuery) params.append('search', filters.searchQuery);
            
            const res = await axios.get(`/api/questions?${params.toString()}`);
            setQuestionsData(res.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch filter options on component mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setIsLoadingFilters(true);
                // Fetch difficulties
                const [difficultiesRes, questionTypesRes] = await Promise.all([
                    axios.get('/api/filters/difficulties'),
                    axios.get('/api/filters/question-types')
                ]);
                
                setDifficulties(difficultiesRes.data);
                setQuestionTypes(questionTypesRes.data);
                
            } catch (error) {
                console.error("Error fetching filter options:", error);
            } finally {
                setIsLoadingFilters(false);
            }
        };
        
        fetchFilterOptions();
    }, []);
    
    // Fetch questions when filters change
    useEffect(() => {
        if (!showModal) {
            fetchQuestions();
            fetchHistoryQuestions();
        }
    }, [filters, showModal]);
    
    // Fetch subcategories when question type is selected
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!filters.questionType) {
                setSubcategories([]);
                return;
            }
            
            try {
                setIsLoadingFilters(true);
                const res = await axios.get(
                    `/api/filters/question-types/${filters.questionType.id}/subcategories`
                );
                setSubcategories(res.data);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            } finally {
                setIsLoadingFilters(false);
            }
        };
        
        fetchSubcategories();
    }, [filters.questionType]);
    
    const handleNextStep = () => {
        setCurrentStep(prev => prev + 1);
    };
    
    const handlePreviousStep = () => {
        setCurrentStep(prev => prev - 1);
    };
    
    const handleFinish = () => {
        setShowModal(false);
    };
    
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [filterType]: value };
            // Reset dependent filters
            if (filterType === 'questionType') {
                newFilters.subcategory = null;
            }
            return newFilters;
        });
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        fetchQuestions();
    };
    
    const resetFilters = () => {
        setFilters({
            difficulty: null,
            questionType: null,
            subcategory: null,
            searchQuery: ""
        });
    };
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <Modal.Title className="text-center mb-4">Select Difficulty Level</Modal.Title>
                        <div className="d-grid gap-2">
                            {difficulties.map(difficulty => (
                                <Button
                                    key={difficulty.id}
                                    variant={filters.difficulty?.id === difficulty.id ? "primary" : "outline-primary"}
                                    className="text-start py-3"
                                    onClick={() => handleFilterChange('difficulty', difficulty)}
                                >
                                    {difficulty.name}
                                </Button>
                            ))}
                        </div>
                    </>
                );
                
            case 2:
                return (
                    <>
                        <Modal.Title className="text-center mb-4">What Do You Want to Practice?</Modal.Title>
                        <div className="d-grid gap-2">
                            {questionTypes.map(type => (
                                <Button
                                    key={type.id}
                                    variant={filters.questionType?.id === type.id ? "primary" : "outline-primary"}
                                    className="text-start py-3"
                                    onClick={() => handleFilterChange('questionType', type)}
                                >
                                    {type.name}
                                </Button>
                            ))}
                        </div>
                    </>
                );
                
            case 3:
                return (
                    <>
                        <Modal.Title className="text-center mb-4">Select Subcategory</Modal.Title>
                        {isLoading ? (
                            <div className="text-center p-4">
                                <Spinner animation="border" />
                            </div>
                        ) : (
                            <div className="d-grid gap-2">
                                {subcategories.length > 0 ? (
                                    subcategories.map(subcategory => (
                                        <Button
                                            key={subcategory.id}
                                            variant={filters.subcategory?.id === subcategory.id ? "primary" : "outline-primary"}
                                            className="text-start py-3"
                                            onClick={() => handleFilterChange('subcategory', subcategory)}
                                        >
                                            {subcategory.name}
                                        </Button>
                                    ))
                                ) : (
                                    <div className="text-center p-3 text-muted">
                                        No subcategories available for the selected industry
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                );
                
            default:
                return null;
        }
    };
    
    const isNextDisabled = () => {
        switch (currentStep) {
            case 1: return !filters.difficulty;
            case 2: return !filters.questionType;
            case 3: return !filters.subcategory;
            default: return true;
        }
    };
    
    return (
        <Container className="py-5">
            {/* Selection Modal */}
            <Modal 
                show={showModal} 
                onHide={() => {}}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Body className="p-4">
                    {isLoading && currentStep === 1 ? (
                        <div className="text-center p-4">
                            <Spinner animation="border" />
                            <p className="mt-2">Loading options...</p>
                        </div>
                    ) : (
                        <>

                            <div className="mb-4">
                                {renderStepContent()}
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={currentStep === 1 ? () => setShowModal(false) : handlePreviousStep}
                                    disabled={isLoading}
                                >
                                    {currentStep === 1 ? 'Cancel' : 'Back'}
                                </Button>

                                {currentStep < 3 ? (
                                    <Button 
                                        variant="primary" 
                                        onClick={handleNextStep}
                                        disabled={isNextDisabled() || isLoading}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="success" 
                                        onClick={handleFinish}
                                        disabled={isNextDisabled() || isLoading}
                                    >
                                        Start Practicing
                                    </Button>
                                )}
                            </div>

                            <div className="text-center mt-3 text-muted">
                                Step {currentStep} of 3
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
            {!showModal && (
                <>
                    <motion.h1 className="mb-4 fw-bold" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        Recommended Practice Questions
                    </motion.h1>

                    <Row className="align-items-center mb-4">
                        <Col md={4}>
                            <form onSubmit={handleSearch}>
                                <InputGroup>
                                    <InputGroup.Text><Search size={16} /></InputGroup.Text>
                                    <FormControl 
                                        placeholder="Search by name" 
                                        value={filters.searchQuery}
                                        onChange={(e) => setFilters(prev => ({...prev, searchQuery: e.target.value}))}
                                    />
                                </InputGroup>
                            </form>
                        </Col>
                        <Col md="auto">
                            <Button 
                                variant="outline-secondary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => setShowModal(true)}
                            >
                                <Filter size={16} className="me-1" /> Change Filters
                            </Button>
                            {/* <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={resetFilters}
                                disabled={!filters.difficulty && !filters.questionType && !filters.subcategory && !filters.searchQuery}
                            >
                                Reset Filters
                            </Button> */}
                        </Col>
                    </Row>
                    
                    {/* Active filters */}
                    {(filters.difficulty || filters.questionType || filters.subcategory) && (
                        <div className="mb-3">
                            <small className="text-muted me-2">Active filters:</small>
                            {filters.difficulty && (
                                <span className="badge bg-primary me-2">
                                    {filters.difficulty.name}
                                </span>
                            )}
                            {filters.questionType && (
                                <span className="badge bg-success me-2">
                                    {filters.questionType.name}
                                </span>
                            )}
                            {filters.subcategory && (
                                <span className="badge bg-info text-dark me-2">
                                    {filters.subcategory.name}
                                </span>
                            )}
                        </div>
                    )}

            <Row className="g-4 mb-5">
                {questionsData.map((q, index) => (
                    <Col md={4} key={index}>
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Card bg="light" text="dark" className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{q.title}</Card.Title>
                                    <div className="mb-2">
                                        <span className="badge bg-primary me-1">{q.difficulty?.name || 'General'}</span>
                                        {q.question_type && (
                                            <span className="badge bg-success me-1">{q.question_type.name}</span>
                                        )}
                                        {q.subcategory && (
                                            <span className="badge bg-info text-dark">{q.subcategory.name}</span>
                                        )}
                                    </div>
                                    <Button 
                                        onClick={() => navigate(`/practice-question/${q.id}`)} 
                                        variant="outline-primary" 
                                        size="sm"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Spinner animation="border" size="sm" className="me-1" />
                                        ) : (
                                            <><Video size={16} className="me-1" /> Practice Now</>
                                        )}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <motion.h1 className="mb-4 fw-bold" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>Practice History</motion.h1>

            <Row className="align-items-center mb-4">
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text><Search size={16} /></InputGroup.Text>
                        <FormControl placeholder="Search by name" />
                    </InputGroup>
                </Col>
                <Col md="auto">
                    <Button variant="outline-secondary" size="sm"><Filter size={16} className="me-1" /> Filter</Button>
                </Col>
                <Col md="auto">
                    <Button variant="outline-secondary" size="sm"><SortAsc size={16} className="me-1" /> Sorting</Button>
                </Col>
            </Row>

            <Row className="g-4">
                {historyQuestions.map((q, index) => (
                    <Col md={4} key={index}>
                        <motion.div whileHover={{ scale: 1.02 }}>
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <Card.Title>{q.question?.title || 'Question'}</Card.Title>
                                    <div>Your score: <strong>
                                        {typeof q.evaluation === 'string' 
                                            ? JSON.parse(q.evaluation)?.score + '%' 
                                            : q.evaluation?.score + '%'}
                                    </strong></div>
                                    <div className="text-muted small mb-2">
                                        {typeof q.evaluation === 'string' 
                                            ? JSON.parse(q.evaluation)?.feedback
                                            : q.evaluation?.feedback}
                                    </div>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm" 
                                        onClick={() => navigate(`/practice-question/${q.question?.id}`)}
                                    >
                                        <RotateCcw size={16} className="me-1" /> Retry
                                    </Button>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* <div className="text-center mt-5">
                <Button variant="primary" size="lg">
                    <Play size={18} className="me-2" /> Resume Last Interview
                </Button>
            </div> */}

                    <footer className="text-center text-muted mt-5">
                        Prototype designed and presented by Vision Launch | 2025 © MyPathFinder v1.0.7
                    </footer>
                </>
            )}
        </Container>
    );
};

export default InterviewQuestions;
