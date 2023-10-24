import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SharedContext from './utility/context';

function DeleteItemDialog( {handleClose, handleDelete} ){  
  const { deleteDialogOpen } = React.useContext(SharedContext); 

    return (
        <div id='deleteDialog'>
        <Dialog
        open={deleteDialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to delete this item?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"> 
          "maybe include details of item placeholder"
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    )
}

export default DeleteItemDialog;