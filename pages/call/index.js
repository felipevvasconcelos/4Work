import Head from 'next/head'
import React from 'react';
import Layout, {siteTittle} from '../../components/layout'
import CssBaseline from '@material-ui/core/CssBaseline';
import MUIDataTable from "mui-datatables";
import {IconButton, Tooltip, Container, Grid} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';

const columns = ["Título", "Operador", "Solicitante", "Data Criação", "Sla"];

const data = [
 ['Titulo chamado teste', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste2', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste3', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste4', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste5', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste55', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste6', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste66', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste7', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste8', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste9', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste999', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste65553', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste45347', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
 ['Titulo chamado teste63636', 'Felipe', 'Felipinho', '07/03/2021', '07/03/2021'],
];

const options = {
  selectableRowsHideCheckboxes: true,
  filterType: 'checkbox',
  labelRowsPerPage: 'Linhas por página',
  textLabels:{
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
  
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      width: '100%',
      height: '100%'
    },
  },
  formRoot: {
      display: 'flex',
      flexWrap: 'wrap',
      padding: '20px'
  },

}));

export default function Call(){
  const classes = useStyles();

  return (
    <Layout>
      <Head>
        <title>{siteTittle}</title>
      </Head>
        <Container maxWidth="xl">
          <h1 id="childrenTittle">Chamados</h1>
          <div className={classes.root}>
            <Grid container spacing={3} justify='flex-end' style={{marginBottom: '3px'}}>
              <Link href="/call/new">
                <Tooltip title={"Novo Chamado"}  >
                    <IconButton aria-label="delete" style={{marginRight: '-10px', color: 'green'}}><AddIcon  fontSize="large" /></IconButton>
                </Tooltip>
              </Link>
            </Grid>
          </div>
          <div className={classes.root}>
            <MUIDataTable data={data} columns={columns} options={options} />
          </div>
        </Container>
    </Layout>
  ) 
}



