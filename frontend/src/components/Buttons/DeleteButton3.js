import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { pink } from '@mui/material/colors';
import { grey } from '@mui/material/colors';
import { red } from '@mui/material/colors';

const DeleteButton3 = styled(Button)({
  height: '50px',
  width: '170px',
  cursor: 'pointer',
  fontWeight: '700',
  fontFamily: 'Arial',
  fontSize: '20px',
  color: 'white',
  // backgroundColor: pink[200],
  backgroundColor: red[400],
  '&:hover': {
    backgroundColor: grey[500],
    color: pink[400],
    boxShadow: '0 5px 8px 2px rgba(0, 0, 0, .4)', 
  },
  fontSize: '18px',
  textTransform: 'none',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)', 
  transition: 'all 0.3s ease', 
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
})

export default DeleteButton3;
