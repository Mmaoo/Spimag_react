export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    //console.log("getCurrentUser: "+token);
    if(token == null) return null;
    const login = localStorage.getItem('login');
    const name = localStorage.getItem('name');
    const surname = localStorage.getItem('surname');
    const user = {
        'login': login,
        'name': name,
        'surname': surname,
    };
    return user;
};

export const register = (user) =>
    fetch('http://localhost:3000/api/user',{
       method: 'POST',
       body: JSON.stringify(user),
       headers: { "content-type":'application/json' }
   }).then(res => res.json());

export const login = (user) =>
    fetch('http://localhost:3000/api/login',{
       method: 'POST',
       body: JSON.stringify(user),
       headers: { "content-type":'application/json' }
   }).then(res => res.json());

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('name');
    localStorage.removeItem('surname');
}

export const updateUser = (user) =>
    fetch('http://localhost:3000/api/user',{
       method: 'PUT',
       body: JSON.stringify(user),
       headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
   }).then(res => res.json());

export const addItem = (item) =>
    fetch('http://localhost:3000/api/item',{
       method: 'POST',
       body: JSON.stringify(item),
       headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
   }).then(res => res.json());

export const updateItem = (item) =>
   fetch('http://localhost:3000/api/item',{
      method: 'PUT',
      body: JSON.stringify(item),
      headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
  }).then(res => res.json());

export const getMyItems = () =>
   fetch('http://localhost:3000/api/item/my',{
      method: 'GET',
      headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
  }).then(res => res.json());

export const getMyItemsByArea = (areaId) =>
     fetch('http://localhost:3000/api/item/my/area/'+areaId,{
        method: 'GET',
        headers: { "content-type":'application/json',
                  'Authorization': localStorage.getItem('token')}
    }).then(res => res.json());

export const deleteItem = (item) =>
   fetch('http://localhost:3000/api/item',{
      method: 'DELETE',
      body: JSON.stringify(item),
      headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
  }).then(res => res.json());


export const addArea = (area) =>
    fetch('http://localhost:3000/api/area',{
       method: 'POST',
       body: JSON.stringify(area),
       headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
   }).then(res => res.json());

export const updateArea = (area) =>
    fetch('http://localhost:3000/api/area',{
      method: 'PUT',
      body: JSON.stringify(area),
      headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
  }).then(res => res.json());

export const getMyAreas = () =>
   fetch('http://localhost:3000/api/area/my',{
      method: 'GET',
      headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
  }).then(res => res.json());

export const deleteArea = (area) =>
   fetch('http://localhost:3000/api/area',{
      method: 'DELETE',
      body: JSON.stringify(area),
      headers: { "content-type":'application/json',
                'Authorization': localStorage.getItem('token')}
  }).then(res => res.json());
