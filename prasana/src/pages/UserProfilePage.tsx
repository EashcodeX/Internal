import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface UserProfilePageProps {
  // Add any necessary props here
}

const UserProfilePage: React.FC<UserProfilePageProps> = () => {
  // Get the user ID from the URL parameters
  const { userId } = useParams<{ userId: string }>();

  // State to hold user data
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }
      // TODO: Implement data fetching for the user with the given userId
      // This will likely involve fetching from Supabase tables like 'users', 'skills', 'leaves', etc.
      console.log(`Fetching data for user with ID: ${userId}`);
      
      // Placeholder for data fetching logic
      // Replace with actual Supabase calls
      const dummyUserData = {
        id: userId,
        name: 'Loading User...',
        email: 'loading@example.com',
        // Add other profile fields you plan to fetch
        skills: [],
        leaves: [],
        performance: [],
      };
      
      // Simulate fetching delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(dummyUserData);
      setLoading(false);
    };

    fetchUserData();
  }, [userId]); // Re-run effect if userId changes

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>
      
      {/* Display user data - Placeholder UI */}
      <div>
        <p>ID: {userData.id}</p>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        {/* Add more fields as you implement fetching */}
        <h3>Skills:</h3>
        <ul>
          {userData.skills.map((skill: any, index: number) => (
            <li key={index}>{skill.name}</li>
          ))}
        </ul>
        {/* Add sections for Leaves, Performance, etc. */}
      </div>
    </div>
  );
};

export default UserProfilePage; 