import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { MDBInput,MDBBtn } from 'mdb-react-ui-kit';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);


  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log("done", user);
        navigate("/");
        dispatch({ type: "LOGIN", payload: user });
        const username = user.name;
      })
      .catch((error) => {

        console.log(error.code); // Kiírja a hibakódot
  console.log(error.message); 
  console.error('Firebase autentikációs hiba:', error);

  toast.error('Hibás email cím  vagy jelszó!', {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000
  });
      });

  }
  return (

    <div className='auth'>
      <h1>Bejelentkezés</h1>
      <form onSubmit={handleLogin}>
        <MDBInput required type='text' label='Email cím' name="username" onChange={e => setEmail(e.target.value)} />
        <MDBInput required type='password' label='Jelszó' name="password" onChange={e => setPassword(e.target.value)} />
        <MDBBtn type="submit" block>Bejelenktkezés</MDBBtn>
        <ToastContainer />
      </form>

    </div>
  )
}

export default Login