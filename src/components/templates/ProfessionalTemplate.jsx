import React from 'react';
import demo_profile from '../../assets/demo_profile.avif';

const ProfessionalTemplate = ({ resumeData }) => {
  return (
    <div style={{
      display: 'flex',
      maxWidth: '900px',
      margin: '0 auto',
      border: '1px solid #ccc',
      fontFamily: "'Inter', Tahoma, sans-serif",
      color: '#4e4e4e',
      background: '#fff'
    }}>
      {/* Left Section */}
      <div style={{
        width: '30%',
        backgroundColor: '#b48c7a',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={sectionTitleStyle}>PROFILE SUMMARY</h3>
          <p style={infoTextStyle}>
            {resumeData?.summary || 'Motivated software developer aiming to leverage strong problem-solving skills...'}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={sectionTitleStyle}>LANGUAGES</h3>
          <div style={infoTextStyle}>
            {(resumeData?.languages || []).map((lang, idx) => (
              <p key={idx}>{lang.language}: {lang.fluency}</p>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={sectionTitleStyle}>SKILLS</h3>
          <div style={infoTextStyle}>
            {(resumeData?.skill || []).map((skill, idx) => (
              <p key={idx}>{skill.name}</p>
            ))}
          </div>
        </div>

        <div>
          <h3 style={sectionTitleStyle}>CONTACT</h3>
          <div style={infoTextStyle}>
            <p>{resumeData?.phoneNumber?.[0]?.formattedNumber}</p>
            <p>{resumeData?.email?.[0]}</p>
            <p>{resumeData?.location?.formatted}</p>
            <p>{resumeData?.website?.[0]}</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div style={{
        width: '70%',
        padding: '30px',
        position: 'relative'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '500', paddingBottom: '10px' }}>
          {resumeData?.candidateName?.[0]?.firstName} {resumeData?.candidateName?.[0]?.familyName}
        </h2>
        <p style={{ fontWeight: '500', color: '#b48c7a' }}>{resumeData?.headline}</p>

{(resumeData?.profilePic || demo_profile) && (
  <img
    src={resumeData?.profilePic || demo_profile}
    alt="Profile"
    style={{
      width: '107px',
      height: '107px',
      borderRadius: '50%',
      objectFit: 'cover',
      position: 'absolute',
      top: '40px',
      right: '40px',
      boxShadow: '0px 0px 15px 3px #c1c1c1'
    }}
    onError={(e) => {
      console.error('Error loading profile image:', e);
      e.target.onerror = null;
      e.target.src = demo_profile;
    }}
  />
)}


        <Section title="PROFESSIONAL EXPERIENCE">
          {(resumeData?.workExperience || []).map((job, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <p style={{ fontWeight: '500', color: '#b48c7a' }}>{job.workExperienceJobTitle}</p>
              <p style={{ fontSize: '0.9em', marginBottom: '5px' }}>
                {job.workExperienceOrganization} | {job.workExperienceStartDate} – {job.workExperienceEndDate || 'Present'}
              </p>
              <p>{job.workExperienceDescription}</p>
            </div>
          ))}
        </Section>

        <Section title="EDUCATION">
          {(resumeData?.education || []).map((edu, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <p>{edu.educationAccreditation}<br />{edu.educationOrganization} | {edu.educationStartDate} – {edu.educationEndDate}</p>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

const sectionTitleStyle = {
  fontWeight: 600,
  marginTop: '50px',
  marginBottom: '12px',
  borderBottom: '2px solid white',
  paddingBottom: '6px'
};

const infoTextStyle = {
  fontSize: '15px',
  fontWeight: 400,
  lineHeight: 1.3,
  paddingLeft: '16px'
};

const Section = ({ title, children }) => (
  <div style={{ marginTop: '50px' }}>
    <h3 style={{
      fontWeight: 600,
      color: '#b48c7a',
      borderBottom: '2px solid #b48c7a',
      paddingBottom: '6px',
      marginBottom: '16px'
    }}>
      {title}
    </h3>
    {children}
  </div>
);

export default ProfessionalTemplate;
