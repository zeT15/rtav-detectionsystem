
import ReportIcon from '@mui/icons-material/Report';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PaidIcon from '@mui/icons-material/Paid';
import VerifiedIcon from '@mui/icons-material/Verified';
import GroupIcon from '@mui/icons-material/Group';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const sidebardata: any[] = [
    {
        key: "user",
        data: [
            {
                id: 1,
                role: ["admin"],
                key: "users",
                name: "Users List",
                icon: <GroupIcon />
            },
        ]
    },

    {
        key: "main",
        data: [
            {
                id: 1,
                role: ["admin"],
                key: "new",
                name: "New Incident",
                icon: <FiberNewIcon />
            }, {
                id: 2,
                role:  ["admin", "employee"],
                key: "check",
                name: "Checked",
                icon: <CheckBoxIcon />
            }, {
                id: 3,
                role: ["admin", "employee"],
                key: "fine",
                name: "Fined",
                icon: <PaidIcon />
            }, {
                id: 4,
                role: ["admin"],
                key: "paid",
                name: "Paid",
                icon: <VerifiedIcon />
            }
        ],
    },
    {
        key: "add",
        data: [
            {
                id: 5,
                role: ["admin"],
                key: "all",
                name: "All Incident",
                icon: <ReportIcon />
            },
            {
                id: 6,
                role: ["admin"],
                key: "trash",
                name: "Trash",
                icon: <DeleteForeverIcon />
            }, 
            {
                id: 7,
                role: ["admin"],
                key: "cancel",
                name: "Canceled",
                icon: <DoNotDisturbOnIcon />
            }
        ]
    }
]

export const datastatus: any[] = [
    {
        current: "new",
        upgrade: "check",
        cancel: "cancel"
    },
    {
        current: "check",
        upgrade: "fine",
        cancel: "cancel"
    },
    {
        current: "fine",
        upgrade: "paid",
        cancel: "cancel"
    }, 
    {
        current: "paid",
        upgrade: "paid",
        cancel: "cancel"
    },
    {
        current: "cancel",
        upgrade: "trash",
        cancel: "new",
    }, 
    {
        current: "trash",
        upgrade: "new",
        cancel: "new",
    }
]