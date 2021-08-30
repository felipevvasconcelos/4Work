import { createContext } from 'react';
import { io } from 'socket.io-client';

export const ControllerNotifyContext = createContext({});


export function ControllerNotifyContextProvider({children}){

  const socket = io("http://localhost:3333", {
    transports: ["websocket", "polling"]
  });

  function SenderNotify(_id){
    socket.emit("NotifySender", _id)
  }

  socket.on("NotifyEmited", (_id) => {
    alert("Notificação Recebia com sucesso!");
  })

  return(
    <ControllerNotifyContext.Provider
      value={{
        SenderNotify
      }}
    >
      {children}
    </ControllerNotifyContext.Provider>
  )
}