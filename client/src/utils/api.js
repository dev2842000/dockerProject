const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async (page, limit = 10, filter = '', search = '', sortOrder,sortKey='name') => {
  try {
    const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}&filter=${filter}&search=${search}&sortOrder=${sortOrder}&sortKey=${sortKey}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json()
    return data;  
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return await response.json();
};

export const createUser = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return await response.json();
};

export const updateUser = async (id, user) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update user');
  }

  return await response.json();
};



export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (response.status !== 204) {
    const errorData = await response.text();
    throw new Error(errorData || 'Failed to delete user');
  }
};