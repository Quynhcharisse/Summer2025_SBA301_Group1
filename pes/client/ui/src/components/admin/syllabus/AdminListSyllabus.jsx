import { useState, useEffect } from 'react';
import { Table, Modal, Button, Form, Container } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import DataService from '../utils/DataService';

export default function AdminListSyllabus() {
    const [syllabi, setSyllabi] = useState([]);

    const { register, handleSubmit, reset } = useForm();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchData();
        
        const unsubscribe = DataService.addListener('syllabi', fetchData);
        return () => unsubscribe();
    }, []);

    const fetchData = () => {
        try {
            const data = DataService.getSyllabi();
            const sortedData = data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            setSyllabi(sortedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = (id) => {
        try {
            const success = DataService.deleteSyllabus(id);
            if (!success) {
                toast.error("Syllabus not found!");
                return;
            }
            toast.success("Syllabus deleted successfully!");
        } catch (error) {
            console.log(error.message);
            toast.error("Syllabus deletion failed!");
        }
    };

    const onSubmit = (formData) => {
        try {
            console.log("Form submitted:", formData);
            
            const existingSyllabus = syllabi.find(s => s.title.toLowerCase() === formData.title.toLowerCase());
            if (existingSyllabus) {
                toast.error("Syllabus with this title already exists!");
                return;
            }
            
            const newSyllabus = DataService.createSyllabus({
                title: formData.title,
                description: formData.description
            });
            
            if (!newSyllabus) {
                toast.error("Failed to create syllabus!");
                return;
            }
            
            reset();
            handleClose();
            toast.success("Syllabus added successfully!");
        } catch (error) {
            console.error("Error creating syllabus:", error);
            toast.error("An error occurred while adding syllabus!");
        }
    };

    return (
        <Container className="mt-5">
              <Toaster position="top-right" reverseOrder={false} />
              <h3 className="mb-4">Manage Syllabus</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>
                            <Button onClick={handleShow} type='button' className="btn btn-primary">
                                <i className="bi bi-node-plus"> Add new syllabus</i>
                            </Button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {syllabi.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td><strong>{item.title}</strong></td>
                            <td>{item.description}</td>
                            <td>
                                <Link to={`/Syllabus/${item.id}`}>
                                    <i className="bi bi-pencil-square"> Edit </i>
                                </Link>
                                <Link to={`/Syllabus/${item.id}/Lessons`} className="ms-2">
                                    <i className="bi bi-journal-text"> Manage Lessons </i>
                                </Link>
                                <Button
                                    variant="danger"
                                    className="bg-red-500 text-white px-2 py-1 ms-2"
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete this syllabus?")) { handleDelete(item.id) }
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
                    <Modal.Title>Add Syllabus</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-2">
                            <Form.Label>Syllabus Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Syllabus Title"
                                autoFocus
                                {...register("title", { required: true })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Description"
                                {...register("description", { required: true })}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Syllabus
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
