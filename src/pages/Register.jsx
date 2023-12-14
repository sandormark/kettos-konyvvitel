import axios from 'axios';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { addDoc, collection, collectionGroup, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Register = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({});


    const handleInput = (e) => {
        const id = e.target.name;
        const value = e.target.value;
        setData({ ...data, [id]: value });
    };
    console.log(data);


    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await setDoc(doc(db, "users", res.user.uid), {
                ...data,
                timeStamp: serverTimestamp()
            });
            toast.success('Sikeres hozzáadás!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
              });
              navigate("/users");
        } catch (err) {

            toast.error('Létező felhasználó!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
              });
            console.log(err);
            console.log(err.code); // Kiírja a hibakódot
            console.log(err.message); 
        }
    }



    return (
        <div className='auth'>
            <h1>Felhasználó regisztrálása</h1>
            <form onSubmit={handleAdd}>
                <MDBInput  required label="Teljes név" name="name" onChange={handleInput} />
                <MDBInput required type='email' label='Email' name="email" onChange={handleInput} />
                <MDBInput  required type='password' label='Jelszó' name="password" onChange={handleInput} />
                <MDBInput  required type='phone' label='Telefonszám' name="phone" onChange={handleInput} />
                <MDBBtn type="submit" block>Felhasználó regisztrálása</MDBBtn>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Register