import { createContext, useEffect, useContext, useState } from 'react';
import { io } from 'socket.io-client';

import { AtuhenticationContext } from './AuthenticationContextAPI';

export const ControllerNotifyContext = createContext({});


export function ControllerNotifyContextProvider({children}){

  const { userData } = useContext(AtuhenticationContext);

  const [notifications, setNotifications] = useState([]);

  const socket = io("http://localhost:3333", {
    transports: ["websocket", "polling"]
  });

  useEffect(() => {
    socket.emit('Settings', { id: userData?._id})
  }, [userData]);


  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    // const notify = await fetch("/api/notifyApplication", {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ id: userData._id }),
    // });

    // setNotifications(notify);
    const resnotify = await fetch(`/api/notifyApplication`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Notificação Teste",
        description: "Essa notificação é um teste",
        users: "610960dfd75dcfe2800fce37",
        type: "Projeto",
        ready: false,
        date: Date.now()
      })
    });
    //console.log(resnotify);
    console.log(await resnotify.json())
  }

  function SenderNotify(_id, users){
    socket.emit("NotifyRecived", {
      _id,
      send: 'All'
    })
  }

  socket.on("NotifySend", async (_id) => {
    const notify = await fetch(`/api/notifyApplication/${_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    setNotifications({ ...notifications, notify });
  });

  useEffect(() => {
    console.log(notifications);

  }, [notifications])

  return(
    <ControllerNotifyContext.Provider
      value={{
        // SenderNotify
      }}
    >
      {children}
    </ControllerNotifyContext.Provider>
  )
}