import { styled } from '@mui/system';
import Button from '@mui/material/Button';

const LoginButton = styled(Button)({
  position: 'absolute',
  top: '10px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  cursor: 'pointer',
  fontWeight: '700',
  fontFamily: 'Arial',
});

export default LoginButton;
