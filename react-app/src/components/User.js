import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://splito.onrender.com'
    : 'http://localhost:8000';

function User() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Failed to fetch user:', response.statusText);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    })();
  }, [userId]);

  if (!user) return <p>Loading user data...</p>;

  return (
    <ul>
      <li>
        <strong>User Id:</strong> {userId}
      </li>
      <li>
        <strong>Username:</strong> {user.username}
      </li>
      <li>
        <strong>Email:</strong> {user.email}
      </li>
    </ul>
  );
}

export default User;
