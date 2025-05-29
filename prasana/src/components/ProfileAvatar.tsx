import React, { useState } from 'react';

interface ProfileAvatarProps {
    name: string;
    avatar?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    team?: 'ATHENA' | 'NEXUS' | 'TITAN' | 'DYNAMIX';
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
    name, 
    avatar, 
    size = 'md',
    className = '',
    team
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Generate initials from name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Size classes
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    // Logo size classes
    const logoSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    // Use a neutral gray background for initials
    const neutralBg = 'bg-gray-200';

    // Get team logo path
    const getTeamLogo = (team?: string) => {
        if (!team) return null;
        return `${import.meta.env.BASE_URL}profiles/${team.toLowerCase()}.png`;
    };

    const teamLogo = getTeamLogo(team);

    if (avatar && !hasError) {
        return (
            <div className={`relative ${sizeClasses[size]} ${className}`}>
                {isLoading && (
                    <div className={`absolute inset-0 rounded-full ${neutralBg} animate-pulse`} />
                )}
                <img
                    src={avatar?.startsWith('http') ? avatar : `${import.meta.env.BASE_URL}${avatar.replace(/^\//, '')}`}
                    alt={name}
                    className={`rounded-full object-cover w-full h-full transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => {
                        setIsLoading(false);
                        setHasError(true);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />
                {teamLogo && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <img
                            src={teamLogo}
                            alt={`${team} logo`}
                            className={`${logoSizeClasses[size]} object-contain`}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative rounded-full flex items-center justify-center ${sizeClasses[size]} ${neutralBg} ${className}`}>
            <span className="text-gray-700 font-medium">
                {getInitials(name)}
            </span>
            {teamLogo && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <img
                        src={teamLogo}
                        alt={`${team} logo`}
                        className={`${logoSizeClasses[size]} object-contain`}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileAvatar; 