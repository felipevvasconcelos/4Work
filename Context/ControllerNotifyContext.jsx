import { createContext, useEffect, useContext, useState } from 'react';
import { io } from 'socket.io-client';

import { AtuhenticationContext } from './AuthenticationContextAPI';

export const ControllerNotifyContext = createContext({});


export function ControllerNotifyContextProvider({children}){

  // const { userData } = useContext(AtuhenticationContext);

  // const [notifications, setNotifications] = useState([]);
  // const [loading, setloading] = useState(false);

  // const socket = io("http://localhost:3333", {
  //   transports: ["websocket", "polling"]
  // });

  // useEffect(() => {
  //   socket.emit('Settings', { id: userData?._id})
  // }, [userData]);


  // useEffect(() => {
  //   if(userData && !loading){
  //     getNotifications();
  //   }
  // }, [userData]);

  // const getNotifications = async () => {
  //   const notify = await fetch("/api/notifyApplication/filter", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id: userData._id }),
  //   });

  //   setNotifications(await notify.json());
  //   setloading(true);
  // }

  // function SenderNotify(_id, users){
  //   socket.emit("NotifyRecived", {
  //     _id,
  //     send: 'All'
  //   })
  // }

  // socket.on("NotifySend", async (_id) => {
  //   // const notify = await fetch(`/api/notifyApplication/${_id}`, {
  //   //   method: "GET",
  //   //   headers: { "Content-Type": "application/json" }
  //   // });
  //   console.log("New notify: " + _id);
  //   // setNotifications({ ...notifications, ...(await notify.json()) });
  // });

  // useEffect(() => {
  //   console.log(notifications);
  // }, [notifications])

  return(
    <ControllerNotifyContext.Provider
      value={{
        //SenderNotify
      }}
    >
      {children}
    </ControllerNotifyContext.Provider>
  )
}