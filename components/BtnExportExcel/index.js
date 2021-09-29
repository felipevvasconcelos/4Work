import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { IconButton, Tooltip } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

export default function BtnExportToExcel({ apiData, fileName }) {
	const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";

	const exportToCSV = (apiData, fileName) => {
		const ws = XLSX.utils.json_to_sheet(apiData);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	return (
		<Tooltip title={"Exportar Relatório"}>
			<IconButton style={{ color: "grey" }} onClick={(e) => exportToCSV(apiData, fileName)}>
				<FontAwesomeIcon icon={faFileExport} />
			</IconButton>
		</Tooltip>
	);
}
