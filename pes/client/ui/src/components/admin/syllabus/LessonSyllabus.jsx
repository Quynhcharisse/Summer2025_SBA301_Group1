import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

// Import DataService instead of direct JSON imports
import DataService from '../utils/DataService';

export default function LessonSyllabus() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [newLessonNote, setNewLessonNote] = useState('');
  const [syllabus, setSyllabus] = useState(null);
  const [notes, setNotes] = useState({});
  
  useEffect(() => {
    const loadData = () => {
      const syllabusItem = DataService.getSyllabus(id);
      if (syllabusItem) {
        setSyllabus(syllabusItem);
        if (syllabusItem.notes) {
          setNotes(syllabusItem.notes);
        }
      }

      const linkedLessons = DataService.getSyllabusLessons(id);
      setLessons(linkedLessons);
      
      setAllLessons(DataService.getLessons());
    };
    
    loadData();
    
    const unsubscribeSyllabi = DataService.addListener('syllabi', loadData);
    const unsubscribeSyllabusLessons = DataService.addListener('syllabusLessons', loadData);
    
    return () => {
      unsubscribeSyllabi();
      unsubscribeSyllabusLessons();
    };
  }, [id]);

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!selectedLesson) return;
    
    try {
      const success = DataService.addLessonToSyllabus(id, selectedLesson);
      if (!success) {
        toast.error('Lesson already added to this syllabus');
        return;
      }
      
      if (newLessonNote.trim()) {
        const updatedNotes = { 
          ...notes, 
          lessons: { ...(notes.lessons || {}), [selectedLesson]: newLessonNote } 
        };
        
        DataService.updateSyllabus(id, {
          ...syllabus,
          notes: updatedNotes
        });
        
        setNotes(updatedNotes);
        toast.success('Lesson added with notes!');
      } else {
        toast.success('Lesson added!');
      }
      
      setSelectedLesson('');
      setNewLessonNote('');
    } catch (error) {
      toast.error('Failed to add lesson');
      console.error(error);
    }
  };

  const handleRemoveLesson = async (lessonId) => {
    const success = DataService.removeLessonFromSyllabus(id, lessonId);
    if (success) {
      toast.success('Lesson removed');
    } else {
      toast.error('Failed to remove lesson');
    }
  };

  const saveLessonNote = async (lessonId, noteText) => {
    try {
      const updatedNotes = { 
        ...notes, 
        lessons: { ...(notes.lessons || {}), [lessonId]: noteText } 
      };
      
      DataService.updateSyllabus(id, {
        ...syllabus,
        notes: updatedNotes
      });
      
      setNotes(updatedNotes);
      toast.success('Lesson note saved!');
    } catch (error) {
      toast.error('Failed to save lesson note');
      console.error(error);
    }
  };

  return (
    <Container>
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="my-4">Lessons for Syllabus: {syllabus?.title || `#${id}`}</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleAddLesson}>
            <Form.Group className="mb-3">
              <Form.Label>Add New Lesson</Form.Label>
              <Form.Select 
                value={selectedLesson} 
                onChange={e => setSelectedLesson(e.target.value)}
              >
                <option value="">Select lesson to add</option>
                {allLessons
                  .filter(l => !lessons.some(lesson => lesson.id === l.id))
                  .map(l => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))
                }
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Initial Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Add notes for this lesson..."
                value={newLessonNote}
                onChange={(e) => setNewLessonNote(e.target.value)}
              />
            </Form.Group>
            
            <Button type="submit" variant="success">
              Add Lesson
            </Button>
          </Form>
        </Col>
      </Row>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map(lesson => {
            const lessonNotes = notes?.lessons?.[lesson.id] || '';
            return (
              <tr key={lesson.id}>
                <td>{lesson.title}</td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Add notes for this lesson..."
                    value={lessonNotes}
                    onChange={(e) => saveLessonNote(lesson.id, e.target.value)}
                  />
                </td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleRemoveLesson(lesson.id)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
          {lessons.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No lessons added to this syllabus yet</td>
            </tr>
          )}
        </tbody>
      </Table>
      
      <Link to="/Syllabus" className="btn btn-secondary mt-3">
        Back to Syllabi
      </Link>
    </Container>
  );
}