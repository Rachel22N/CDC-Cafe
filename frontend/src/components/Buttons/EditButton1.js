import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { blue, grey, pink } from '@mui/material/colors';

const EditButton1 = styled(Button)({
  height: '40px',
  width: '60px',
  cursor: 'pointer',
  fontWeight: '700',
  fontFamily: 'Arial, sans-serif',
  color: 'white',
  backgroundColor: blue[400],
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)', 
  '&:hover': {
    backgroundColor: grey[700], 
    color: pink[200], 
    boxShadow: '0 5px 8px 2px rgba(0, 0, 0, .4)', 
  },
  textTransform: 'none',
  position: 'absolute',
  // bottom: 5,
  top: 15,
  right: 15,
  transition: 'all 0.3s ease', 
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
});
export default EditButton1;
