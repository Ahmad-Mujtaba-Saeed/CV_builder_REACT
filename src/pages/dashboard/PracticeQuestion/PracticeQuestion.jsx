import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "../../../utils/axios";
import { Spinner } from "react-bootstrap";
import "./PracticeQuestion.css";
import { motion } from "framer-motion";
import { UserContext } from "../../../context/UserContext";
import { FeedbackContext } from "../../../context/feedbackContext";
import { Dropdown } from 'bootstrap';
import Swal from "sweetalert2";
import { useCurrentQuestion } from "../../../context/CurrentQuestionContext";
import { baseUrl } from "../../../utils/axios";

const PracticeQuestion = () => {
   
    const { setParsedFeedback } = useContext(FeedbackContext);
    const { userData } = useContext(UserContext);
    const {currentQuestion , setCurrentQuestion , clearCurrentQuestion} = useCurrentQuestion();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [question, setQuestion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [hasMicAccess, setHasMicAccess] = useState(false);
    const videoRef = useRef(null);
    const boxRef = useRef(null);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [industry, setIndustry] = useState(null);
    const [businessSector, setBusinessSector] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
        });
    }, []);
    

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Set up audio context and analyzer
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 32; // Reduced for better performance
            analyserRef.current = analyser;
            
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            
            const bufferLength = analyser.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
            
            const recorder = new MediaRecorder(stream);
            let chunks = [];
            
            // Animation loop for audio level
            const updateAudioLevel = () => {
                if (!analyserRef.current) return;
                
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArrayRef.current[i];
                }
                const average = sum / bufferLength;
                // Better normalization - adjust these values based on testing
                const normalizedLevel = Math.min(Math.max((average - 20) / 50, 0), 1);
                setAudioLevel(normalizedLevel);
                
                animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
            };
            
            // Start the animation loop immediately
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    
            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };
    
            recorder.onstop = async () => {


                const blob = new Blob(chunks, { type: 'audio/webm' });
                const formData = new FormData();
                formData.append('audio', blob, 'answer.webm');
                formData.append('question_id', id);
    
                try {
                    setIsSubmitting(true);
                    const response = await axios.post('/api/interview/submit-audio', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            // Optional: You can add upload progress here if needed
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            console.log(`Upload progress: ${progress}%`);
                        }
                    });
                    setParsedFeedback(response.data);
                    navigate('/dashboard/question-feedback');
                } catch (error) {
                    console.error('Upload failed:', error);
                }
    

            };
    
            recorder.start();
            setMediaRecorder(recorder);
            setAudioChunks(chunks);
            setIsRecording(true);
        } catch (error) {
            console.error("Microphone error:", error);
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            try {
                // Stop the media recorder
                mediaRecorder.stop();
                
                // Stop all tracks in the stream
                if (mediaRecorder.stream) {
                    mediaRecorder.stream.getTracks().forEach(track => {
                        track.stop();
                    });
                }
                
                // Clean up audio context and animation frame
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }
                
                // Close audio context if it exists
                if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                }
                
                // Reset analyzer reference
                if (analyserRef.current) {
                    analyserRef.current.disconnect();
                    analyserRef.current = null;
                }
                
                // Reset state
                setIsRecording(false);
                setAudioLevel(0);
                setAudioChunks([]);
                
                console.log('Microphone access has been stopped');
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        }
    };
    
    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await axios.get(`/api/questions/${id}`);
                setQuestion(res.data.question);
                setIndustry(res.data.industry);
                setBusinessSector(res.data.business_sector);
            } catch (error) {
                console.error("Error fetching question:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestion();
        
        // Disable scrolling on mount
        document.body.style.overflow = 'hidden';
        
        // Re-enable scrolling on unmount
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [id]);

    useEffect(() => {
        if (isReady && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isReady && countdown === 0) {
            requestMicrophonePermission();
        }
    }, [isReady, countdown]);

    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setHasMicAccess(true);
            stream.getTracks().forEach(track => track.stop());
            
            if (videoRef.current) {
                await videoRef.current.requestFullscreen();
                videoRef.current.play();
            }
        } catch (error) {
            console.error("Error accessing microphone:", error);
            setIsReady(false);
            setCountdown(5);
        }
    };

    const handleStartInterview = () => {
        Swal.fire({
            title: 'Are you ready?',
            text: "you will be prompted when it’s time to answer, simply speak clearly into the micropohone! Click finalize answer when you have completed your response.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, start the interview!'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsReady(true);
            }
        });
    };
    const [nextQuestion, setNextQuestion] = useState(null);

    useEffect(() => {
        const index = currentQuestion.findIndex(q => q.id == id);
        const nextQuestion = currentQuestion[index + 1] || null;        
        if (nextQuestion) {
            setNextQuestion(nextQuestion);
        }
    }, [currentQuestion]);

    const handleSkipQuestion = () => {
        if (nextQuestion) {
            window.location.href = `/dashboard/practice-question/${nextQuestion.id}`;
        }
    };

    const handleExitInterview = () => {
        if (mediaRecorder && isRecording) {
            try {
                mediaRecorder.stop();
                
                if (mediaRecorder.stream) {
                    mediaRecorder.stream.getTracks().forEach(track => {
                        track.stop();
                    });
                }
                
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }
                
                // Close audio context if it exists
                if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                }
                
                // Reset analyzer reference
                if (analyserRef.current) {
                    analyserRef.current.disconnect();
                    analyserRef.current = null;
                }
                
                // Reset state
                setIsRecording(false);
                setAudioLevel(0);
                setAudioChunks([]);
                
                console.log('Microphone access has been stopped');
            } catch (error) {
                console.error('Error stopping recording:', error);
            }
        }
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        navigate('/');
    };

    const handleDragEnd = (event, info) => {
        const boxWidth = boxRef.current?.offsetWidth || 280;
        const boxHeight = boxRef.current?.offsetHeight || 200;
        
        let newX = info.point.x;
        let newY = info.point.y;
        
        // Constrain to viewport boundaries
        newX = Math.max(0, Math.min(newX, window.innerWidth - boxWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - boxHeight));
        
        setPosition({ x: newX, y: newY });
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!isReady) {
        return (
            <motion.div 
                className="interview-intro-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="intro-header">
                    {/* {currentQuestion?.map((question) => (
                        <>
                        <h1>New Question</h1>
                        </>
                    ))} */}
                    <h1>Prepare for your interview</h1>
                    <p>{industry?.name} 😊 {businessSector?.name}</p>
                </div>
                
                {/* <div className="navigation-section">
                    <motion.div 
                        className="nav-item"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3>Question Overview</h3>
                    </motion.div>
                    <motion.div 
                        className="nav-item"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3>View Feedback History</h3>
                    </motion.div>
                </div> */}
                <motion.div style={{display: 'flex', justifyContent: 'center'}}>
                <motion.button 
                    onClick={()=> navigate('/')}
                    className="start-button bg-warning"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{marginRight: '10px'}}
                >
                    <h4>Back to Main Menu</h4>
                </motion.button>
                
                <motion.button 
                    className="start-button"
                    onClick={handleStartInterview}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    I'm ready, start this interview
                </motion.button>
                </motion.div>
            </motion.div>
        );
    }

    if (isReady && !hasMicAccess) {
        return (
            <motion.div 
                className="countdown-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <h2>Starting interview in {countdown} seconds...</h2>
                <p>Please allow microphone access when prompted</p>
            </motion.div>
        );
    }

    return (
        <div className="video-container">
            
                <video 
                ref={videoRef}
                src={`${baseUrl}/videos/MPF Interview Questions/${question?.title.replace(/\?+$/, '_')}.mp4`} 
                autoPlay 
                muted={!hasMicAccess}
                controls={false}
                onEnded={startRecording}
                className={`fullscreen-video ${isRecording ? 'd-none' : ''}`}
            />
           
                <video 
                ref={videoRef}
                src={`${baseUrl}/videos/MPF Interview Filler/Avatar ${question?.avatar} FILLER.mp4`} 
                 autoPlay
                muted={!hasMicAccess}
                controls={false}
                loop
                className={`fullscreen-video ${!isRecording ? 'd-none' : ''}`}
            />
            <motion.div 
                ref={boxRef}
                className="floating-box"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                drag
                dragConstraints={{
                    top: 0,
                    left: 0,
                    right: window.innerWidth - (boxRef.current?.offsetWidth || 280),
                    bottom: window.innerHeight - (boxRef.current?.offsetHeight || 200)
                }}
                onDragEnd={handleDragEnd}
                dragElastic={0}
                dragMomentum={false}
            >
                <div className="box-header">
                    <h3>{userData?.name}</h3>
                    <p>{userData?.email}</p>
                </div>
                <div className="box-row p-2" style={{marginLeft: '10px'}}>
    <center ><h4>Answer the Question</h4></center>
    {isRecording && (
        <div className="audio-visualizer mb-3" style={{ width: '100%', padding: '10px' }}>
    <div 
        className="audio-level" 
        style={{
            height: '20px',
            width: '100%',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '8px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}
    >
        <div 
            style={{
                height: '100%',
                width: `${audioLevel * 100}%`,
                backgroundColor: audioLevel > 0.5 ? '#4CAF50' : 
                                audioLevel > 0.2 ? '#FFC107' : '#F44336',
                transition: 'width 0.05s ease-out, background-color 0.2s ease',
                borderRadius: '10px'
            }}
        ></div>
    </div>
    <div className="text-center text-muted small">
        {audioLevel > 0.5 ? '🎤 Loud and clear!' : 
         audioLevel > 0.2 ? '🎤 Keep going...' : '🔴 Waiting for input...'}
    </div>
</div>
    )}
    {isRecording && (
        <motion.button
            onClick={stopRecording}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="stop-btn btn-success w-100"
        >
            ✅ Finalize Answer
        </motion.button>
    )}
    {isSubmitting && (
        <div className="position-fixed top-50 start-50 translate-middle text-center" style={{ zIndex: 1050, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '2rem', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}>
            <div className="mb-3">
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            </div>
            <h4>Finalizing Your Report</h4>
            <p className="text-muted">Please wait while we analyze your response...</p>
            <div className="progress mt-3" style={{ height: '10px' }}>
                <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    role="progressbar" 
                    style={{ width: '100%' }}
                ></div>
            </div>
        </div>
    )}
</div>
<div className="dropdown mb-3">
    <button 
        className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center" 
        type="button" 
        id="questionOverviewDropdown" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
    >
        <span>Question Overview</span>
        <i className="bi bi-chevron-down"></i>
    </button>
    <ul className="dropdown-menu w-100" aria-labelledby="questionOverviewDropdown">
            <li>
                {question?.speech}
            </li>
    </ul>
</div>
                {/* 
                    <div className="box-row">
                        <h4>View Feedback History</h4>
                    </div>
                </div> */}
                <div className="box-footer">
                    <motion.button 
                        disabled={nextQuestion == null}
                        onClick={handleSkipQuestion}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip to next question
                    </motion.button>
                    <motion.button 
                        onClick={handleExitInterview}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="exit-btn btn-danger w-100"
                    >
                        Exit Interview
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default PracticeQuestion;