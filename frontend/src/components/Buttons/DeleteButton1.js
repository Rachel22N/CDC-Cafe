import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import { pink } from '@mui/material/colors';

const DeleteButton1 = styled(Button)({
  height: '40px',
  width: '60px',
  cursor: 'pointer',
  fontWeight: '700',
  fontFamily: 'Arial',
  color: 'white',
  backgroundColor: red[400],
  '&:hover': {
    backgroundColor: grey[500],
    color: pink[400],
    boxShadow: '0 5px 8px 2px rgba(0, 0, 0, .4)', 
  },
  textTransform: 'none',
  position: 'absolute',
  // bottom: 5,
  top: 70,
  right: 15,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)', 
  transition: 'all 0.3s ease', 
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
})

export default DeleteButton1;
