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
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import Chip from '@mui/material/Chip';
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
  unstable_resetCleanupTracking,
} from '@mui/x-data-grid';

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import {datastatus} from '../../utils/SidebarData';



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
        {datastatus.map((item:any) =>
          <Chip className={`super-app-theme--${item.current} m-1`} label={item.current} key={item.current} />)
        }
      </div>
    </GridToolbarContainer>
  );
}

const formatRows: GridRowsProp= [];

export default function ReportDataGrid(props:any) {
  console.log(props.data);
  const [open, setOpen] = React.useState(false);
  const[videopath, setVideopath] = React.useState({fpath:"", ftype:""});

  const handleClickOpen = (fvalue:string, ftype:string) => {
    setOpen(true);
    setVideopath({fpath:fvalue, ftype:ftype});
  };

  const updatedata = (method:string,data:any) => {
    let flag = data.usertype;
    console.log(data)
    const changeddata = {
      _id:data._id,
      carnumber:data.carnumber,
      phonenumber:data.phonenumber,
      permission:'true'
    }
    if(method==="upgrade"){
      changeddata.permission = "true"
      // flag = datastatus.filter((item:any)=>item.current == flag)[0];
    }else if(method==="cancel"){
      changeddata.permission = "false";
      // flag = datastatus.filter((item:any)=>item.current == flag)[0];
    }
    props.updateData(changeddata);
  } 

  const handleClose = () => {
    setOpen(false);
  };

  const [rows, setRows] = React.useState(formatRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [pageSize, setPageSize] = React.useState<number>(10);

  React.useEffect(()=>{
    const griddata:GridRowsProp = props.data;
    setRows(griddata);
  },[props]);

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
    updatedata("cancel", rows.filter((item:any)=>item._id == id)[0]);
  };

  const handlestatusClick = (id: any) => () => {
    updatedata("upgrade", rows.filter((item:any)=>item._id == id)[0]);
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
    { field: 'carnumber', 
      headerName: '👥 CarName', 
      width: 300, 
      editable: true,
      sortable: true,
      renderCell: (params:any) =>  (
        <Tooltip title={params.row.carnumber}>
          <span className="table-cell-trucate">{params.row.carnumber}</span>
        </Tooltip>
      ),
     },
    { 
      field: 'phonenumber', 
      headerName: 'Owner Number 📱', 
      width:300,
      editable: true,
      sortable: true,
      renderCell: (params:any) =>  (
        <Tooltip title={params.row.phonenumber}>
          <span className="table-cell-trucate">{params.row.phonenumber}</span>
        </Tooltip>
      ),
     },
    {
      field: 'reportdate',
      headerName: 'Employee Name',
      type: 'date',
      width: 300,
      editable: false,
      renderCell: (params:any) =>  (

          <Tooltip title={params.row.caremployee[0].name ? params.row.caremployee[0].name : ""}>
          <span className="table-cell-trucate">{params.row.caremployee[0].name ? params.row.caremployee[0].name : ""}</span>
          </Tooltip>
        
      ),
      
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
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
        getRowId={(row: any) =>  row._id}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={(newModel:any) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
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
    </Box>
  );
}

