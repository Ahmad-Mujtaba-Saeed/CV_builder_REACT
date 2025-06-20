import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const Template5 = ({ resumeData }) => {
    console.log(resumeData);
    const customSections = resumeData?.customSections;
    console.log(customSections);
    const styles = {
        container: {
          maxWidth: '850px',
          margin: '0px auto',
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fff'
        },
        header: {
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#000',
          color: '#c9c9c9',
          padding: '20px'
        },
        profileImage: {
          width: '120px',
          height: '120px',
          borderRadius: '0%',
          objectFit: 'cover',
          marginRight: '25px',
          border: '1px solid #e0e0e0',
          borderBottom: 'none'
        },
        name: {
          fontSize: '28px',
          fontWeight: 'normal',
          color: '#c9c9c9',
          margin: 0
        },
        contact: {
          margin: '6px 0',
          fontSize: '14px',
          color: '#898686'
        },
        pageContainer: {
          border: '1px solid #e0e0e0',
          display: 'flex'
        },
        leftSection: {
          width: '516px',
          padding: '40px'
        },
        rightSidebar: {
          width: '278px',
          backgroundColor: '#f7f7f7',
          padding: '40px'
        },
        section: {
          marginBottom: '30px'
        },
        sectionTitle: {
          fontSize: '18px',
          color: '#333',
          borderBottom: '2px solid #ccc',
          paddingBottom: '6px',
          margin: 0
        },
        sectionText: {
          margin: '12px 0 30px',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#444'
        },
        jobEntry: {
          marginTop: '20px'
        },
        jobTitle: {
          margin: '0',
          fontSize: '15px',
          fontWeight: 'bold',
          color: '#222'
        },
        period: {
          float: 'right',
          fontSize: '13px',
          fontWeight: 'normal',
          color: '#555'
        },
        company: {
          margin: '4px 0',
          fontSize: '14px',
          color: '#666'
        },
        list: {
          margin: '6px 0 0 20px',
          padding: 0,
          fontSize: '14px',
          color: '#444',
          lineHeight: '1.5'
        },
        sidebarSection: {
          marginBottom: '30px'
        },
        sidebarTitle: {
          fontSize: '16px',
          color: '#333',
          borderBottom: '1px solid #ccc',
          paddingBottom: '6px',
          margin: 0
        },
        sidebarText: {
          margin: '12px 0 0 0',
          fontSize: '14px',
          color: '#555',
          lineHeight: '1.4'
        },
        link: {
          color: '#333',
          textDecoration: 'none',
          fontWeight: 'bold'
        },
        languageBar: {
          marginBottom: '16px'
        },
        barBackground: {
          backgroundColor: '#e0e0e0',
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          marginTop: '4px'
        },
        barFill: {
          backgroundColor: '#333',
          height: '6px',
          borderRadius: '3px'
        }
      };
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <img src={resumeData?.profilePic || demo_profile} alt="Profile" style={styles.profileImage} />
        <div>
          <h1 style={styles.name}>
          {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
          </h1>
          <p style={styles.contact}>{resumeData?.email?.[0]} | {resumeData?.phoneNumber?.[0]?.formattedNumber}</p>
          <p style={styles.contact}>{resumeData?.location?.formatted}</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={styles.pageContainer}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          {/* Profile Summary */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Profile</h2>
            <p style={styles.sectionText}>{resumeData?.summary || '...'}</p>
          </section>

          {/* Employment History */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Employment</h2>
            {resumeData?.workExperience?.map((job, idx) => (
              <div key={idx} style={styles.jobEntry}>
                <p style={styles.jobTitle}>
                  {job.workExperienceJobTitle}
                  <span style={styles.period}>{job.workExperienceDates?.start?.date} – {job.workExperienceDates?.end?.date || 'Present'}</span>
                </p>
                <p style={styles.company}>{job.workExperienceOrganization}</p>
                <p style={styles.sectionText}>{job.workExperienceDescription}</p>
              </div>
            ))}
          </section>

          {/* Education */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Education</h2>
            {resumeData?.education?.map((edu, idx) => (
              <div key={idx} style={styles.jobEntry}>
                <p style={styles.jobTitle}>
                  {edu.educationAccreditation}
                  <span style={styles.period}>{edu.educationDates?.start?.date} – {edu.educationDates?.end?.date}</span>
                </p>
                <p style={styles.company}>{edu.educationOrganization}</p>
                <p style={styles.sectionText}>{edu.educationDescription}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Right Sidebar */}
        <div style={styles.rightSidebar}>
          {/* Personal Details */}
          <section style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Personal Details</h3>
            <p style={styles.sidebarText}>
              Website<br />
              <a href="#" style={styles.link}>{resumeData?.website?.[0]}</a>
            </p>
          </section>

          {/* Languages */}
          <section style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Languages</h3>
            {resumeData?.languages?.map((lang, idx) => {
              let width;
              switch(lang.level) {
                case 'Native': width = '90%'; break;
                case 'Advanced': width = '70%'; break;
                case 'Intermediate': width = '50%'; break;
                case 'Beginner': width = '30%'; break;
                default: width = '50%';
              }
              
              return (
              <div key={idx} style={styles.languageBar}>
                <span>{lang.name}</span>
                <div style={styles.barBackground}>
                  <div style={{ ...styles.barFill, width: `${width}` }}></div>
                </div>
              </div>
              );
            })}
          </section>

          {/* Qualities */}
          <section style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Qualities</h3>
            <ul style={styles.list}>
              {resumeData?.qualities?.map((quality, idx) => (
                <li key={idx}>{quality}</li>
              ))}
            </ul>
          </section>

          {/* Hobbies */}
          <section style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Hobbies</h3>
            <ul style={styles.list}>
              {resumeData?.hobbies?.map((hobby, idx) => (
                <li key={idx}>{hobby}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

// Styles


export default Template5;