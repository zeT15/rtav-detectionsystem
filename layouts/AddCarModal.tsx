import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Typography from '@mui/material/Typography';

const DialogPartStyle = {
    margin: "10px",
}

const AddCarModal = (props:any) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setCarnumber("");
    setCarownerPhone("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const newCar = {
        carnumber:carnumber,
        carownerPhone:carownerPhone,
    }
    if(props.handleSubmit)
        props.handleSubmit(newCar);
    setOpen(false);
  };

  const [carnumber, setCarnumber] = React.useState('');
  const [carownerPhone, setCarownerPhone] = React.useState('');

  const carnumberSet = (event:any) => {
      setCarnumber(event.target.value)
  }

  const carownerPhoneSet = (event:any) => {
      setCarownerPhone(event.target.value)
  }

  return (
    <div>
        <Button className="mb-2 bg-blue-500" variant="contained" color="primary" endIcon={<DirectionsCarIcon/>}
            onClick={handleClickOpen}>
            Add Car
        </Button>
        <Dialog open = {open} onClose = {handleClose} 
            fullWidth = {false}
            maxWidth = {"sm"}>
            <DialogTitle>
                Car Register
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    id="outlined-required"
                    label="Car Number"
                    fullWidth = {true}
                    variant="standard"
                    value={carnumber} onChange={(e) => carnumberSet(e)}
                />
                <TextField
                    className="mt-2"
                    id="outlined-required"
                    label="Owner WhatsApp Number"
                    fullWidth = {true}
                    variant="standard"
                    value={carownerPhone} onChange={(e) => carownerPhoneSet(e)}
                />
            </DialogContent>
            <DialogActions>
                <Button className="bg-blue-500" onClick={handleSubmit} variant="contained" color="primary" size="medium">Add Car</Button>
                <Button onClick={handleClose} variant="outlined" color="secondary" size="medium">Cancel</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};

export default AddCarModal;