import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Badge, Form, ListGroup, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { downloadFile } from '../services/api';
import { resourceService } from '../services/resourceService';
import { Resource, Comment } from '../types';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    try {
      const data = await resourceService.getById(id);
      setResource(data.resource);
      setComments(data.comments || []);
      
      if (data.resource.file_type.includes('pdf') || data.resource.file_type.includes('image')) {
        loadPreview(data.resource);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || 'Failed to load resource');
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async (res: Resource) => {
    try {
      setPreviewLoading(true);
      const response = await downloadFile(res.id);
      const blob = new Blob([response.data], { type: res.file_type });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error('Failed to load preview:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = () => {
    if (resource) {
      resourceService.download(resource.id);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const newComment = await resourceService.addComment(id, commentContent);
      setComments([...comments, newComment]);
      setCommentContent('');
    } catch (err: any) {
      console.error('Comment error:', err);
      setError(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await resourceService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄 PDF';
    if (fileType.includes('word') || fileType.includes('document')) return '📝 Word';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊 Excel';
    if (fileType.includes('image')) return '🖼️ Image';
    if (fileType === 'link') return '🔗 Link';
    return '📁 File';
  };

  const renderPreview = () => {
    if (!resource) return null;

    if (resource.file_type === 'link') {
      return (
        <Card className="mb-4 animate-fadeInUp">
          <Card.Body className="text-center p-4">
            <Card.Title className="mb-3">🔗 Link Resource</Card.Title>
            <Card.Text className="mb-4">
              This resource is a link. Click the button below to open it.
            </Card.Text>
            <Button variant="primary" onClick={() => window.open(resource.file_path, '_blank')} size="lg">
              Open Link →
            </Button>
          </Card.Body>
        </Card>
      );
    }

    if (previewLoading) {
      return (
        <Card className="mb-4 text-center animate-fadeInUp">
          <Card.Body className="p-5">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">Loading preview...</p>
          </Card.Body>
        </Card>
      );
    }

    if (resource.file_type.includes('pdf') && previewUrl) {
      return (
        <Card className="mb-4 animate-fadeInUp">
          <Card.Body>
            <Card.Title className="mb-3 fw-bold">📄 PDF Preview</Card.Title>
            <iframe
              src={previewUrl}
              title="PDF Preview"
              width="100%"
              height="600"
              style={{ border: '2px solid #e2e8f0', borderRadius: '12px' }}
            />
          </Card.Body>
        </Card>
      );
    }

    if (resource.file_type.includes('image') && previewUrl) {
      return (
        <Card className="mb-4 animate-fadeInUp">
          <Card.Body className="text-center">
            <Card.Title className="mb-3 fw-bold">🖼️ Image Preview</Card.Title>
            <img
              src={previewUrl}
              alt={resource.title}
              className="img-fluid rounded-4"
              style={{ maxHeight: '600px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            />
          </Card.Body>
        </Card>
      );
    }

    if (!previewUrl) {
      return (
        <Card className="mb-4 animate-fadeInUp">
          <Card.Body className="text-center text-muted p-4">
            <p className="mb-3">Preview not available for this file type.</p>
            <Button variant="outline-primary" onClick={handleDownload} size="lg">
              📥 Download to View
            </Button>
          </Card.Body>
        </Card>
      );
    }

    return null;
  };

  if (loading) {
    return <Loading />;
  }

  if (!resource) {
    return (
      <Container className="py-4">
        <Alert variant="warning" className="animate-fadeInUp">Resource not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="mb-4 animate-fadeInUp">
        <a href={`/courses/${resource.course_id}`} className="text-decoration-none fw-semibold">← Back to Course</a>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      <Card className="mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title className="fs-2 fw-bold mb-0">{resource.title}</Card.Title>
            <Badge bg="primary" className="fs-6 px-3 py-2">{getFileTypeLabel(resource.file_type)}</Badge>
          </div>
          
          <Card.Subtitle className="mb-3 text-muted fs-5">
            👤 {resource.uploader_name || 'Unknown'} • 📅 {new Date(resource.created_at).toLocaleDateString()}
          </Card.Subtitle>

          {resource.description && <Card.Text className="fs-5 mb-3">{resource.description}</Card.Text>}

          {resource.tags && resource.tags.length > 0 && (
            <div className="mb-4">
              {resource.tags.map((tag, index) => (
                <Badge key={index} bg="light" text="dark" className="me-2 fs-6 px-3 py-2">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {resource.file_type !== 'link' && (
            <Button variant="primary" onClick={handleDownload} size="lg">
              📥 Download File
            </Button>
          )}
        </Card.Body>
      </Card>

      {renderPreview()}

      {/* Comments Section */}
      <Card className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <Card.Body className="p-4">
          <Card.Title className="mb-4 fs-3 fw-bold">💬 Comments ({comments.length})</Card.Title>

          {/* Add Comment Form */}
          <Form onSubmit={handleSubmitComment} className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Add a Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={submittingComment} size="lg">
              {submittingComment ? '⏳ Posting...' : '💬 Post Comment'}
            </Button>
          </Form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-muted text-center py-4">No comments yet. Be the first to comment!</p>
          ) : (
            <ListGroup>
              {comments.map((comment, index) => (
                <ListGroup.Item key={comment.id} className="animate-fadeInUp" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="mb-2">
                        <strong className="text-primary fs-5">
                          👤 {comment.username || 'Anonymous'}
                        </strong>
                        <small className="text-muted ms-2">
                          🕒 {new Date(comment.created_at).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-0 fs-5">{comment.content}</p>
                    </div>
                    {user && user.id === comment.user_id && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        🗑️
                      </Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResourceDetail;
