import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { pink } from '@mui/material/colors';
import { grey } from '@mui/material/colors';

const LoginConfirmButon = styled(Button)({
  height: '40px',
  width: '310px',
  cursor: 'pointer',
  fontWeight: '700',
  fontFamily: 'Arial',
  color: 'white',
  backgroundColor: pink[200],
  '&:hover': {
    backgroundColor: grey[500],
    color: pink[400],
  },

})

export default LoginConfirmButon;
