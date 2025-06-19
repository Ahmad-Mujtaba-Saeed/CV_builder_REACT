<Card className="border-0 shadow-sm mt-5">
    <Card.Header className="bg-white border-bottom sticky-top">
        <h5 className="mb-0">Edit Your CV</h5>
    </Card.Header>
    <Card.Body>
        <Form>
            {/* Personal Information */}
            <div className="mb-4">
                <h6 className="text-primary mb-3">Personal Information</h6>

                {/* Profile Picture Upload */}
                {(selectedTemplate === "Professional" || selectedTemplate === "Professional2") && (
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

                        value={parsedResume?.headline || ''}
                        onChange={(e) => updateField("headline", e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Summary</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}

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

                        value={parsedResume?.email?.[0] || ''}
                        onChange={(e) => updateField("email", [e.target.value])}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Location</Form.Label>
                    <Form.Control

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

                        onClick={() => {
                            const newExp = {
                                workExperienceJobTitle: '',
                                workExperienceOrganization: '',
                                workExperienceDates: {
                                    start: {
                                        date: ''
                                    },
                                    end: {
                                        date: ''
                                    }
                                },
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

                                value={exp.workExperienceJobTitle || ''}
                                onChange={(e) => updateField(`workExperience[${index}].workExperienceJobTitle`, e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold">Company</Form.Label>
                            <Form.Control

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
                                    <Form.Label className="small fw-bold">End</Form.Label>
                                    <Form.Control
                                        type="text"

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
                            <Form.Label className="small fw-bold">Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}

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

                        onClick={() => {
                            const newEdu = {
                                educationAccreditation: '',
                                educationOrganization: '',
                                educationDates: {
                                    start: {
                                        date: ''
                                    },
                                    end: {
                                        date: ''
                                    }
                                },
                                educationDescription: ''
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

                                value={edu.educationAccreditation || ''}
                                onChange={(e) => updateField(`education[${index}].educationAccreditation`, e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label className="small fw-bold">Institution</Form.Label>
                            <Form.Control

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

                                        placeholder="2017"
                                        value={edu.educationDates?.start?.date || ''}
                                        onChange={(e) => {
                                            const updatedEdu = [...parsedResume.education];
                                            updatedEdu[index] = {
                                                ...updatedEdu[index],
                                                educationDates: {
                                                    ...(updatedEdu[index].educationDates || {}),
                                                    start: {
                                                        ...(updatedEdu[index].educationDates?.start || {}),
                                                        date: e.target.value
                                                    }
                                                }
                                            };
                                            updateField("education", updatedEdu);
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="small fw-bold">End</Form.Label>
                                    <Form.Control
                                        type="text"

                                        placeholder="2018"
                                        value={edu.educationDates?.end?.date || ''}
                                        onChange={(e) => {
                                            const updatedEdu = [...parsedResume.education];
                                            updatedEdu[index] = {
                                                ...updatedEdu[index],
                                                educationDates: {
                                                    ...(updatedEdu[index].educationDates || {}),
                                                    end: {
                                                        ...(updatedEdu[index].educationDates?.end || {}),
                                                        date: e.target.value
                                                    }
                                                }
                                            };
                                            updateField("education", updatedEdu);
                                        }}
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

                            variant="outline-primary"
                            onClick={() => {
                                if (currentSkill.trim()) {
                                    const currentSkills = parsedResume?.skill || [];
                                    updateField("skill", [...currentSkills, { name: currentSkill.trim() }]);
                                    setCurrentSkill('');
                                }
                            }}
                        >
                            Add Skill
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

                        className="me-2"
                        onClick={() => addCustomSection('description')}
                    >
                        <FiPlus /> Add Description Section
                    </Button>
                    <Button
                        variant="outline-primary"

                        className="me-2"
                        onClick={() => addCustomSection('entries')}
                    >
                        <FiPlus /> Add Entries Section
                    </Button>
                    <Button
                        variant="outline-primary"

                        className="me-2"
                        onClick={() => addCustomSection('skills')}
                    >
                        <FiPlus /> Add Skills Section
                    </Button>
                    <Button
                        variant="outline-primary"

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

                                value={section.title}
                                onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                                className="me-2"
                                style={{ width: 'auto' }}
                            />
                            <Button
                                variant="outline-danger"

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

                                                onClick={() => removeCustomEntry(section.id, index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-bold">Title</Form.Label>
                                            <Form.Control

                                                value={entry.title}
                                                onChange={(e) => updateCustomEntry(section.id, index, 'title', e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-bold">Subtitle</Form.Label>
                                            <Form.Control

                                                value={entry.subtitle}
                                                onChange={(e) => updateCustomEntry(section.id, index, 'subtitle', e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-bold">Date</Form.Label>
                                            <Form.Control

                                                value={entry.date}
                                                onChange={(e) => updateCustomEntry(section.id, index, 'date', e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-bold">Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}

                                                value={entry.description}
                                                onChange={(e) => updateCustomEntry(section.id, index, 'description', e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>
                                ))}
                                <Button
                                    variant="outline-primary"

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

                                                onClick={() => removeCustomSkill(section.id, index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-bold">Skill Name</Form.Label>
                                            <Form.Control

                                                value={skill.name}
                                                onChange={(e) => updateCustomSkill(section.id, index, 'name', e.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label className="small fw-bold">Skill Level</Form.Label>
                                            <Form.Select

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

                                                value={item}
                                                onChange={(e) => updateCustomListItem(section.id, index, e.target.value)}
                                                className="me-2"
                                            />
                                            <Button
                                                variant="outline-danger"

                                                onClick={() => removeCustomListItem(section.id, index)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="outline-primary"

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