import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbars({message, handleCloseError}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    handleCloseError()
  }

  return (
    <div className={classes.root} className="noOutline">
      <Snackbar 
      open={true} 
      autoHideDuration={4000} 
      //onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      >
        <Alert onClose={() => handleClose()} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}