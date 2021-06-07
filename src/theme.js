import { createMuiTheme } from "@material-ui/core";
import { green, grey } from "@material-ui/core/colors";

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#cc6828",
		},
		secondary: {
			main: grey[500],
		},
		warning: {
			main: "#c08a3e",
		},
		info: {
			main: "#27435c",
		},
		success: {
			main: "#66d393",
		},
		error: {
			main: "#ae423f",
		},
	},
	typography: {
		fontFamily: ["-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif", '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'].join(","),
		button: {
			textTransform: "none",
		},
		h5: {
			fontFamily: "Arial",
		},
	},
	overrides: {
		MUIDataTableFooterCell: {
			root: {
				borderBottom: "0",
			},
		},
		MUIRichTextEditor: {
			root: {
				marginTop: 20,
				width: "100%",
			},
			editor: {
				marginTop: 35,
				borderBottom: "1px solid gray",
			},
		},
	},
});

export default theme;
