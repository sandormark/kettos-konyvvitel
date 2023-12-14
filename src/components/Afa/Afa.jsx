import React, { useState } from 'react';
import { query, orderBy, limit, doc, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Datatable from '../datatable/Datatable';

const Afa = () => {

  const [elozetesAfa, setElozetesAfa] = new useState([]);
  const [fizetendoAfa, setFizetendoAfa] = new useState([]);

  const documentsRef = collection(db, 'accounting'); // Az adott gyűjtemény nevének megadása


  const fetchData = async () => {
    let elozetesAfaOsszeg = 0;
    let fizetendoAfaOsszeg = 0;
    try {
      const querySnapshot = await getDocs(documentsRef);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
        if (doc.data().afa === "466") {
          elozetesAfaOsszeg += doc.data().afa_osszeg;
        } else {
          fizetendoAfaOsszeg += doc.data().afa_osszeg;
        }
        // Itt dolgozhatsz a lekért dokumentumokkal
      });
      setElozetesAfa(elozetesAfaOsszeg);
      setFizetendoAfa(fizetendoAfaOsszeg);
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };
  fetchData();



  console.log("fizetendő áfa", fizetendoAfa);

  console.log("előzetes áfa", elozetesAfa);

  return (
    <div> <h1>Áfa analitika</h1>
    <div className='afa'>
      <div className='afa_reszletek'>Áfa
        <p>A vállalkozás Fizetendő áfa mérlegértéke: {fizetendoAfa} </p>
        <p>A vállalkozás Előzetesen felszámított áfa mérlegértéke: {elozetesAfa} </p>
        <h3>Az egyenlegük:{elozetesAfa - fizetendoAfa}</h3>
        <h2>{elozetesAfa - fizetendoAfa < 0 ? ((elozetesAfa - fizetendoAfa) * (-1) + " Ft fizetendő adónk van") : elozetesAfa - fizetendoAfa + " Ft áfa igényelhető vissza"}</h2>
      </div>
      <Datatable collectionName="afa_konyveles" />
    </div></div>
  )
}

export default Afa