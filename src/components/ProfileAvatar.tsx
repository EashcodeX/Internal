import React from 'react';

interface ProfileAvatarProps {
  name: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
  team?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ name, avatar, size = 'md', team }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-medium`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default ProfileAvatar; 