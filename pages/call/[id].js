import 'date-fns';
import Head from 'next/head'
import React from 'react'
import Layout, {siteTittle} from '../../components/layout'
import { useRouter } from 'next/router'
import { Container, Paper, Grid, TextField, FormControlLabel, Checkbox, Tooltip, Divider, Select, MenuItem, FormControl , InputLabel, Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIRichTextEditor from 'mui-rte'
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

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

const defaultTheme = createMuiTheme()

Object.assign(defaultTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                marginTop: 20,
                width: "100%"
            },
            editor: {
                marginTop: 35,
                borderBottom: "1px solid gray" 
            }
        }
    }
})

export default function CallById(){
    const route = useRouter();
    const classes = useStyles();
    
    const [state, setState] = React.useState({ active: true });
    const [selectedDate, setSelectedDate] = React.useState(new Date('2021-03-18T21:11:54'));
    const [age, setAge] = React.useState('');

    const handleSelectChange = (event) => { setAge(event.target.value); };
    const handleDateChange = (date) => { setSelectedDate(date); };
    const handleChange = (event) => { setState({ ...state, [event.target.name]: event.target.checked }); };

    return(
        <Layout>
            <Head>
                <title>{siteTittle}</title>
            </Head>
            <Container maxWidth="xl">
                <h1 id="childrenTittle">{route.query.id == "new" ? 'Novo Chamado' : 'Chamado'}</h1>

                <div className={classes.root}>
                    <Grid container spacing={3} justify='flex-end' style={{marginBottom: '3px'}}>
                        <Tooltip title={"Salvar"}  >
                            <IconButton color="primary" aria-label="delete" style={{marginRight: '-10px'}}><SaveIcon fontSize="large" /></IconButton>
                        </Tooltip>
                        <Tooltip title={"Deletar"}  >
                            <IconButton color="secondary" aria-label="delete"><DeleteForeverIcon fontSize="large" /></IconButton>
                        </Tooltip>
                    </Grid>
                </div>

                <div className={classes.root}>
                    <Paper elevation={3}>
                        <form className={classes.formRoot}>

                            <Grid container spacing={3} alignContent='flex-end'>
                                <Grid item xs={12}>
                                    <h3 style={{marginBottom: '-30px'}}>Informações Principais</h3>
                                </Grid>
                                <Grid item xs={11} md={8} >
                                    <TextField id="tittleCall" margin='normal' fullWidth label="Título Chamado" />
                                </Grid>
                                <Grid item xs={1} container alignContent='flex-end'>
                                    <Tooltip title={"Ativo"}  >
                                        <FormControlLabel control={ <Checkbox checked={state.active} onChange={handleChange} name="active" color="primary" /> } />
                                    </Tooltip>
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} alignContent='flex-end'>
                                <Grid item xs={12} md={3} >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker fullWidth id="date-picker-inline" disabled disableToolbar variant="inline" format="dd/MM/yyyy" margin="normal" label="Criado em" 
                                            value={selectedDate} 
                                            onChange={handleDateChange} KeyboardButtonProps={{ 'aria-label': 'change date', }} 
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={3} >
                                    <TextField margin='normal' fullWidth label="Criado por" disabled value='Felipe' />
                                </Grid>
                                <Grid item xs={12} md={3} >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker fullWidth id="date-picker-inline" disabled disableToolbar variant="inline" format="dd/MM/yyyy" margin="normal" label="Modificado em" 
                                            value={selectedDate} 
                                            onChange={handleDateChange} KeyboardButtonProps={{ 'aria-label': 'change date', }} 
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={3} >
                                    <TextField margin='normal' fullWidth label="Modificado por" disabled value='Felipe' />
                                </Grid>

                            </Grid>

                            <Grid container spacing={3} alignContent='flex-end'>
                                <Grid item xs={12}> 
                                    <h3 style={{marginBottom: '-30px'}}>Dados de Importância</h3>
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <TextField margin='normal' fullWidth label="Número" disabled value='1111' />
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" onChange={handleSelectChange} value={age} >
                                            <MenuItem value={10}>Pendente</MenuItem>
                                            <MenuItem value={20}>Parado</MenuItem>
                                            <MenuItem value={30}>Fechado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} alignContent='flex-end'>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker fullWidth id="date-picker-inline" disabled disableToolbar variant="inline" format="dd/MM/yyyy" margin="normal" label="Fechado em" 
                                            value={selectedDate} 
                                            onChange={handleDateChange} KeyboardButtonProps={{ 'aria-label': 'change date', }} 
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">Prioridade</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" onChange={handleSelectChange} value={age} >
                                            <MenuItem value={10}>Baixa</MenuItem>
                                            <MenuItem value={20}>Média</MenuItem>
                                            <MenuItem value={30}>Alto</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4} container alignContent='flex-end'>
                                    <Tooltip title={"Ativo"}  >
                                        <FormControlLabel label="Requer Mudança" control={ <Checkbox checked={state.active} onChange={handleChange} name="active" color="primary"  /> } />
                                    </Tooltip>
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} alignContent='flex-end'>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">Release</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" >
                                            <MenuItem value={10}>Baixa</MenuItem>
                                            <MenuItem value={20}>Média</MenuItem>
                                            <MenuItem value={30}>Alto</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">Tipo</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" >
                                            <MenuItem value={10}>Baixa</MenuItem>
                                            <MenuItem value={20}>Média</MenuItem>
                                            <MenuItem value={30}>Alto</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">Categoria</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" >
                                            <MenuItem value={10}>Baixa</MenuItem>
                                            <MenuItem value={20}>Média</MenuItem>
                                            <MenuItem value={30}>Alto</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">SubCategoria</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" >
                                            <MenuItem value={10}>Baixa</MenuItem>
                                            <MenuItem value={20}>Média</MenuItem>
                                            <MenuItem value={30}>Alto</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} alignContent='flex-end'>
                                <Grid item xs={12}> 
                                    <h3 style={{marginBottom: '-30px'}}>Dados do Chamado</h3>
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">Instância</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" >
                                            <MenuItem value={10}>Baixa</MenuItem>
                                            <MenuItem value={20}>Média</MenuItem>
                                            <MenuItem value={30}>Alto</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3} container alignContent='flex-end'>
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel id="demo-simple-select-helper-label">Fila</InputLabel>
                                        <Select labelId="demo-simple-select-label" id="demo-simple-select" >
                                            <MenuItem value={10}>Baixa</MenuItem>
                                            <MenuItem value={20}>Média</MenuItem>
                                            <MenuItem value={30}>Alto</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} container alignContent='flex-end' >
                                    <FormControl fullWidth margin='normal'>
                                        <Button variant="outlined" component="label" > Adicionar arquivo
                                            <input type="file" hidden />
                                        </Button>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} style={{minHeight: '200px'}} >
                                    <Grid item xs={12}> 
                                        <h3 style={{marginBottom: '-10px'}}>Solicitação</h3>
                                    </Grid>
                                    <MuiThemeProvider theme={defaultTheme}>
                                        <MUIRichTextEditor label="Descreva sua solicitação aqui..."  />
                                    </MuiThemeProvider>
                                </Grid>
                            </Grid>

                        </form>
                        
                        
                    </Paper>
                </div>
            </Container>

            

        </Layout>
        
    );
}