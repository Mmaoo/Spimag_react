import './css/style.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Menu from './Menu'
import MainPage from './MainPage.jsx';
import UserDataPage from './UserDataPage.jsx';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import ItemListPage from './ItemListPage';
import ItemAddPage from './ItemAddPage';
import { logout as api_logout, getCurrentUser4 } from './api.js';

function App() {

//    const storedJwt = localStorage.getItem('token');
//    const [jwt, setJwt] = useState(storedJwt || null);
//
//    const getJwt = async () => {
//        const { data } = await axios.get(`${apiUrl}/jwt`);
//        localStorage.setItem('token', data.token);
//        setJwt(data.token);
//      };

//const navigate = useNavigate();

//    function logout(){
//        api_logout();
//        navigate.push('/abc');
//    }

var aa = 0;

function a(){
    console.log(++aa);
}

  return (
  <Router>
    <div className="App">
      <div id="wrapper">
          <div id="logo">
            Spimag
          </div>
          <Menu />
          <div id="content">
          <Routes>
            <Route exact path="/" element={<MainPage/>} />
            <Route path="/user/data" element={<UserDataPage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/item/list" element={<ItemListPage/>} />
            <Route path="/item/Add" element={<ItemAddPage/>} />
          </Routes>
          </div>
      </div>
      <div id="footer">
          <p>&copy; Marcin Choina</p>
      </div>
    </div>
    </Router>
  );
}

export default App;
