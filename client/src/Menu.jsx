import { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from './api.js'

function Menu() {
    let navigate = useNavigate();

    function onLogoutClick(){
        logout();
        //window.location.href = "/login";
        navigate("/login");
    }

    return (
        <div id="menu">
          <ul>
          <li><Link to="/" className="active">Strona główna</Link></li>
          {getCurrentUser() == null && <li><Link to="/login">Logowanie</Link></li>}
          {getCurrentUser() == null && <li><Link to="/register">Rejestracja</Link></li>}

          {getCurrentUser() != null && <li><Link to="/item/list">Przetwory</Link></li>}
          {getCurrentUser() != null && <li><Link to="/user/data">Moje dane</Link></li>}
          {getCurrentUser() != null && <li><button onClick={onLogoutClick}>Wyloguj</button></li>}
          </ul>
        </div>
    )
	
}
export default Menu;