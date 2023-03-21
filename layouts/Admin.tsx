import React from "react";
import PropTypes, { InferProps } from "prop-types";
import { useRouter } from "next/router";

import Box from '@mui/material/Box';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Sidebar from "../components/Sidebar/Sidebar";
import Toolbar from '@mui/material/Toolbar';
import Input from '@mui/material/Input';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axios from "axios";
import Button from '@mui/material/Button';
import {toast } from "react-toastify";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const DialogContentStyle = {
    textAlign: "center",
}
const DialogPartStyle = {
    margin: "10px",
}


export default function Admin({ children, layoutData, flag }: InferProps<typeof Admin.propTypes>) {

    const router = useRouter();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [priceModalOpen, setPriceModalOpen] = React.useState(false);
    const [carModalOpen, setCarModalOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    const priceSetModal = () => {
        setPriceModalOpen(!priceModalOpen)
    }

    const carSetModal = () => {
        setCarModalOpen(!carModalOpen)
    }

    React.useEffect(() => {
        if (!layoutData?.user)
            router.push("/auth/login")
        else if (layoutData?.user?.usertype != "admin" && layoutData?.user?.usertype != "employee") {
            router.push("/common/mainboard")
        }
    }, []);

    if (!layoutData) {
        return null;
    }
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Navbar priceSetModal={priceSetModal} layoutData={layoutData} carSetModal={carSetModal} mobilecontrol={handleDrawerToggle} />
                <Sidebar flag={flag} layoutData={layoutData} mobilecontrol={handleDrawerToggle} mobileopen={mobileOpen} />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
                >
                    <Toolbar />
                    {children}
                </Box>
                <SetModal isshow={priceModalOpen} priceModalOpen={setPriceModalOpen} close={priceSetModal}></SetModal>
                <CarModal isshow={carModalOpen} carModalOpen={setCarModalOpen} close={carSetModal}></CarModal>
            </Box>
        </>
    )
}
export const SetModal = (props:any) => {
    const [price, setPrice] = React.useState('');
    const { isshow, close, priceModalOpen} = props;
    const pricechange = (event:any) => {
        setPrice(event.target.value)
    }
    const priceSet = () => {
        if(price == "") {
            toast.error("Enter Fee");
            return;
        }
        axios.post('/api/admin/dashboard/priceset',{price})
        .then((res:any) => {
            toast.success("Fee is changed!");
            priceModalOpen(false)
        })
    }
    return (
        <Dialog
        open={isshow}
        onClose={close}
        aria-labelledby="responsive-dialog-title"
        >
      <DialogContent sx={DialogContentStyle}>
        <Typography style={DialogPartStyle} id="modal-modal-title" variant="h6" component="h2">
            Fee Setting
        </Typography>
        <br/>
        <TextField style={DialogPartStyle}
          required
          id="outlined-required"
          label="Set Fee (%)"
          value={price} onChange={(e) => pricechange(e)}
          />
          <br/>
        <Button style={DialogPartStyle} onClick={priceSet}>Change</Button>
      </DialogContent>
    </Dialog>
)
}
export const CarModal = (props:any) => {
    const [carnumber, setCarnumber] = React.useState('');
    const [carownerPhone, setCarownerPhone] = React.useState('');

    const { isshow, close, carModalOpen} = props;
    const carnumberSet = (event:any) => {
        setCarnumber(event.target.value)
    }

    const carownerPhoneSet = (event:any) => {
        setCarownerPhone(event.target.value)
    }

    const carRegister = () => {
        if(carnumber=="") {
            toast.error("Enter Car Number!");
            return;
        }
        if(carownerPhone=="") {
            toast.error("Enter Owner WhatsApp Number");
            return;
        }
        axios.post('/api/admin/dashboard/carset',
        {
            carnumber:carnumber,
            carownerPhone:carownerPhone
        })
        .then((res:any) => {
            switch (res.data.state) {
                case "success":
                    toast.success(res.data.message)
                    setCarnumber("")
                    setCarownerPhone("")
                    carModalOpen(false)
                    break;
                case "error":
                    toast.error(res.data.message)
                break
                default:
                    break;
            }

        })
    }
    return (
        <Dialog
        open={isshow}
        onClose={close}
        aria-labelledby="responsive-dialog-title"
        >
      <DialogContent 
        sx={DialogContentStyle}
      >
        <Typography style={DialogPartStyle} id="modal-modal-title" variant="h6" component="h2">
            Car Register
        </Typography>
        <TextField style={DialogPartStyle}
          required
          id="outlined-required"
          label="Car Number"
          value={carnumber} onChange={(e) => carnumberSet(e)}
        />

        <TextField style={DialogPartStyle}
          required
          id="outlined-required"
          label="Owner WhatsApp Number"
          value={carownerPhone} onChange={(e) => carownerPhoneSet(e)}
        />        
        {/* <InputLabel>Car Number: <Input type="text" className="px-4 border-2 border-blue-500 hover:border-blue-700 focus:border-blue-700" placeholder="Enter car number" value={carnumber} onChange={(e) => carnumberSet(e)}></Input></InputLabel> */}
        {/* <InputLabel>Owner Whatsapp<Input type="number" className="px-4 border-2 border-blue-500 hover:border-blue-700 focus:border-blue-700" placeholder="Enter owner number" value={carownerPhone} onChange={(e) => carownerPhoneSet(e)}></Input></InputLabel> */}
        <br/>
        <Button style={DialogPartStyle} onClick={carRegister}>Register</Button>
      </DialogContent> 
    </Dialog>
)
}

Admin.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    layoutData: PropTypes.any.isRequired,
    flag: PropTypes.any,
}