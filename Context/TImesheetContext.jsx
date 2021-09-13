import { createContext, useEffect, useState, useContext } from 'react';

import { AtuhenticationContext }  from '../Context/AuthenticationContextAPI';
import dayjs from 'dayjs'

export const TimesheetContext = createContext({});

export function TimesheetContextProvider({children}){
  const { userData } = useContext(AtuhenticationContext);
  const [ openTimesheet, setOpenTimesheet ] = useState(false);

  async function TimesheetIsOpen(){

    const data = { filter: { user: userData._id, timeEnd: null } }

    const timesheet = await fetch('/api/timesheet/filter', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    
    await timesheet.json() && setOpenTimesheet(true);
    console.log(openTimesheet);
  }

  useEffect(() =>{
    TimesheetIsOpen()
  },[])

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
        validateTimesheet
      }}
    >
      {children}
    </TimesheetContext.Provider>
  )
}