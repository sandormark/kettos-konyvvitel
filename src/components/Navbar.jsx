import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Logo from "../img/logo.png"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import Konyveles from '../pages/Konyveles';


const Navbar = () => {
  const jsonData = localStorage.getItem('user');
/*
  // JSON string visszaalakítása JavaScript objektummá
  const userData =  JSON.parse(jsonData);
  console.log("userdata",userData);
  // Az 'username' kiolvasása a JavaScript objektumból
  const email = userData.email;
  

  console.log(email); */
  // Vagy használhatod az 'username' változót más módokon is
  const navigate = useNavigate();
  const [storedData, setStoredData] = useState('');
  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem('user'); // Itt cseréld ki a 'key_name'-et a saját kulcsodra

    if (dataFromLocalStorage) {
      setStoredData(dataFromLocalStorage);
    }
  }, []); // Az üres tömb miatt ez csak egyszer fut le a komponens inicializálásakor

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate("/login");

    // Az adatok kiolvasása a localStorage-ból

  }
  return (

    <div className='navbar'>Navbar
      <div className='container'><div className='logo'>
        <img src={Logo} alt="" />
      </div>
        <div className='links'>
          <Link className="link" to="/Konyveles">
            <h6>Könyvelés</h6>
          </Link>
          <Link className="link" to="/users">
            <h6>Felhasznalok</h6>
          </Link>
          <Link className="link" to="/osszegzes">
            <h6>Összegzés</h6>
          </Link>
          <Link className="link" to="/partners">
            <h6>Partner</h6>
          </Link>
          <Link className="link" to="/afa_analitika">
            <h6>Áfa analitika</h6>
          </Link>
          <Link className="link" to="/konyveles3">
            <h6>Könyvelés3</h6>
          </Link>
          <span>{}</span>
          <span><button onClick={handleLogout}>Logout</button></span>

        </div></div></div>
  )
}

export default Navbar