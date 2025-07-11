import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Table, Modal, Spinner, Alert } from "react-bootstrap";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import axios from "../../../utils/axios";

const ManageCategories = () => {
    const [activeTab, setActiveTab] = useState('difficulties');
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });
    const [parentItems, setParentItems] = useState([]);
    const [selectedParent, setSelectedParent] = useState('');

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            setError('');
            let url = `/api/filters/${activeTab}`;
            
            if (activeTab === 'subcategories' && selectedParent) {
                url = `/api/filters/question-types/${selectedParent}/subcategories`;
            }
            
            const response = await axios.get(url);
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch items. Please try again.');
            console.error('Error fetching items:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchQuestionTypes = async () => {
        try {
            const response = await axios.get('/api/filters/question-types');
            setParentItems(response.data);
        } catch (err) {
            console.error('Error fetching question types:', err);
        }
    };

    useEffect(() => {
        fetchItems();
        if (activeTab === 'subcategories') {
            fetchQuestionTypes();
        }
    }, [activeTab, selectedParent]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({ name: '', slug: '' });
        setEditingItem(null);
        setSelectedParent('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            
            // if (activeTab === 'subcategories' && !selectedParent) {
            //     setError('Please select a question type');
            //     return;
            // }

            const data = { ...formData };
            // if (activeTab === 'subcategories') {
            //     data.question_type_id = selectedParent;
            // }

            if (editingItem) {
                await axios.put(`/api/filters/${activeTab}/${editingItem.id}`, data);
            } else {
                await axios.post(`/api/filters/${activeTab}`, data);
            }
            
            setShowModal(false);
            resetForm();
            fetchItems();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            console.error('Error saving item:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            slug: item.slug || ''
        });
        // if (activeTab === 'subcategories') {
        //     setSelectedParent(item.question_type_id);
        // }
        setShowModal(true);
    };

    // const handleDelete = async (id) => {
    //     if (window.confirm('Are you sure you want to delete this item?')) {
    //         try {
    //             setIsLoading(true);
    //             await axios.delete(`/api/filters/${activeTab}/${id}`);
    //             fetchItems();
    //         } catch (err) {
    //             setError('Failed to delete item. It might be in use.');
    //             console.error('Error deleting item:', err);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    // };

    const renderTable = () => {
        if (isLoading) {
            return (
                <div className="text-center p-5">
                    <Spinner animation="border" />
                </div>
            );
        }

        if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }

        if (items.length === 0) {
            return <Alert variant="info">No items found</Alert>;
        }

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        {/* <th>Slug</th>
                        {activeTab === 'subcategories' && <th>Question Type</th>} */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            {/* <td>{item.slug}</td>
                            {activeTab === 'subcategories' && (
                                <td>{item.question_type?.name || 'N/A'}</td>
                            )} */}
                            <td>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(item)}
                                >
                                    <Pencil size={16} />
                                </Button>
                                {/* <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                >
                                    <Trash2 size={16} />
                                </Button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderForm = () => (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            {/* {activeTab === 'subcategories' && (
                <Form.Group className="mb-3">
                    <Form.Label>Question Type</Form.Label>
                    <Form.Select
                        value={selectedParent}
                        onChange={(e) => setSelectedParent(e.target.value)}
                        required
                        disabled={!!editingItem}
                    >
                        <option value="">Select Question Type</option>
                        {parentItems.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            )} */}
            
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>
            
            {/* <Form.Group className="mb-3">
                <Form.Label>Slug (optional)</Form.Label>
                <Form.Control
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="Will be generated from name if left empty"
                />
            </Form.Group> */}
            
            <div className="d-flex justify-content-end gap-2">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setShowModal(false);
                        resetForm();
                    }}
                    disabled={isLoading}
                >
                    <X size={16} className="me-1" /> Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Spinner animation="border" size="sm" className="me-1" />
                    ) : (
                        <Save size={16} className="me-1" />
                    )}
                    {editingItem ? 'Update' : 'Save'}
                </Button>
            </div>
        </Form>
    );

    return (
        <Container fluid className="py-4">
            <h1 className="mb-4">Manage Categories</h1>
            
            <Card className="mb-4">
                <Card.Header className="bg-white">
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'difficulties' ? 'active' : ''}`}
                                onClick={() => setActiveTab('difficulties')}
                            >
                                Difficulties
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'question-types' ? 'active' : ''}`}
                                onClick={() => setActiveTab('question-types')}
                            >
                                Question Types
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'subcategories' ? 'active' : ''}`}
                                onClick={() => setActiveTab('subcategories')}
                            >
                                Subcategories
                            </button>
                        </li>
                    </ul>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">
                            {activeTab === 'difficulties' && 'Difficulty Levels'}
                            {activeTab === 'question-types' && 'Question Types'}
                            {activeTab === 'subcategories' && 'Subcategories'}
                        </h5>
                        {/* <Button
                            variant="primary"
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                        >
                            <Plus size={16} className="me-1" />
                            Add New
                        </Button> */}
                    </div>
                    
                    {renderTable()}
                </Card.Body>
            </Card>
            
            <Modal show={showModal} onHide={() => !isLoading && setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingItem ? 'Edit' : 'Add New'} 
                        {activeTab === 'difficulties' && 'Difficulty Level'}
                        {activeTab === 'question-types' && 'Question Type'}
                        {activeTab === 'subcategories' && 'Subcategory'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderForm()}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ManageCategories;