import React from 'react';
import { Alert } from 'react-bootstrap';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Alert variant="danger" onClose={onClose} dismissible={!!onClose}>
      {message}
    </Alert>
  );
};

export default ErrorMessage;
