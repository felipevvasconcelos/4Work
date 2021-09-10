import { createContext, useEffect, useState, useContext } from 'react';

import { AtuhenticationContext }  from '../Context/AuthenticationContextAPI';
import dayjs from 'dayjs'

export const TimesheetContext = createContext({});

export function TimesheetContextProvider({children}){
  const { userData } = useContext(AtuhenticationContext);
  const [ openTimesheet, setOpenTimesheet ] = useState(false);

  async function TimesheetIsOpen(){

    const timesheet = await fetch(`/api/timesheet/context/getPending/${userData._id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    
    timesheet.body && setOpenTimesheet(true);
    console.log(openTimesheet);
  }

  useEffect(() =>{
    TimesheetIsOpen()
  },[])

  const validateTimesheet = async (timesheet) => {
    if(openTimesheet){ 
      return { message: "Timesheet Pendente!", success: false } 
    };

    if(timesheet.timeStart > dayjs(timesheet.timeEnd)) { 
      return { message: "Data Final não pode ser menor que a Inicial!", success: false } 
    };

    const start = await fetch(
      `/api/timesheet/context/getTimesheet
      /:${timesheet.timeStart}
      /:${timesheet.timeEnd}
      /:${userData._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    if(start.body){
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