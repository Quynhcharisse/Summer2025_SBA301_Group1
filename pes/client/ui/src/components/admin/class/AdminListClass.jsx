import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import DataService from '../utils/DataService';

export default function AdminListClass() {
  const [classes, setClasses] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchClasses();
    fetchSyllabi();
    
    const unsubscribeClasses = DataService.addListener('classes', fetchClasses);
    const unsubscribeSyllabi = DataService.addListener('syllabi', fetchSyllabi);
    
    return () => {
      unsubscribeClasses();
      unsubscribeSyllabi();
    };
  }, []);

  const fetchClasses = () => {
    try {
      const data = DataService.getClasses();
      setClasses(data.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSyllabi = () => {
    try {
      const data = DataService.getSyllabi();
      setSyllabi(data.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    } catch (error) {
      console.error('Error fetching syllabi:', error);
    }
  };

  const handleDelete = (id) => {
    try {
      const success = DataService.deleteClass(id);
      if (!success) {
        toast.error("Class not found!");
        return;
      }
      toast.success("Class deleted successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error("Class deletion failed!");
    }
  };

  const onSubmit = (data) => {
    try {
      if (classes.some(c => c.name === data.name)) {
        toast.error("Class already exists!");
        return;
      }

      const newClass = DataService.createClass(data);
      if (!newClass) {
        toast.error("Class creation failed!");
        return;
      }
      
      reset();
      setShow(false);
      toast.success("Class added successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error("Class addition failed!");
    }
  };

  return (
    <Container className="mt-5">
      <Toaster position="top-right" reverseOrder={false} />
      <h3 className="mb-4">Manage Class</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Teacher ID</th>
            <th className="border p-2">Syllabus ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Students</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Start</th>
            <th className="border p-2">End</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Grade</th>
            <th className="border p-2">
              <Button onClick={handleShow} type='button' className="btn btn-primary">
                <i className="bi bi-node-plus"> Add new class</i>
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.id}</td>
              <td className="border p-2">{c.teacher_id}</td>
              <td className="border p-2">{c.syllabus_id}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.number_students}</td>
              <td className="border p-2">{c.room_number}</td>
              <td className="border p-2">{c.start_date}</td>
              <td className="border p-2">{c.end_date}</td>
              <td className="border p-2">{c.status}</td>
              <td className="border p-2">{c.grade}</td>
              <td className="border p-2">
                <Link to={`/Class/${c.id}`}>
                  <i className="bi bi-pencil-square"> Edit </i>
                </Link>
                <Button
                  className="text-white px-2 py-1 ms-2"
                  variant='danger'
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this class?")) { handleDelete(c.id) }
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="mb-4 grid grid-cols-5 gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-2">
              <Form.Label>Teacher ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Teacher ID"
                autoFocus
                {...register("teacher_id", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Syllabus</Form.Label>
              <Form.Select
                {...register("syllabus_id", { required: true })}
              >
                <option value="">Select Syllabus</option>
                {syllabi.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                {...register("name", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Number of Students</Form.Label>
              <Form.Control
                type="text"
                placeholder="Number of Students"
                {...register("number_students", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Room Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Room Number"
                {...register("room_number", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Start Date"
                {...register("start_date", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="End Date"
                {...register("end_date", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                placeholder="Status"
                {...register("status", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Grade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Grade"
                {...register("grade", { required: true })}
              />
            </Form.Group>
            <Modal.Footer className="mt-3 col-span-5">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" className="bg-green-600 text-white">
                Add Class
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}