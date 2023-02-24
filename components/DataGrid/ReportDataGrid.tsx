import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import TheatersIcon from '@mui/icons-material/Theaters';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Chip from '@mui/material/Chip';

import axios from 'axios';
import {
  GridRowsProp,
  DataGrid,
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { datastatus } from '../../utils/SidebarData';
import { send } from 'process';
import { PricingV1PhoneNumberPhoneNumberCountryInstancePhoneNumberPrices } from 'twilio/lib/rest/pricing/v1/phoneNumber/country';
import { toast } from 'react-toastify';



interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {

  return (
    <GridToolbarContainer>
      <div className='w-full flex'>
        {datastatus.map((item: any) =>
          <Chip className={`super-app-theme--${item.current} m-1`} label={item.current} key={item.current} />)
        }
      </div>
    </GridToolbarContainer>
  );
}

const formatRows: GridRowsProp = [];

export default function ReportDataGrid(props: any) {

  const [open, setOpen] = React.useState(false);
  const [modalopen, setModalopen] = React.useState(false);
  const [videopath, setVideopath] = React.useState({ fpath: "", ftype: "" });
  const [qrPath, setQrPath] = React.useState("");


  function handleClickOpen(fvalue: string, ftype: string): void {
    setOpen(true);
    setVideopath({ fpath: fvalue, ftype: ftype });
  }

  const updatedata = (method: string, data: any) => {
    let flag = data.reportflag;
    if (method === "upgrade") {
      flag = datastatus.filter((item: any) => item.current == flag)[0].upgrade;
    } else if (method === "cancel") {
      flag = datastatus.filter((item: any) => item.current == flag)[0].cancel;
    }
    const changeddata = {
      _id: data._id,
      whatsapp: data.sendedwhatsapp,
      car: data.reportedcar,
      flag: flag,
      type: data.reporttype,
      fine: data.reportfine,
    }
    props.updateData(changeddata);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleModalOpen = (params: any) => {
    setQrPath(`/uploads/qr/_new${params._id}.png`)
    setModalopen(true)
  }

  const handleModalClose = () => {
    setModalopen(false);
  }
  const [rows, setRows] = React.useState(formatRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [pageSize, setPageSize] = React.useState<number>(10);

  React.useEffect(() => {
    const griddata: GridRowsProp = props.data;
    setRows(griddata);
  }, [props]);

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    // setRows(rows.filter((row) => row._id !== id));
    updatedata("cancel", rows.filter((item: any) => item._id == id)[0]);
  };

  const handlestatusClick = (params: any) => () => {
    const sendData = {
      id: params._id,
      carnumber: params.inventory_docs.length > 0 ? params.inventory_docs[0].carnumber : " ",
      totalPrice: params.reportfine,
      reporterPrice:params.reportfine * 0.9,
      date: params.reportdate,
      payState: "NO",
      filepath: params.reportmedia.filepath,
      reporter_name: params.caremployeer[0].name,
      reporter_email: params.caremployeer[0].email
    }
    if (params.reportflag == "new") {
      axios
        .post("/api/twilio/newQrcode", sendData)
        .then((res: any) => {
          toast.success("Message successfully sent!")
        })
        .catch((err) => {
        })
        .finally(() => {
        });
    };
    return;
    if (params.reportflag == "check") {
      sendData.payState="YES"
      axios
        .post("/api/twilio/checkQrcode", sendData)
        .then((res: any) => {
          toast.success("Message successfully sent!")
        })
        .catch((err) => {
        })
        .finally(() => {
        });
    }

    if (params.reportflag = "fine") {
      axios
        .post("/api/twilio/fineMessage", sendData)
        .then((res:any)=>{
          toast.success("Message successfully sent!")
        })
        .catch((err) => {
        })
        .finally(() => {
        })
    }
    // updatedata("upgrade", rows.filter((item: any) => item._id == params._id)[0]);
  };



  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    updatedata("data", updatedRow);
    // setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
    return updatedRow;
  };


  const columns: GridColumns = [
    { field: '_id', headerName: '_id', width: 0, editable: false, hide: true },
    {
      field: 'rname',
      headerName: '👥 Name',
      width: 120,
      editable: false,
      sortable: false,
      renderCell: (params: any) => (
        <Tooltip title={params.row.caremployeer[0].name}>
          <span className="table-cell-trucate">{params.row.caremployeer[0].name}</span>
        </Tooltip>
      ),
    },
    {
      field: 'rwhatnumber',
      headerName: 'Reporter 📱',
      width: 120,
      editable: false,
      sortable: false,
      renderCell: (params: any) => (
        <Tooltip title={params.row.caremployeer[0].whatsapp}>
          <span className="table-cell-trucate">{params.row.caremployeer[0].whatsapp}</span>
        </Tooltip>
      ),
    },
    {
      field: 'reporttype',
      headerName: 'Type',
      width: 200,
      editable: true,
      type: "singleSelect",
      valueOptions: [
        "standard",
        "Dangerous driving",
        "Traffic light not obeyed",
        "Illegal Overtake",
        "Illegal stopping",
        "Failure to stop after accident"
      ]
    },
    {
      field: 'reportnumber',
      headerName: 'No 🔢',
      width: 80,
      editable: false,
      sortable: false,
      renderCell: (params: any) => (
        <Tooltip title={`Limit: ${params.row.caremployeer[0].reportlimit}`}>
          <span className="table-cell-trucate">{params.row.caremployeer[0].reportnumber}</span>
        </Tooltip>
      ),
    },
    {
      field: 'reportgps',
      headerName: 'GPS 🌍',
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params: any) => (
        <Tooltip title={params.row.reportgps} >
          <span className="table-cell-trucate">{params.row.reportgps}</span>
        </Tooltip>
      ),
    },
    {
      field: 'reportdate',
      headerName: 'Date',
      type: 'date',
      width: 100,
      editable: false,
    },
    { field: 'reportedcar', headerName: 'Car Number', width: 130, editable: true },
    {
      field: 'ownerPhone',
      headerName: 'Owner Phone',
      width: 130,
      editable: false,
      renderCell: (params: any) => (
        <Tooltip title={params.row.inventory_docs.length > 0 ? params.row.inventory_docs[0].phonenumber : ""}>
          <span className="table-cell-trucate">{params.row.inventory_docs.length > 0 ? params.row.inventory_docs[0].phonenumber : ""}</span>
        </Tooltip>
      ),
    },
    // { field: 'sendedwhatsapp', headerName: 'Owner 📱', sortable: false, width:120, editable: true },
    {
      field: 'id',
      headerName: 'QR 🔢',
      sortable: false,
      type: 'actions',
      width: 80,
      editable: false,
      getActions: (params: any) => {
        if (params.row.reportflag != "new") {
          return [
            <GridActionsCellItem
              key={params.row.id}
              icon={<QrCode2Icon />}
              label="Video View"
              className="textPrimary"
              onClick={() => handleModalOpen(params.row)}
              color="inherit"
            />
          ];
        } else {
          return [];
        }
      },
    },
    { field: 'reportfine', headerName: '💲', type: 'number', width: 70, editable: true },
    {
      field: 'video',
      type: 'actions',
      headerName: '🎬',
      width: 50,
      cellClassName: 'actions',
      getActions: (params: any) => {
        return [
          <GridActionsCellItem
            key={params.row.reportmedia.filepath}
            icon={params.row.reportmedia.filetype == "video" ? <TheatersIcon /> : <InsertPhotoIcon />}
            label="Video View"
            className="textPrimary"
            onClick={() => handleClickOpen(params.row.reportmedia.filepath, params.row.reportmedia.filetype)}
            color="inherit"
          />
        ];
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 90,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={`${id}-save`}
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={`${id}-cancel`}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={`${id}-edit`}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={`${id}-delete`}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    }, {
      field: 'check',
      type: 'actions',
      headerName: '✅',
      width: 50,
      cellClassName: 'actions',
      getActions: (params: any) => {
        return [
          <GridActionsCellItem
            key={`${params.row._id}-check`}
            icon={<CheckCircleOutlineIcon />}
            label="Check"
            className="textPrimary"
            onClick={handlestatusClick(params.row)}
            color="inherit"
          />
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row: any) => row._id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel: any) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        getRowClassName={(params) => `super-app-theme--${params.row.reportflag}`}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 15, 25]}
        pagination
        experimentalFeatures={{ newEditingApi: true }}
      />
      <div>
        <VideoModal close={handleClose} isshow={open} media={videopath}></VideoModal>
      </div>
      <div>
        <QrModal close={handleModalClose} qrPath={qrPath} isshow={modalopen}></QrModal>
      </div>
    </Box>
  );
}

const VideoModal = (props: any) => {

  return (
    <Dialog
      open={props.isshow}
      onClose={props.close}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {`Reported ${props.media.ftype}`}
      </DialogTitle>
      <DialogContent>
        {props.media.ftype == "video" ? <video controls width="50%" style={{ width: "inherit" }}>
          <source src={props.media.fpath} type="video/mp4" />
          <h5>{`Sorry, Your browser doesn't support videos.`}</h5>
        </video> : <Zoom>
          <img
            alt="That Wanaka Tree, New Zealand by Laura Smetsers"
            src={props.media.fpath}
            width="500"
          />
        </Zoom>}
      </DialogContent>
    </Dialog>
  )
}
export const QrModal = (props: any) => {
  const { isshow, close, qrPath } = props;

  return (
    <Dialog
      open={isshow}
      onClose={close}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <Zoom>
          <img
            alt="QR Code"
            src={qrPath}
            width="400"
          />
        </Zoom>
      </DialogContent>
    </Dialog>
  )
}
