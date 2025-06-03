import { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';

import DataService from '../utils/DataService';

export default function EditSyllabus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState({});

  const { handleSubmit, formState: { errors }, control, setValue } = useForm({
    defaultValues: {
      title: '',
      description: ''
    }
  });

  useEffect(() => {
    const syllabusItem = DataService.getSyllabus(id);
    if (syllabusItem) {
      setSyllabus(syllabusItem);
      setValue('title', syllabusItem.title);
      setValue('description', syllabusItem.description);
    } else {
      toast.error('Failed to fetch syllabus data.');
    }
  }, [id, setValue]);

  const onSubmit = (data) => {
    try {
      const updatedSyllabus = DataService.updateSyllabus(id, {
        ...syllabus,
        title: data.title,
        description: data.description
      });
      
      if (updatedSyllabus) {
        toast.success('Syllabus edited successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error('Failed to update syllabus.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to edit syllabus.');
    }
  };

  return (
    <Container>
      <Toaster />
      <Row>
        <p className="lead text-primary">Edit the syllabus: {syllabus.title}</p>
        <hr />
        <Col md={8}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Controller
                name="title"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} type="text" />}
              />
              {errors.title && errors.title.type === "required" && <p className="text-warning">Title is required</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Description</Form.Label>
              <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => <Form.Control {...field} as="textarea" rows={3} />}
              />
              {errors.description && errors.description.type === "required" && <p className="text-warning">Description is required</p>}
            </Form.Group>

            <Button variant="primary" type="submit" className="me-2">
              Save
            </Button>
            <Link to={`/Syllabus/${id}/Lessons`}>
              <Button variant="info">
                Manage Lessons
              </Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
