import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
  onEdit?: () => void;
  onDelete?: () => void;
}

const getFileTypeBadge = (fileType: string) => {
  if (fileType.includes('pdf')) return <Badge bg="danger">📄 PDF</Badge>;
  if (fileType.includes('word') || fileType.includes('document')) return <Badge bg="primary">📝 Word</Badge>;
  if (fileType.includes('excel') || fileType.includes('sheet')) return <Badge bg="success">📊 Excel</Badge>;
  if (fileType.includes('image')) return <Badge bg="info">🖼️ Image</Badge>;
  if (fileType === 'link') return <Badge bg="secondary">🔗 Link</Badge>;
  return <Badge bg="secondary">📁 File</Badge>;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return 'N/A';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onEdit, onDelete }) => {
  return (
    <Card className="mb-3 resource-card animate-fadeInUp">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <Card.Title as="h5" className="fw-bold">
              <a href={`/resources/${resource.id}`} className="text-decoration-none">
                {resource.title}
              </a>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted small">
              👤 {resource.uploader_name} • {new Date(resource.created_at).toLocaleDateString()}
            </Card.Subtitle>
            <Card.Text>
              {resource.description && <p className="text-muted mb-2">{resource.description}</p>}
              <div className="mb-2">
                {getFileTypeBadge(resource.file_type)}
                {resource.file_size > 0 && (
                  <span className="ms-2 text-muted small">📦 {formatFileSize(resource.file_size)}</span>
                )}
              </div>
              {resource.tags && resource.tags.length > 0 && (
                <div>
                  {resource.tags.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-1">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card.Text>
          </div>
          <div className="d-flex flex-column gap-2">
            <a href={`/resources/${resource.id}`} className="btn btn-sm btn-outline-primary">
              👁️ View
            </a>
            {onEdit && (
              <Button variant="outline-secondary" size="sm" onClick={onEdit}>
                ✏️
              </Button>
            )}
            {onDelete && (
              <Button variant="outline-danger" size="sm" onClick={onDelete}>
                🗑️
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ResourceCard;
