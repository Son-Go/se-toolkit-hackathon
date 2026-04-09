import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';
import { Course } from '../types';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [myCoursesData, allCoursesData] = await Promise.all([
        courseService.getMyCourses(),
        courseService.getAll()
      ]);
      setMyCourses(myCoursesData);
      setAllCourses(allCoursesData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseService.create(courseName, courseCode, courseDescription);
      setShowCreateModal(false);
      setCourseName('');
      setCourseCode('');
      setCourseDescription('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create course');
    }
  };

  const handleJoinCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const course = allCourses.find(c => c.code === joinCode);
      if (!course) {
        setError('Course not found with this code');
        return;
      }
      await courseService.join(course.id);
      setShowJoinModal(false);
      setJoinCode('');
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join course');
    }
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (window.confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
      try {
        await courseService.delete(courseId);
        fetchData();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete course');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-5 animate-fadeInUp">
        <div>
          <h1 className="display-4 fw-bold mb-1">Welcome, {user?.username}! 👋</h1>
          <p className="text-muted fs-5">Manage your courses and study resources</p>
        </div>
        <div>
          <Button variant="primary" className="me-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }} onClick={() => setShowCreateModal(true)}>
            ✨ Create Course
          </Button>
          <Button variant="outline-primary" className="animate-fadeInUp" style={{ animationDelay: '0.2s' }} onClick={() => setShowJoinModal(true)}>
            🚀 Join Course
          </Button>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold mb-3 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            My Courses <Badge bg="primary" className="ms-2">{myCourses.length}</Badge>
          </h2>
        </Col>
      </Row>

      {myCourses.length === 0 ? (
        <Card className="text-center p-5 mb-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <Card.Body>
            <Card.Title className="fs-3 mb-3">You're not enrolled in any courses yet</Card.Title>
            <Card.Text className="text-muted mb-4">Create a new course or join an existing one to get started.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row className="mb-5">
          {myCourses.map((course, index) => (
            <Col key={course.id} md={4} className="mb-3 animate-fadeInUp" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <Card className="course-card h-100">
                <Card.Body>
                  <Card.Title className="fs-4 fw-bold">{course.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted fw-semibold">{course.code}</Card.Subtitle>
                  <Card.Text className="text-muted">{course.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">
                      👥 {course.member_count} member{course.member_count !== 1 ? 's' : ''}
                    </small>
                    <div>
                      <a href={`/courses/${course.id}`} className="btn btn-sm btn-primary me-2">
                        👁️ View
                      </a>
                      {course.role === 'owner' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id, course.name)}
                        >
                          🗑️
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Row>
        <Col>
          <h2 className="fw-bold mb-3 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            All Available Courses
          </h2>
        </Col>
      </Row>

      {allCourses.length === 0 ? (
        <Card className="text-center p-5 animate-fadeInUp">
          <Card.Body>
            <Card.Title className="fs-3 mb-3">No courses available</Card.Title>
            <Card.Text className="text-muted">Create the first course to get started!</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {allCourses.map((course, index) => {
            const isEnrolled = myCourses.some(c => c.id === course.id);
            return (
              <Col key={course.id} md={4} className="mb-3 animate-fadeInUp" style={{ animationDelay: `${0.7 + index * 0.1}s` }}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title className="fs-4 fw-bold">{course.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted fw-semibold">{course.code}</Card.Subtitle>
                    <Card.Text className="text-muted">{course.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        By {course.creator_name} • {course.member_count} members
                      </small>
                      {isEnrolled ? (
                        <Badge bg="success" className="fs-6 px-3 py-2">✓ Enrolled</Badge>
                      ) : (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={async () => {
                            try {
                              await courseService.join(course.id);
                              fetchData();
                            } catch (err: any) {
                              setError(err.response?.data?.error || 'Failed to join course');
                            }
                          }}
                        >
                          Join Course
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Create Course Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✨ Create New Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCourse}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Course Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Data Structures and Algorithms"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Course Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., CS201"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional course description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Course
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Join Course Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🚀 Join a Course</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleJoinCourse}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Course Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the course code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
              />
            </Form.Group>
            <p className="text-muted small mt-3">
              Available: {allCourses.filter(c => !myCourses.some(mc => mc.id === c.id)).map(c => c.code).join(', ') || 'None'}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowJoinModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Join Course
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Dashboard;
