import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const DialogPartStyle = {
    margin: "10px",
}

const AddUserModal = (props:any) => {
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState({name:"",email:"",password:"",whatsapp:""});
    const [errors, setErrors] = React.useState({name:null, email:null, password:null, whatsapp:null});
    const [isZim, setIsZim] = React.useState(true);

    const changeZimbabweNumber = () => {
        let wNum = user.whatsapp;
        if(!wNum)
            wNum = "";
        if(!isZim){
            if(wNum.substring(0,1) === "+"){
                wNum = wNum.substring(1);
            }
            if(wNum.substring(0,1) === "0"){
                wNum = wNum.substring(1);
            }
            wNum = "+263" + wNum;
        }else{
            if(wNum.substring(0,1) === "+"){
                wNum = wNum.substring(1);
            }
            if(wNum.substring(0,3) === "263"){
                wNum = wNum.substring(3);
            }
            wNum = "+" + wNum;
        }
        setIsZim(!isZim);
        setUser({ ...user, whatsapp: wNum });
    };

    const handleClickOpen = () => {
        setUser({name:"",email:"",password:"",whatsapp:""});
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if(props.handleSubmit)
            props.handleSubmit(user);
        setOpen(false);
    };

    return (
        <div>
            <Button className="mb-2 bg-blue-500" variant="contained" color="primary" endIcon={<PersonAdd/>}
                onClick={handleClickOpen}>
                Add User
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    User Register
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        className="mb-4"
                        id="user name"
                        label="User Name"
                        fullWidth = {true}
                        variant="standard"
                        value={user.name}
                        onChange={(e)=>{setUser({...user, name:e.target.value})}}
                    />
                    <TextField
                        id="email"
                        className="mb-4"
                        label="Email Address"
                        type="email"
                        fullWidth = {true}
                        variant="standard"
                        value={user.email}
                        onChange={(e)=>{setUser({...user, email:e.target.value})}}
                    />
                    <TextField
                        className=""
                        id="whatsapp"
                        label="Whatsapp Number"
                        fullWidth = {true}
                        variant="standard"
                        value={user.whatsapp}
                        onChange={(e)=>{setUser({...user, whatsapp:e.target.value})}}
                    />
                    <FormControlLabel className="mb-4" control={
                        <Checkbox
                            checked={isZim}
                            onChange={(e) => {changeZimbabweNumber()}}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    } label="Zimbabwe Number" />
                    <TextField
                        id="pass"
                        className="mb-4"
                        label="Password"
                        type="password"
                        fullWidth = {true}
                        variant="standard"
                        value={user.password}
                        onChange={(e)=>{setUser({...user, password:e.target.value})}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button className="bg-blue-500" onClick={handleSubmit} variant="contained" color="primary" size="medium">Add User</Button>
                    <Button onClick={handleClose} variant="outlined" color="secondary" size="medium">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddUserModal;