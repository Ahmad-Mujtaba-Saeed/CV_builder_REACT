import React, { useEffect , useState } from "react";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import { FaRegClock, FaRegCalendarAlt , FaSearch} from "react-icons/fa";
import { CgRedo } from "react-icons/cg";
import "./DashboardLanding.css";
import axios from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FeedbackContext } from "../../../context/feedbackContext";

const DashboardLanding = () => {
    const navigate = useNavigate();
    const { parsedFeedback , setParsedFeedback} = useContext(FeedbackContext);
    const [interviewHistory, setInterviewHistory] = useState([]);
    // const [coachingSessions, setCoachingSessions] = useState([]);
    // const [recentActivities, setRecentActivities] = useState([]);


    const recentActivities = [
        { 
            action: "Create a new CV for 'Senior Graphic Designer'", 
            description: "Creative and detail-oriented Graphic Designer with over 5 years of experience delivering engaging visual content across digital...",
            link: "View in CV Builder"
        },
        { 
            action: "Achieved a score of 96% in General #073: Tell us about yourself", 
            description: "Feedback summary: Include specific roles, industries, and measurable experiences (e.g., '4 years in tech and retail sectors').",
            link: "View Feedback"
        },
        { 
            action: "Achieved a score of 69% in General #746: What are your strengths and weaknesses?", 
            description: "Highlight a few key strengths (e.g., communication, problem solving) with examples or proof...",
            link: "View Feedback"
        }
    ];

    const getInterviewHistory = async (searchTerm = "") => {
        try {
            const response = await axios.get(`/api/interview/history?limit=6&searchTerm=${searchTerm}`);
            setInterviewHistory(response.data);
        } catch (error) {
            console.error("Error fetching interview history:", error);
        }
    };

    const handleViewDetails = (item) => {
        console.log('Viewing details for interview:', item.id);
        setParsedFeedback(item);
        navigate(`/dashboard/question-feedback`);
    };

    const handleRetry = (interviewId) => {
        navigate(`/dashboard/practice-question/${interviewId}`);
        console.log('Retrying interview:', interviewId);
    };

    useEffect(() => {
        getInterviewHistory();
    }, []);

    const handleSearch = (searchTerm) => {
        if(searchTerm){
            getInterviewHistory(searchTerm);
        }
    };

    return (
        <div className="dashboard-container">


            <div className="welcome-section">
                <h1>Welcome to MyPathFinder</h1>
                <h2>Your AI Career Companion</h2>
                <p className="welcome-description">
                    Smart CV Builder, tailored for the Modern Job Market.
                    <br />
                    With cutting-edge AI, we take the stress out of applications. Instantly tailor your CV to hundreds of job roles with just one click.
                </p>
                <button className="primary-button">Launch's CV Builder</button>
            </div>

            <div className="dashboard-content">
                <div className="content-section interview-history">
                    <div className="search-container">
                        <h2>Interview History</h2>
                        <div className="search-bar">
                            <FiSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search interviews..." 
                                className="search-input"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <p className="section-subtitle">Tasks assigned to me</p>
                    <div className="history-list">
                        {interviewHistory.map((item, index) => (
                            <div key={index} className="history-item">
                                <div className="question-info">
                                    <span className="question-id">General #{item.id}:</span>
                                    <span className="question-text">{item.question?.speech}</span>
                                </div>
                                <div className="history-actions">
                                    <div className={`progress-status ${item?.status.toLowerCase().replace(' ', '-')}`}>
                                        {item?.status === "FAIL" ? (
                                            <span>{item?.evaluation?.score}% FAIL <span className="fail-x">X</span></span>
                                        ) : (
                                            <span>{item?.status}: {item?.evaluation?.score}%</span>
                                        )}
                                    </div>
                                    <div className="action-buttons">
                                        <button 
                                            className="view-button"
                                            onClick={() => handleViewDetails(item)}
                                        >
                                          <FaSearch />
                                        </button>
                                        <button 
                                            className="retry-button"
                                            onClick={() => handleRetry(item.id)}
                                        >
                                            <CgRedo size={20} /> 
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="activity-section">
                <h2>Activity</h2>
                <p className="section-subtitle">Recent activity across all areas of the platform</p>
                <div className="activity-list">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="activity-item">
                            <div className="activity-action">{activity.action}</div>
                            <div className="activity-description">{activity.description}</div>
                            <a href="#" className="activity-link">{activity.link}</a>
                        </div>
                    ))}
                </div>
            </div>
            </div>

        </div>
    );
};

export default DashboardLanding;