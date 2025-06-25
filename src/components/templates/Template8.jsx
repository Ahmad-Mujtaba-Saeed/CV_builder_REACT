import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template8 = ({ resumeData }) => {
  const styles = {
    container: {
      display: 'flex',
      maxWidth: '850px',
      margin: '0 auto',
      backgroundColor: 'white',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    },
    leftSidebar: {
      width: '250px',
      backgroundColor: '#943b2b',
      color: 'white',
      padding: '30px 20px',
      boxSizing: 'border-box'
    },
    profileHeader: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    profileName: {
      margin: '0 0 20px 0',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    profileImageContainer: {
      width: '110px',
      height: '110px',
      borderRadius: '50%',
      overflow: 'hidden',
      margin: '0 auto',
      border: '3px solid white'
    },
    profileImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    sectionTitle: {
      margin: '0 0 15px 0',
      fontSize: '14px',
      fontWeight: 'bold',
      color: 'white'
    },
    detailItem: {
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center'
    },
    detailIcon: {
      width: '16px',
      height: '16px',
      marginRight: '10px'
    },
    detailText: {
      fontSize: '12px'
    },
    addressText: {
      fontSize: '12px',
      lineHeight: '16px'
    },
    languageContainer: {
      marginBottom: '15px'
    },
    languageName: {
      marginBottom: '5px',
      fontSize: '12px'
    },
    languageBar: {
      display: 'flex',
      gap: '2px'
    },
    languageDot: {
      width: '25px',
      height: '4px',
      backgroundColor: 'white',
      borderRadius: '2px'
    },
    languageDotInactive: {
      width: '25px',
      height: '4px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '2px'
    },
    qualityItem: {
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center'
    },
    qualityDot: {
      width: '8px',
      height: '8px',
      backgroundColor: 'white',
      marginRight: '8px'
    },
    rightContent: {
      flex: 1,
      padding: '30px',
      backgroundColor: 'white'
    },
    contentSection: {
      marginBottom: '30px'
    },
    contentTitle: {
      margin: '0 0 15px 0',
      fontSize: '18px',
      color: '#4a6fa5',
      fontWeight: 'bold'
    },
    contentText: {
      margin: 0,
      fontSize: '12px',
      lineHeight: '1.6',
      color: '#333',
      textAlign: 'justify'
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px'
    },
    jobTitle: {
      margin: 0,
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#333'
    },
    jobDate: {
      fontSize: '12px',
      color: '#4a6fa5',
      fontWeight: 'bold'
    },
    companyName: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '8px'
    },
    bulletList: {
      margin: 0,
      paddingLeft: '15px',
      fontSize: '12px',
      lineHeight: '1.5',
      color: '#333'
    },
    bulletItem: {
      marginBottom: '5px'
    }
  };

  const renderLanguageLevel = (level) => {
    switch(level) {
      case 'Native':
        return [1, 1, 1, 1, 1];
      case 'Advanced':
        return [1, 1, 1, 1, 0];
      case 'Intermediate':
        return [1, 1, 1, 0, 0];
      case 'Beginner':
        return [1, 1, 0, 0, 0];
      default:
        return [1, 1, 1, 0, 0];
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Sidebar */}
      <div style={styles.leftSidebar}>
        {/* Profile Photo and Name */}
        <div style={styles.profileHeader}>
          <h1 style={styles.profileName}>
            {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
          </h1>
          <div style={styles.profileImageContainer}>
            <img 
              src={resumeData?.profilePic || demo_profile} 
              alt="Profile" 
              style={styles.profileImage} 
            />
          </div>
        </div>

        {/* Personal Details */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={styles.sectionTitle}>Personal details</h3>

          <div style={styles.detailItem}>
            <div style={styles.detailIcon}>👤</div>
            <span style={styles.detailText}>
              {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
            </span>
          </div>

          {resumeData?.email?.[0] && (
            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>✉️</div>
              <span style={styles.detailText}>{resumeData.email[0]}</span>
            </div>
          )}

          {resumeData?.phoneNumber?.[0]?.formattedNumber && (
            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>📞</div>
              <span style={styles.detailText}>{resumeData.phoneNumber[0].formattedNumber}</span>
            </div>
          )}

          {resumeData?.location?.formatted && (
            <div style={{ ...styles.detailItem, alignItems: 'flex-start' }}>
              <div style={{ ...styles.detailIcon, marginTop: '2px' }}>🏠</div>
              <span style={styles.addressText}>
                {resumeData.location.formatted.split(',').map((line, i) => (
                  <React.Fragment key={i}>
                    {line.trim()}
                    {i < resumeData.location.formatted.split(',').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            </div>
          )}

          {resumeData?.website?.[0] && (
            <div style={styles.detailItem}>
              <div style={styles.detailIcon}>💼</div>
              <span style={styles.detailText}>
                {resumeData.website[0].replace(/^https?:\/\//, '')}
              </span>
            </div>
          )}
        </div>

        {/* Languages */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={styles.sectionTitle}>Languages</h3>
          
          {resumeData?.languages?.map((lang, index) => {
            const levels = renderLanguageLevel(lang.level);
            return (
              <div key={index} style={styles.languageContainer}>
                <div style={styles.languageName}>{lang.name}</div>
                <div style={styles.languageBar}>
                  {levels.map((active, i) => (
                    <div 
                      key={i} 
                      style={active ? styles.languageDot : styles.languageDotInactive}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Qualities */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={styles.sectionTitle}>Qualités</h3>
          
          {resumeData?.qualities?.map((quality, index) => (
            <div key={index} style={styles.qualityItem}>
              <div style={styles.qualityDot} />
              <span style={styles.detailText}>{quality}</span>
            </div>
          ))}
        </div>

        {/* Hobbies */}
        <div>
          <h3 style={styles.sectionTitle}>Hobbies</h3>
          
          {resumeData?.hobbies?.map((hobby, index) => (
            <div key={index} style={styles.qualityItem}>
              <div style={styles.qualityDot} />
              <span style={styles.detailText}>{hobby}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div style={styles.rightContent}>
        {/* Profile Section */}
        <div style={styles.contentSection}>
          <h2 style={styles.contentTitle}>Profile</h2>
          <p style={styles.contentText}>
            {resumeData?.summary || 'Professional summary goes here...'}
          </p>
        </div>

        {/* Employment Section */}
        <div style={styles.contentSection}>
          <h2 style={styles.contentTitle}>Employment</h2>
          
          {resumeData?.workExperience?.map((job, index) => (
            <div key={index} style={{ marginBottom: index === resumeData.workExperience.length - 1 ? 0 : '25px' }}>
              <div style={styles.jobHeader}>
                <h3 style={styles.jobTitle}>{job.workExperienceJobTitle}</h3>
                <span style={styles.jobDate}>
                  {job.workExperienceDates?.start?.date} - {job.workExperienceDates?.end?.date || 'Present'}
                </span>
              </div>
              <div style={styles.companyName}>{job.workExperienceOrganization}</div>
              {job.workExperienceDescription && (
                <ul style={styles.bulletList}>
                  {job.workExperienceDescription.split('\n').map((item, i) => (
                    <li key={i} style={styles.bulletItem}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div>
          <h2 style={styles.contentTitle}>Education</h2>
          
          {resumeData?.education?.map((edu, index) => (
            <div key={index} style={{ marginBottom: index === resumeData.education.length - 1 ? 0 : '20px' }}>
              <div style={styles.jobHeader}>
                <h3 style={styles.jobTitle}>{edu.educationAccreditation}</h3>
                <span style={styles.jobDate}>
                  {edu.educationDates?.start?.date} - {edu.educationDates?.end?.date}
                </span>
              </div>
              <div style={styles.companyName}>{edu.educationOrganization}</div>
              {edu.educationDescription && (
                <p style={styles.contentText}>{edu.educationDescription}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Template8;