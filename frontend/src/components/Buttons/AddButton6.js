import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { pink } from '@mui/material/colors';
import { grey } from '@mui/material/colors';

const AddButton6 = styled(Button)({
  height: '100px',
  width: '900px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '38px',
  fontFamily: 'Arial',
  color: 'white',
  backgroundColor: pink[200],
  '&:hover': {
    backgroundColor: grey[500],
    color: pink[400],
    boxShadow: '0 10px 15px 4px rgba(0, 0, 0, .5)', 
    transform: 'scale(1.05)', 
    borderColor: 'rgba(255, 255, 255, 0.8)', 
  },
  textTransform: 'none',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)', 
  transition: 'all 0.3s ease', 
  borderRadius: '10px',
  // border: '1px solid rgba(255, 255, 255, 0.5)',
});


export default AddButton6;
