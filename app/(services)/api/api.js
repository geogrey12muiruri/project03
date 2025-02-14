import axios from "axios";

const API_URL = "https://project03-rj91.onrender.com";

// login
const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${API_URL}/api/users/login`, {
    email,
    password,
  });
  return response.data;
};

// register
const registerUser = async ({ email, password, firstName, lastName }) => {
  const response = await axios.post(`${API_URL}/api/users/register`, {
    email,
    password,
    firstName,
    lastName,
  });
  return response.data;
};

// Google login
const googleLoginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/google-login`, userData);
  return response.data;
};

const setPassword = async (token, password) => {
  const response = await axios.post(
    `${API_URL}/api/users/set-password`,
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// export the functions
export { loginUser, registerUser, googleLoginUser, setPassword };

export default {
  loginUser,
  registerUser,
  googleLoginUser,
  setPassword,
};