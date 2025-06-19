import React from 'react';

interface MessageProps {
  type: 'success' | 'error';
  children: React.ReactNode;
}

const styleMap = {
  success: {
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};

const Message: React.FC<MessageProps> = ({ type, children }) => (
  <div style={styleMap[type]}>
    {children}
  </div>
);

export default Message; 