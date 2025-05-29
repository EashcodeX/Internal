export type Role = 'Service Delivery Manager' | 'Technical Account Manager' | 'Client Experience Manager' | 'Associate Trainee';

export interface Badge {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    awarded_date?: string;
    expiry_days?: number;
}

export interface TeamMember {
    id?: string;
    name: string;
    role: Role;
    designation?: string;
    profile?: string;
    avatar?: string;  // URL or base64 string for profile picture
    initials?: string;  // Fallback initials for avatar
    badges?: Badge[]; // Array of badges held by the member
    team?: string;
    isLeadership?: boolean;
    uuid?: string; // Supabase Auth UUID
}

export interface TeamData {
    name: string;
    sdm: TeamMember;
    tdm: TeamMember;
    cxm: TeamMember;
    members: TeamMember[];
}

export interface Teams {
    [key: string]: TeamData;
} 