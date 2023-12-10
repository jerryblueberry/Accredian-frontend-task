import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,

  Stack,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  // State to manage form data and errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    emailExists: "", // New state for email existence check
  });

  // Handle input changes in the form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    let errors = {};
    let isValid = true;

    if (!formData.name) {
      errors.name = "Username is required.";
      isValid = false;
    }

    if (!formData.email) {
      errors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address.";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      .test(
        formData.password
      )
    ) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.";
      isValid = false;
    }

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    // Submit the form if validation passes
    axios
      .post("http://localhost:8000/sign-up", formData)
      .then((res) => {
        if (res.data.Status === "Success") {
          // Redirect to login page after successful registration
          navigate("/");
        } else if (res.data.Error === "Email already exists") {
          // Set emailExists error message
          setFormErrors({
            ...errors,
            emailExists: "Email already exists. Please use a different email.",
          });
        } else {
          setFormErrors({
            name: "",
            email: "",
            password: "Registration failed. Please try again.",
            emailExists: "",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setFormErrors({
          name: "",
          email: "",
          password: "Registration failed. Please try again.",
          emailExists: "",
        });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={5} style={{ padding: "20px", marginTop: "40px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        {/* Username input field */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={formErrors.name !== ""}
          helperText={formErrors.name}
        />

        {/* Email input field */}
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={formErrors.email !== ""}
          helperText={formErrors.email || formErrors.emailExists}
        />

        {/* Password input field */}
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={formErrors.password !== ""}
          helperText={formErrors.password}
        />

        {/* Submit button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          color="primary"
          onClick={handleFormSubmit}
          style={{ marginTop: "20px" }}
        >
          Sign Up
        </Button>

        {/* Display password error message */}
        <Stack spacing={2} style={{ width: "100%", paddingTop: "20px" }}>
          {formErrors.password && (
            <Alert severity="error" size="small">
              {formErrors.password}
            </Alert>
          )}
        </Stack>

        {/* Additional options and links */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link to="/login" variant="body2">
              Log In
            </Link>
          </Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default SignUp;
