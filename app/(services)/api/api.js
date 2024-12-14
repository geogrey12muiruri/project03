import axios from "axios";

// login
const loginUser = async ({ email, password }) => {
    const response = await axios.post("http://localhost:8000/api/users/login", {
        email,
        password,
    });
    return response.data;
};

// register
const registerUser = async ({ email, password }) => {
    const response = await axios.post(
        "http://localhost:8000/api/users/register",
        {
            email,
            password,
        }
    );
    return response.data;
};

// export the functions
export { loginUser, registerUser };