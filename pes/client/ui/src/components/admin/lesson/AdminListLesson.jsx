import { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Container } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';

import DataService from '../utils/DataService';

export default function AdminListLesson() {
    const [lessons, setLessons] = useState([]);

    const { register, handleSubmit, reset } = useForm();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchData();

        const unsubscribe = DataService.addListener('lessons', fetchData);
        return () => unsubscribe();
    }, []);

    const fetchData = () => {
        try {
            const data = DataService.getLessons();
            const sortedData = data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            setLessons(sortedData);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        }
    };

    const handleDelete = (id) => {
        try {
            const success = DataService.deleteLesson(id);
            if (!success) {
                toast.error("Lesson not found!");
                return;
            }
            toast.success("Lesson deleted successfully!");
        } catch (error) {
            console.error(error.message);
            toast.error("Lesson deletion failed!");
        }
    };

    const onSubmit = (formData) => {
        try {
            if (editMode && editId) {
                const updatedLesson = DataService.updateLesson(editId, formData);
                if (!updatedLesson) {
                    toast.error("Failed to update lesson!");
                    return;
                }
                toast.success("Lesson updated successfully!");
            } else {
                const existingLesson = lessons.find(l => l.title.toLowerCase() === formData.title.toLowerCase());
                if (existingLesson) {
                    toast.error("Lesson with this title already exists!");
                    return;
                }

                const newLesson = DataService.createLesson(formData);
                if (!newLesson) {
                    toast.error("Failed to create lesson!");
                    return;
                }
                toast.success("Lesson added successfully!");
            }

            reset();
            setEditMode(false);
            setEditId(null);
            handleClose();
        } catch (error) {
            console.error("Error with lesson:", error);
            toast.error("An error occurred!");
        }
    };

    const handleEdit = (lesson) => {
        setEditMode(true);
        setEditId(lesson.id);
        reset({
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration,
            materials: lesson.materials
        });
        handleShow();
    };

    return (
        <Container className="mt-5">
            <Toaster position="top-right" reverseOrder={false} />
            <h3 className="mb-4">Manage Lessons</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2">Duration</th>
                        <th className="border p-2">Materials</th>
                        <th className="border p-2">
                            <Button onClick={() => {
                                setEditMode(false);
                                setEditId(null);
                                reset({
                                    title: '',
                                    description: '',
                                    duration: '',
                                    materials: ''
                                });
                                handleShow();
                            }} type='button' className="btn btn-primary">
                                <i className="bi bi-node-plus"> Add new lesson</i>
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map(item => (
                        <tr key={item.id}>
                            <td className="border p-2">{item.id}</td>
                            <td className="border p-2"><strong>{item.title}</strong></td>
                            <td className="border p-2">{item.description}</td>
                            <td className="border p-2">{item.duration}</td>
                            <td className="border p-2">{item.materials}</td>
                            <td className="border p-2">
                                <Button
                                    variant="info"
                                    className="me-2"
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete this lesson?")) {
                                            handleDelete(item.id);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Edit Lesson' : 'Add New Lesson'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Lesson Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Lesson Title"
                                autoFocus
                                {...register("title", { required: true })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Description"
                                {...register("description", { required: true })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g., 30 minutes"
                                {...register("duration", { required: true })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Materials</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Required materials"
                                {...register("materials", { required: true })}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                {editMode ? 'Save Changes' : 'Add Lesson'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
