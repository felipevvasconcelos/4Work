import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
var formatMask;

export default function TextFieldMask(props) {
	const { format, ...other } = props;

	formatMask = format;

	return (
		<TextField
			{...other}
			InputProps={{
				inputComponent: Mask,
			}}
		/>
	);
}

function Mask(props) {
	const { inputRef, onChange, ...other } = props;
	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						name: props.name,
						value: values.value,
					},
				});
			}}
			format={formatMask}
		/>
	);
}

Mask.propTypes = {
	inputRef: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
