import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface FileUploadProps {
  onFileSelect: (file: File | null, link: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setLink('');
      onFileSelect(file, '');
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const linkValue = e.target.value;
    setLink(linkValue);
    setSelectedFile(null);
    onFileSelect(null, linkValue);
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Upload Type</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            label="Upload File"
            name="uploadType"
            id="uploadTypeFile"
            checked={uploadType === 'file'}
            onChange={() => setUploadType('file')}
          />
          <Form.Check
            inline
            type="radio"
            label="Add Link"
            name="uploadType"
            id="uploadTypeLink"
            checked={uploadType === 'link'}
            onChange={() => setUploadType('link')}
          />
        </div>
      </Form.Group>

      {uploadType === 'file' ? (
        <Form.Group className="mb-3">
          <Form.Label>File</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.webp"
          />
          <Form.Text className="text-muted">
            Accepted: PDF, Word, Excel, Text, Images. Max size: 10MB
          </Form.Text>
        </Form.Group>
      ) : (
        <Form.Group className="mb-3">
          <Form.Label>Link URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="https://example.com/resource"
            value={link}
            onChange={handleLinkChange}
          />
        </Form.Group>
      )}
    </div>
  );
};

export default FileUpload;
