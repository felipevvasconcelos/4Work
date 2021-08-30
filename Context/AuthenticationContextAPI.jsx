import { createContext, useState } from 'react';

export const AtuhenticationContext = createContext({});

export function AtuhenticationContextProvider({children}){

  const [userData, setUserData] = useState({});
  const [permission, setPermission] = useState("");

  function handleSetPermission(value){
    setPermission(value);
  }

  function handleSetUserData(object){
    setUserData(object);
  }

  return(
    <AtuhenticationContext.Provider
    value={{
      handleSetPermission,
      handleSetUserData,
      permission,
      userData
    }}
    >
      {children}
    </AtuhenticationContext.Provider>
  )
}