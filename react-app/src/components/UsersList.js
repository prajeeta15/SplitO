import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://splito.onrender.com'
    : 'http://localhost:8000';

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/api/users/`, {
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Failed to fetch users:', response.statusText);
          return;
        }

        const responseData = await response.json();
        setUsers(responseData.users || []);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    }

    fetchData();
  }, []);

  const userComponents = users.map((user) => (
    <li key={user.id}>
      <NavLink to={`/users/${user.id}`}>{user.username}</NavLink>
    </li>
  ));

  return (
    <>
      <h1>User List:</h1>
      <ul>{userComponents}</ul>
    </>
  );
}

export default UsersList;
