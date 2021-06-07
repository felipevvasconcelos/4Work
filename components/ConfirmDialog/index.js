import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

export default function ConfirmDialog({ confirmDialog, handleConfirmDialogClose }) {
	const { openDialog, dialogTitle, dialogMessage, fncDialog, paramsFncDialog } = confirmDialog;

	return (
		<Dialog open={openDialog} onClose={handleConfirmDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
			<DialogTitle>{dialogTitle}</DialogTitle>
			<DialogContent>
				<DialogContentText>{dialogMessage}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button color="secondary" onClick={handleConfirmDialogClose}>
					Cancelar
				</Button>
				<Button variant="contained" color="primary" onClick={() => fncDialog(paramsFncDialog)}>
					Confirmar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
