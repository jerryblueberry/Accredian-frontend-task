import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Typography,
  Avatar,
  Container,
  Stack,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

const Home = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  const handleLogout = () => {
    axios.get(`http://localhost:8000/logout`)
      .then(() => {
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8000')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []); 

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {auth ? (
        <Card>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Avatar sx={{ width: 80, height: 80 }}>{name.charAt(0)}</Avatar>
              <Typography variant="h5">Welcome, {name}</Typography>
              <IconButton onClick={handleLogout} color="primary">
                <LogoutIcon fontSize="large" />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h5" color="error">{message}</Typography>
              <Typography variant="h5">Login Now</Typography>
              <Link to="/login">
                <Button variant="contained" startIcon={<PersonIcon />}>
                  Login
                </Button>
              </Link>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Home;
