import React from 'react'
import { useState, useEffect } from 'react';
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import Datatable from '../components/datatable/Datatable';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoc, updateDoc } from 'firebase/firestore';
import { MDBInput,MDBBtn } from 'mdb-react-ui-kit';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Partners = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({});

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
            const PartnRef = doc(db, "partners", documentId);
            try {
                await updateDoc(PartnRef, {
                    id: data.id ? data.id : userData.id,
                    partner_name: data.partner_name ? data.partner_name : userData.partner_name,
                    tax_number: data.tax_number ? data.tax_number : userData.tax_number,
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
            console.log("Userdata", userData);
        } else {
            try {
                await setDoc(doc(db, "partners", data.id), {
                    ...data,
                    timeStamp: serverTimestamp()
                });
                toast.success('Sikeres hozzáadás!', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000
                  });
                window.location.reload(false);

            } catch (err) {
                console.log(err);
                toast.error('Ez a partner már létezik!', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000
                  });



            }
        }
        console.log("Userdata", userData);
    }
    const [userData, setUserData] = useState({
        id: '',
        partner_name: '',
        tax_number: '',
        phone: '',
        // További adatmezők itt...
    });

    useEffect(() => {
        console.log("userdata", userData);
        if (documentId !== undefined && documentId!==userData.id) {
            // Adatok lekérése az adatbázisból
            const fetchDataById = async (documentId) => {
                try {
                    const docRef = doc(db, 'partners', documentId); // Firebase Firestore 'partners' gyűjteményének megadása
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        // Adatok megtalálva a megadott ID-vel
                        console.log('Document data:', docSnap.data());
                        setUserData(docSnap.data()); // Az adatok beállítása a state-be
                    } else {
                        // Dokumentum nem létezik
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error getting document:', error);
                }
            };
            fetchDataById(documentId); // Adatok lekérése, amikor a komponens felmountolódik, vagy amikor az ID megváltozik
        }else if(documentId===undefined && userData.id!==''){

              setData({
                id: '',
                partner_name: '',
                tax_number: '',
                phone: '',
              });
        }

    }, [documentId,userData]);




    console.log("Userdata", userData);

    return (
        <div className='formHolder'>

            <form onSubmit={handleAdd}>
                <h1>Partner Hozzáadás</h1>
                <MDBInput name="id" label={userData.id || 'Partner id'}   onChange={handleInput} />
                <MDBInput  name="partner_name" label={userData.partner_name || 'Partner Neve'} onChange={handleInput} />
                <MDBInput name="tax_number" label={userData.tax_number || 'Partner Adószám'} onChange={handleInput} />
                <MDBInput type="phone"  name="phone" label={userData.phone || 'Partner telefonszáma'} onChange={handleInput} />
                {documentId ? (
                     <MDBBtn type="submit" block>Partner frissítés</MDBBtn>
                ) : (
                    <MDBBtn type="submit" block>Partner Hozzáadás</MDBBtn>
                )}
            </form>
            <Datatable collectionName="partners" />
            <ToastContainer />
        </div>
    )
}

export default Partners