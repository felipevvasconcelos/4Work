export function Authentication(permission, userProfile){
  for(let type in permission){
    if(permission[type] === 'All' || userProfile === 'Administrador' || permission[type] === userProfile){
      return true;
    }
  }
  return false;
}