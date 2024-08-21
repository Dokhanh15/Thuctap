import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h3" textAlign="center" mt={5}>
        404 - Không tìm thấy trang
      </Typography>
      <Typography textAlign="center" mt={2}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ display: 'block', margin: '20px auto' }}
      >
        Quay về trang chủ
      </Button>
    </Container>
  );
};

export default NotFound;
