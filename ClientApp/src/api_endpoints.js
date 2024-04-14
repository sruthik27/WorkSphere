//usage - await addUser(1, 'example@example.com', 'password123', 'user');
export async function addUser(user_id, email, password, role) {
  const userData = {
    user_id: user_id,
    email: email,
    password: password,
    role: role
  };

  try {
    const response = await fetch('/db/adduser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log(responseData.message); // Assuming you want to log the message
    // You can handle the success response here
  } catch (error) {
    console.error('Error:', error.message);
    // You can handle the error here
  }
}

export async function checkUserExists(userId) {
  try {
    const response = await fetch('/db/checkuserexists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userId)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log(responseData); // Assuming you want to log the response
    // You can handle the response data here
  } catch (error) {
    console.error('Error:', error.message);
    // You can handle the error here
  }
}

