import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, InputGroup, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { resourceService } from '../services/resourceService';
import { Course, Resource } from '../types';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import ResourceCard from '../components/ResourceCard';
import FileUpload from '../components/FileUpload';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  // Upload form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [courseData, resourcesData] = await Promise.all([
        courseService.getById(id),
        resourceService.getByCourse(id)
      ]);
      setCourse(courseData);
      setResources(resourcesData);
    } catch (err: any) {
      console.error('Fetch error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to load course data';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File | null, selectedLink: string) => {
    setSelectedFile(file);
    setLink(selectedLink);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', resourceTitle);
      formData.append('description', resourceDescription);
      formData.append('courseId', id);
      formData.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(t => t)));

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (link) {
        formData.append('link', link);
      }

      await resourceService.upload(formData);
      setShowUploadModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  const handleEditResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    setUploading(true);
    try {
      await resourceService.update(editingResource.id, {
        title: resourceTitle,
        description: resourceDescription,
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
      });
      setShowEditModal(false);
      setEditingResource(null);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update resource');
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource);
    setResourceTitle(resource.title);
    setResourceDescription(resource.description);
    setTags(resource.tags.join(', '));
    setShowEditModal(true);
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceService.delete(resourceId);
        fetchData();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete resource');
      }
    }
  };

  const resetForm = () => {
    setResourceTitle('');
    setResourceDescription('');
    setTags('');
    setSelectedFile(null);
    setLink('');
  };

  const handleSearch = async () => {
    if (!id) return;
    try {
      const filtered = await resourceService.getByCourse(id, {
        search: searchQuery || undefined,
        fileType: filterType || undefined
      });
      setResources(filtered);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search resources');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger" className="animate-fadeInUp">
          <h4 className="mb-3">❌ Error loading course</h4>
          <p>{error}</p>
          <a href="/" className="btn btn-primary mt-3">← Back to Dashboard</a>
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="animate-fadeInUp">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4 animate-fadeInUp">
        <a href="/" className="text-decoration-none fw-semibold">← Back to Dashboard</a>
      </div>

      <Card className="mb-5 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title className="fs-2 fw-bold mb-2">{course.name}</Card.Title>
              <Card.Subtitle className="fs-5 text-muted fw-semibold mb-3">{course.code}</Card.Subtitle>
              <Card.Text className="fs-5">{course.description}</Card.Text>
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <h3 className="fw-bold mb-0">📚 Resources <Badge bg="primary" className="ms-2">{resources.length}</Badge></h3>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          ✨ Upload Resource
        </Button>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {/* Search and Filter */}
      <Row className="mb-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="🔍 Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="py-2"
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="py-2">
            <option value="">All Types</option>
            <option value="application/pdf">📄 PDF</option>
            <option value="application/msword">📝 Word</option>
            <option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">📊 Excel</option>
            <option value="image">🖼️ Images</option>
            <option value="link">🔗 Links</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button variant="outline-primary" onClick={handleSearch} className="w-100 py-2">
            Search
          </Button>
        </Col>
      </Row>

      {resources.length === 0 ? (
        <Card className="text-center p-5 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <Card.Body>
            <Card.Title className="fs-3 mb-3">No resources yet</Card.Title>
            <Card.Text className="text-muted mb-4">Be the first to upload a study resource!</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <div>
          {resources.map((resource, index) => (
            <div key={resource.id} className="animate-fadeInUp" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <ResourceCard 
                resource={resource} 
                onEdit={() => openEditModal(resource)}
                onDelete={() => handleDeleteResource(resource.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✨ Upload Resource</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Resource title"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Optional description"
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
              />
            </Form.Group>

            <FileUpload onFileSelect={handleFileSelect} />

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., lecture, chapter, exam"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? '⏳ Uploading...' : '✨ Upload'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Edit Resource</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditResource}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Resource title"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Optional description"
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., lecture, chapter, exam"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? '⏳ Saving...' : '💾 Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CourseDetail;
