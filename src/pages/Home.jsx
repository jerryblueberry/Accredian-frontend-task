import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography, Avatar, Container, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

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
    <Container maxWidth="sm">
      {auth ? (
        <Stack spacing={3} alignItems="center" mt={5}>
          <Avatar>{name.charAt(0)}</Avatar>
          <Typography variant="h5">Welcome, {name}</Typography>
          <Button
            variant="contained"
            endIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3} alignItems="center" mt={5}>
          <Typography variant="h5" color="error">{message}</Typography>
          <Typography variant="h5">Login Now</Typography>
          <Link to="/login">
            <Button variant="contained">Login</Button>
          </Link>
        </Stack>
      )}
    </Container>
  );
};

export default Home;
