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
        if (!layoutData.user)
            router.push("/auth/login")
        else if (layoutData.user.usertype != "admin" && layoutData.user.usertype != "employee") {
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
      <DialogContent>
        <Input type="number" className="px-4 border-2 border-blue-500 hover:border-blue-700 focus:border-blue-700" placeholder="Enter fee price" value={price} onChange={(e) => pricechange(e)}></Input><br/>
        <Button onClick={priceSet}>Change</Button>
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
      <DialogContent>
        <Input type="text" className="px-4 border-2 border-blue-500 hover:border-blue-700 focus:border-blue-700" placeholder="Enter car number" value={carnumber} onChange={(e) => carnumberSet(e)}></Input><br/>
        <Input type="number" className="px-4 border-2 border-blue-500 hover:border-blue-700 focus:border-blue-700" placeholder="Enter owner number" value={carownerPhone} onChange={(e) => carownerPhoneSet(e)}></Input><br/>
        <Button onClick={carRegister}>Register</Button>
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