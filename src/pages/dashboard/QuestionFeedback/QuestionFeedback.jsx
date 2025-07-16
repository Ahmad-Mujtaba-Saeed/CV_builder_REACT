import React from "react";
import { UserContext } from "../../../context/UserContext";
import { FeedbackContext } from "../../../context/feedbackContext";
import { useContext } from "react";
import "./QuestionFeedback.css";
import { useNavigate } from "react-router-dom";

const QuestionFeedback = () => {
    const { userData } = useContext(UserContext);
    const { parsedFeedback } = useContext(FeedbackContext);
    const navigate = useNavigate();
    
    return (
        <div className="feedback-container">
            <div className="feedback-header">
                <div className="d-flex justify-content-between">
                {parsedFeedback?.evaluation?.score < 40 
  ? <h1>Please review the feedback and try the question again.</h1> 
  : <h1>Great job on completing your interview practice!</h1>}

                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-outline-primary d-flex align-items-center gap-1"
                        onClick={() => navigate('/')}
                    >
                        <i className="bi bi-house-door"></i> Main Menu
                    </button>
                    <button 
                        className="btn btn-primary d-flex align-items-center gap-1"
                        onClick={() => navigate('/dashboard/practice-question/' + parsedFeedback?.question?.id)}
                    >
                        <i className="bi bi-arrow-repeat"></i> Retry
                    </button>
                </div>
                </div>
            </div>
            
            <div className="feedback-content">
                <div className="left-column">
                    <div className="score-section">
                        <h2>Your Score</h2>
                        <div className="question-title">
                            <h3>{parsedFeedback?.question?.speech}</h3>
                            <span>{parsedFeedback?.industry?.name}</span>
                        </div>
                        
                        <div className="page-indicator">(PAGE)</div>
                        
                        <div className="score-table">
                            <table>
                                <tbody>
                                    <tr>
                                        <td rowSpan="3" className="score-percentage">{parsedFeedback?.evaluation?.score}%</td>
                                        <td>Perfect response</td>
                                        <td className="percentage">73%</td>
                                    </tr>
                                    <tr>
                                        <td>Core skills missing</td>
                                        <td className="percentage">18%</td>
                                    </tr>
                                    <tr>
                                        <td>Minor skills missing</td>
                                        <td className="percentage">10%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <div className="core-feedback">
                        <h2>Core feedback</h2>
                        <ul>
                            {parsedFeedback?.evaluation?.issues?.map((issue, index) => (
                                <li key={index}>
                                    <strong>{issue.title}</strong><br />
                                    {issue.description}
                                </li>
                            ))}
                            {/* <li>
                                <strong>Too Vague</strong><br />
                                Include specific roles, industries, and measurable experiences (e.g., "4 years in tech and retail sectors").
                            </li>
                            <li>
                                <strong>No clear value proposition</strong><br />
                                Highlight a few key strengths (e.g., communication, problem solving) with examples or proof.
                            </li>
                            <li>
                                <strong>Lacks structure</strong><br />
                                Use a 3-part flow past experience – present motivation – future goal aligned with the company.
                            </li> */}
                        </ul>
                    </div>
                </div>
                
                <div className="right-column">
                    <div className="feedback-transcript">
                        <h2>Feedback transcript</h2>
                        <div className="transcript-item">
                            <p className="question"><strong>Question asked by MyPathfinder</strong></p>
                            <p className="quote">{parsedFeedback?.question?.speech}</p>
                        </div>
                        
                        <div className="transcript-item">
                            <p className="response"><strong>Your response</strong></p>
                            <p className="quote">{parsedFeedback?.transcription}</p>
                        </div>
                        
                        <div className="transcript-item">
                            <p className="ideal"><strong>Ideal Response by MyPathfinder</strong></p>
                            <p className="quote">{parsedFeedback?.evaluation?.ideal_response}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionFeedback;