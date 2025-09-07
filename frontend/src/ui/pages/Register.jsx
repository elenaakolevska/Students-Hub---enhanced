import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Divider,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import userRepository from "../../repository/userRepository";

const initialFormData = {
  username: "",
  email: "",
  password: "",
  repeatPassword: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // validations
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await userRepository.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name || '',
        surname: formData.surname || ''
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ece9e6, #ffffff)",
      }}
    >
      <Container maxWidth="xs">
        <Fade in timeout={600}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              background: "linear-gradient(145deg, #fdfbfb, #ebedee)",
            }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              fontWeight="bold"
            >
              Create Account
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={2}
            >
              Join us and get started today
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                margin="normal"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                margin="normal"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
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
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                margin="normal"
                required
                value={formData.repeatPassword}
                onChange={handleChange}
                disabled={loading}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 3, py: 1.2, borderRadius: 3, textTransform: "none" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>

              <Divider sx={{ my: 3 }}>or</Divider>

              <Button
                fullWidth
                variant="outlined"
                sx={{ py: 1.2, borderRadius: 3, textTransform: "none" }}
                onClick={() => navigate("/login")}
                disabled={loading}
              >
                Already have an account? Login
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
