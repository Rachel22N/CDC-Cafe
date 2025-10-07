import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import { blue } from '@mui/material/colors';

const AddButton7 = styled(Button)({
  height: '50px',
  width: '180px',
  cursor: 'pointer',
  fontWeight: '700',
  fontFamily: 'Arial',
  color: grey[800],
  backgroundColor: blue[200],
  '&:hover': {
    backgroundColor: grey[500],
    color: blue[400],
    boxShadow: '0 5px 8px 2px rgba(0, 0, 0, .4)', 
  },
  // fontSize: '20px',
  textTransform: 'none',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .2)', 
  transition: 'all 0.3s ease', 
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  transition: 'all 0.3s ease', 
})

export default AddButton7;
