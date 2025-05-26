export interface Badge {
  id: string;
  name: string;
  description: string;
  awarded_date?: string;
  expiry_days?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  team?: string;
  badges?: Badge[];
  isLeadership?: boolean;
} 