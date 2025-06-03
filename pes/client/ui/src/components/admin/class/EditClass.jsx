import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import DataService from '../utils/DataService';

export default function EditClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentClass, setCurrentClass] = useState({});
  const [syllabuses, setSyllabuses] = useState([]);

  const { handleSubmit, formState: { errors }, control, setValue } = useForm({
    defaultValues: {
      name: '',
      teacher_id: '',
      syllabus_id: '',
      number_students: '',
      room_number: '',
      start_date: '',
      end_date: '',
      status: '',
      grade: ''
    }
  });

  useEffect(() => {
    const classItem = DataService.getClass(id);
    if (classItem) {
      setCurrentClass(classItem);
      setValue('name', classItem.name);
      setValue('teacher_id', classItem.teacher_id);
      setValue('syllabus_id', classItem.syllabus_id);
      setValue('number_students', classItem.number_students);
      setValue('room_number', classItem.room_number);
      setValue('start_date', classItem.start_date);
      setValue('end_date', classItem.end_date);
      setValue('status', classItem.status);
      setValue('grade', classItem.grade);
    } else {
      toast.error('Failed to fetch class data.');
    }
    
    setSyllabuses(DataService.getSyllabi());
  }, [id, setValue]);

  const onSubmit = (data) => {
    try {
      const updatedClass = DataService.updateClass(id, data);
      if (updatedClass) {
        toast.success('Class edited successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error('Failed to update class.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to edit class.');
    }
  };

  return (
    <Container>
      <Toaster />
      <Row>
        <p className="lead text-primary">Edit the class: {currentClass.name}</p>
        <hr />
        <Col md={8}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Class Name</Form.Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
              {errors.name && errors.name.type === "required" && <p className="text-warning">Name is required</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Teacher ID</Form.Label>
              <Controller
                name="teacher_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
              {errors.teacher_id && errors.teacher_id.type === "required" && <p className="text-warning">Teacher ID is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Syllabus</Form.Label>
              <Controller
                name="syllabus_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Form.Select {...field}>
                    <option value="">Select a syllabus</option>
                    {syllabuses.map(syllabus => (
                      <option key={syllabus.id} value={syllabus.id}>
                        {syllabus.title}
                      </option>
                    ))}
                  </Form.Select>
                )}
              />
              {errors.syllabus_id && errors.syllabus_id.type === "required" && <p className="text-warning">Syllabus is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Number of Students</Form.Label>
              <Controller
                name="number_students"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="number" />}
              />
              {errors.number_students && errors.number_students.type === "required" && <p className="text-warning">Number of Students is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>Room Number</Form.Label>
              <Controller
                name="room_number"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
              {errors.room_number && errors.room_number.type === "required" && <p className="text-warning">Room Number is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Start Date</Form.Label>
              <Controller
                name="start_date"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="date" />}
              />
              {errors.start_date && errors.start_date.type === "required" && <p className="text-warning">Start Date is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput7">
              <Form.Label>End Date</Form.Label>
              <Controller
                name="end_date"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="date" />}
              />
              {errors.end_date && errors.end_date.type === "required" && <p className="text-warning">End Date is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput8">
              <Form.Label>Status</Form.Label>
              <Controller
                name="status"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
              {errors.status && errors.status.type === "required" && <p className="text-warning">Status is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput9">
              <Form.Label>Grade</Form.Label>
              <Controller
                name="grade"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
              {errors.grade && errors.grade.type === "required" && <p className="text-warning">Grade is required</p>}
            </Form.Group>

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
