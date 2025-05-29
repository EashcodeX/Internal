import React, { useEffect } from 'react';

interface BadgeImageProps {
  name: string;
  daysRemaining?: number;
  awardedDate: string;
  className?: string;
}

const BadgeImage: React.FC<BadgeImageProps> = ({ name, daysRemaining, awardedDate, className = '' }) => {
  // Map badge names to image files
  const badgeImageMap: { [key: string]: string } = {
    'Cloud Computing': 'profiles/cloud.jpg',
    'Web Development': 'profiles/web dev.jpg',
    'Full Stack Development': 'profiles/full stack.jpg',
    'Data Analytics': 'profiles/data analytics.jpg',
    'Digital Marketing': 'profiles/digital marketing.jpg',
    'IT Support': 'profiles/it support.jpg',
    'Office 365': 'profiles/office 365.jpg',
    'Client Acquisition': 'profiles/client acquisition.jpg'
  };

  // Debug log
  useEffect(() => {
    console.log('Badge name:', name);
    console.log('Image path:', badgeImageMap[name] || 'default');
  }, [name]);

  const imagePath = badgeImageMap[name];

  return (
    <div className={`relative group ${className}`}>
      <div className="relative">
        <img
          src={imagePath ? `${import.meta.env.BASE_URL}${imagePath}` : `${import.meta.env.BASE_URL}profiles/default-badge.jpg`}
          alt={name}
          className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors object-cover"
          onError={(e) => {
            console.error('Failed to load image:', imagePath);
            e.currentTarget.src = `${import.meta.env.BASE_URL}profiles/default-badge.jpg`;
          }}
        />
        {daysRemaining !== undefined && daysRemaining < 30 && (
          <span 
            className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 border-2 border-white rounded-full" 
            title="Expiring soon"
          />
        )}
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none shadow-lg">
        <div className="font-semibold mb-1">{name}</div>
        <div className="text-gray-300 text-[10px]">
          Awarded: {new Date(awardedDate).toLocaleDateString()}
        </div>
        {daysRemaining !== undefined && (
          <div className={`text-[10px] ${daysRemaining < 30 ? 'text-yellow-400' : 'text-gray-300'}`}>
            {daysRemaining} days remaining
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeImage; 