import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";

export default function CustomDataTable(props) {
	const { data, columns, children } = props;

	const options = {
		selectableRowsHideCheckboxes: true,
		filterType: "checkbox",
		labelRowsPerPage: "Linhas por página",
		textLabels: {
			pagination: {
				rowsPerPage: "Linhas por página",
				displayRows: "de",
			},
			toolbar: {
				search: "Buscar",
				downloadCsv: "Download CSV",
				print: "Imprimir",
				viewColumns: "Colunas",
				filterTable: "Filtrar",
			},
		},
		elevation: 0,
		customToolbar: () => {
			return children;
		},
	};

	return <MUIDataTable data={data} columns={columns} options={options} />;
}

CustomDataTable.propTypes = {
	data: PropTypes.array,
	columns: PropTypes.array,
	children: PropTypes.node,
};
