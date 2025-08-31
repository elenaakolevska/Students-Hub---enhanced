// import React, { useState, useContext } from 'react';
// import Navigation from '../Navigation';
// import Footer from '../Footer';
// import { login as loginApi } from '../../repository/userRepository';
// import authContext from '../../contexts/authContext';
// import './LoginPage.css';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { setUser } = useContext(authContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('Login attempt:', { username, password });
//     try {
//       const user = await loginApi(username, password);
//       setUser(user); // Save user in context
//       // Optionally redirect, e.g. window.location = '/';
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div className="d-flex flex-column min-vh-100">

//       <main className="container flex-grow-1 py-5">
//         <div className="login-grid">
//           <div className="d-flex align-items-center justify-content-center" style={{flex: 1}}>
//             <img
//               src={process.env.PUBLIC_URL + '/images/login.png'}
//               alt="Login Illustration"
//               className="login-image"
//             />
//           </div>
//           <div className="row justify-content-center" style={{flex: 1}}>
//             <div className="col-md-12 col-lg-10">
//               <div className="card shadow p-4">
//                 <h3 className="mb-4 text-center">Login</h3>
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 <form onSubmit={handleSubmit}>
//                   <div className="mb-3">
//                     <label className="form-label">Username or Email</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={username}
//                       onChange={e => setUsername(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Password</label>
//                     <input
//                       type="password"
//                       className="form-control"
//                       value={password}
//                       onChange={e => setPassword(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <button type="submit" className="btn btn-primary w-100">Login</button>
//                 </form>
//                 <div className="mt-3 text-center">
//                   <a href="/register">Don't have an account? Register</a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Login;
import React, {useState} from 'react';
import {
    Box, TextField, Button, Typography, Container, Paper
} from '@mui/material';
import userRepository from "../../repository/userRepository";
import {useNavigate} from "react-router";
import useAuth from "../../hooks/useAuth";

const initialFormData = {
    "username": "",
    "password": "",
};

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialFormData);

    const {login} = useAuth();

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }
        
        userRepository
            .login(formData)
            .then((response) => {
                console.log("The user is successfully logged in.");
                if (response.data && response.data.token) {
                    login(response.data.token);
                    navigate("/");
                } else {
                    console.error("No token received in login response");
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                alert("Login failed. Please check your credentials.");
            });
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{padding: 4, mt: 8}}>
                <Typography variant="h5" align="center" gutterBottom>Login</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        margin="normal"
                        required
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{mt: 2}}
                    >
                        Login
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{mt: 2}}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;

