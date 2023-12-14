import Datatable from "../components/datatable/Datatable"
import "./users.scss"
import React from 'react'
import { useState, useEffect } from 'react';
import { db } from "../services/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from 'react-router-dom';
import { getDoc, updateDoc } from 'firebase/firestore';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Users = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [docidhelp, setDocIdHelp] = useState({});

  const handleInput = (e) => {
    const id = e.target.name;
    const value = e.target.value;
    console.log("id ", id);
    console.log("value", value);
    setData(prevData => {
      return { ...prevData, [id]: value };
    });
  };
  console.log(data);
  const { id: documentId } = useParams();
  console.log("doci", documentId);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (documentId) {
      const UserRef = doc(db, "users", documentId);
      try {
        await updateDoc(UserRef, {
          name: data.name ? data.name : userData.name,
          phone: data.phone ? data.phone : userData.phone,
          email: data.email ? data.email : userData.email,
          password: data.password ? data.password : userData.password,
          phone: data.phone ? data.phone : userData.phone,
        });
        toast.success('Sikeres frissítés!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });
        window.location.reload(false);
      } catch (err) {
        console.log("error", err);
        toast.error('Ez a partner már létezik!', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000
        });

      }
    }
    console.log("Userdata", userData);
  }


  const [userData, setUserData] = useState({
    email: '',
    name: '',
    password: '',
    phone: '',
    // További adatmezők itt...
  });



  const username = data.name;
  console.log("username", data);
  useEffect(() => {
    setDocIdHelp(documentId);
    if (documentId !== undefined && documentId!==userData.id) {
      // Adatok lekérése az adatbázisból
      const fetchDataById = async (documentId) => {
        try {
          const docRef = doc(db, 'users', documentId); // Firebase Firestore 'users' gyűjteményének megadása
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Adatok megtalálva a megadott ID-vel
            console.log('Document data:', docSnap.data());
            setUserData(docSnap.data()); // Az adatok beállítása a state-be
            setUserData(prevData => ({ ...prevData, ["id"]: documentId }));
          } else {
            // Dokumentum nem létezik
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error getting document:', error);
        }
      };
      fetchDataById(documentId); // Adatok lekérése, amikor a komponens felmountolódik, vagy amikor az ID megváltozik
    } else if (documentId === undefined && userData.name !== '') {

      setData({
        email: '',
        name: '',
        password: '',
        phone: '',
      });
      setUserData({
        email: '',
        name: '',
        password: '',
        phone: '',
      });
    }

  }, [documentId, userData]);




  console.log("Userdata", userData);

  return (
    <div>
      <div className="formHolder">
          <Datatable  collectionName="users" />
        {documentId ? (<form onSubmit={handleAdd}>
          <h1>Felhasználó Szerkesztése</h1>
          <MDBInput label={userData.name || 'Teljes név'} name="name" onChange={handleInput} />
          <MDBInput type='email' label={userData.email || 'Partner email'} name="email" onChange={handleInput} />
          <MDBInput type='password' label={userData.password || 'Partner jelszó'} name="password" onChange={handleInput} />
          <MDBInput type='phone' label={userData.phone || 'Partner telefonszám'} name="phone" onChange={handleInput} />
          <MDBBtn type="submit" block>Felhasználó frissítése</MDBBtn>
        </form>) : ("")}
        <ToastContainer /></div>


    </div>
  )
}

export default Users