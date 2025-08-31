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
import userRepository from "../../repository/userRepository";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const initialFormData = {
  username: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    userRepository
      .login(formData)
      .then((response) => {
        if (response.data && response.data.token) {
          login(response.data.token);
          navigate("/");
        } else {
          setError("No token received. Please try again.");
        }
      })
      .catch(() => {
        setError("Invalid credentials. Please check your username/password.");
      })
      .finally(() => {
        setLoading(false);
      });
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
            <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={2}
            >
              Please login to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
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
                label="Password"
                name="password"
                type="password"
                margin="normal"
                required
                value={formData.password}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>

              <Divider sx={{ my: 3 }}>or</Divider>

              <Button
                fullWidth
                variant="outlined"
                sx={{ py: 1.2, borderRadius: 3, textTransform: "none" }}
                onClick={() => navigate("/register")}
                disabled={loading}
              >
                Create an Account
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
