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
    return (responseData);
    // You can handle the success response here
  } catch (error) {
    console.error('Error:', error.message);
    // You can handle the error here
  }
}

export async function checkUserExists(userId) {
  try {
    const response = await fetch('/db/checkgoogleuserexists', {
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
    return await response.json();
    // You can handle the response data here
  } catch (error) {
    console.error('Error:', error.message);
    // You can handle the error here
  }
}

export async function loginUser (email,password) {
  const loginData = {
    useremail:email,
    userpassword:password
  }
  try {
    const response = await fetch('/db/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return (responseData);
    // You can handle the success response here
  } catch (error) {
    console.error('Error:', error.message);
    // You can handle the error here
  }
}


