import { createContext, useEffect, useState, useContext } from 'react';

import { AtuhenticationContext }  from '../Context/AuthenticationContextAPI';
import dayjs from 'dayjs'

export const TimesheetContext = createContext({});

export function TimesheetContextProvider({children}){
  const { userData } = useContext(AtuhenticationContext);
  const [ openTimesheet, setOpenTimesheet ] = useState(false);
  const [ timesheet, setTimesheet ] = useState({});

  async function TimesheetIsOpen(){

    const data = { user: userData._id, timeEnd: null }

    const timesheet = await fetch('/api/timesheet/filter', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    const response = await timesheet.json();

    if(response.length > 0){
      setTimesheet(response[0]);
      setOpenTimesheet(true);
    }
  }

  useEffect(() =>{
    if(userData?._id){
      TimesheetIsOpen()
    }
  },[openTimesheet, userData])

  const validateTimesheet = async (timesheet) => {

    if(dayjs(timesheet.timeStart) > dayjs(timesheet.timeEnd)) { 
      return { message: "Data Final não pode ser menor que a Inicial!", success: false } 
    };

    const data = { filter: { user: userData._id, timeEnd: timesheet.timeEnd, timeStart: timesheet.timeStart } }

    const start = await fetch(`/api/timesheet/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if(!await start.json()){
      return { message: "Já existe um registro com essa data!", success: false }
    }

    return { message: "Validado com Sucesso!", success: true }
	}

  return(
    <TimesheetContext.Provider
      value={{
        openTimesheet,
        validateTimesheet,
        timesheet,
        TimesheetIsOpen
      }}
    >
      {children}
    </TimesheetContext.Provider>
  )
}