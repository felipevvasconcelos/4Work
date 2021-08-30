import { createContext, useState, useEffect } from 'react';

export const PermissionViewContext = createContext({});

export function PermissionViewContextProvider({children}){

  const [permissionsView, setPermissionsView] = useState([]);

  useEffect(() =>{
    console.log(permissionsView);
  },[permissionsView])

  function filterPermissionByScreen(view){
    var Permissions = [];
    const ObjectsView = permissionsView.filter((screen) => screen.view._id == view);
    ObjectsView.map((Objects) => {
      Permissions.push(Objects.profile.name)
    })

    return Permissions;
  }
  
  return(
    <PermissionViewContext.Provider
      value={{
        permissionsView,
        setPermissionsView,
        filterPermissionByScreen
      }}
    >
      {children}
    </PermissionViewContext.Provider>
  )
}

