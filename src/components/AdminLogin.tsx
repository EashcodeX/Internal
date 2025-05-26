import React from 'react';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onLoginSuccess }) => {
  return (
    <div className="p-6">
      {/* Admin login form implementation */}
    </div>
  );
};

export default AdminLogin; 