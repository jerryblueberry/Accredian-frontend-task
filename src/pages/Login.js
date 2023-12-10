import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Alert,
  Stack,
  Typography,
  Container,
  Paper
  
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formValid, setFormValid] = useState(null);
  const [token, setToken] = useState(null); // Add state for token
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleEmail = () => setEmailError(!isEmail(emailInput));
  const handlePassword = () =>
    setPasswordError(
      !passwordInput || passwordInput.length < 5 || passwordInput.length > 20
    );

  const handleSubmit = () => {
    setFormValid(null);

    if (emailError || !emailInput) {
      setFormValid("Invalid email. Please re-enter.");
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid("Password should be 5-20 characters long. Please re-enter.");
      return;
    }

    axios
      .post(
        `http://localhost:8000/login`,
        {
          email: emailInput,
          password: passwordInput,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("Login Response", res.data);
        if (res.data.Status === "Success") {
          const token = res.data.token;
          console.log("SET TOKEN", token);

          // Save the token to state
          setToken(token);

          // Redirect to the desired page
          navigate("/");
        } else {
          setFormValid(res.data.Error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={5} style={{ padding: "20px", marginTop: "40px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          error={emailError}
          value={emailInput}
          onBlur={handleEmail}
          onChange={(event) => setEmailInput(event.target.value)}
        />

        <FormControl fullWidth variant="outlined" size="small" margin="normal">
          <InputLabel
            htmlFor="outlined-adornment-password"
            error={passwordError}
          >
            Password
          </InputLabel>
          <Input
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            error={passwordError}
            onBlur={handlePassword}
            onChange={(event) => setPasswordInput(event.target.value)}
            value={passwordInput}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          size="large"
          startIcon={<LoginIcon />}
          onClick={handleSubmit}
          style={{ marginTop: "20px" }}
        >
          LOGIN
        </Button>

        {formValid && (
          <Stack spacing={2} style={{ width: "100%", paddingTop: "20px" }}>
            <Alert severity="error" size="small">
              {formValid}
            </Alert>
          </Stack>
        )}

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link to="#forgot-password" variant="body2">
            Forgot Password
          </Link>
          <br />
          <Typography variant="body2">
            Do you have an account?{" "}
            <Link to="/signup" variant="body2">
              Sign Up
            </Link>
          </Typography>
        </div>
      </Paper>
    </Container>
  );
};

export default Login;
