import React from 'react';
import { db } from '../../services/firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setDoc, doc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Datatable from '../datatable/Datatable';
import Szamlatukor from '../Szamlatukor/Szamlatukor';
import { useNavigate } from 'react-router-dom';



const Vevo_szallito = () => {
    const [data, setData] = useState({ ["tartozik"]: "311" });
    const [keltDate, setKeltDate] = useState(new Date());
    const [teljesitesDate, setTeljesitesDate] = useState(new Date());
    const [fizHatDate, setFizHatDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true); // Kezdetben legyen disabled
    const [afakonyveles, SetAfaKonyveles] = useState("466");
    const [activeButton, setActiveButton] = useState(1);

    const navigate = useNavigate();



    const handleButtonClick = (buttonNumber) => {
        setActiveButton(buttonNumber);
        /*    if (activeButton === 1 && document.getElementById('kovetel').value !== "454") {
                document.getElementById('kovetel').value = '454';
                document.getElementById('tartozik').value = '';
            }
            if (activeButton !== 1 && document.getElementById('tartozik').value !== ("311")) {
                document.getElementById('tartozik').value = '311';
                document.getElementById('kovetel').value = '';
            }*/


    }
    console.log("dataaaa", data);

    const handleInput = (e) => {
        const id = e.target.name;
        const value = e.target.value;
        setData({ ...data, [id]: value });

    };



    const handleChildData = (childData) => {
        console.log('Gyermekkomponens által visszaküldött adat:', childData);
         if (activeButton === 1) {
              setData({ ...data,["kovetel"]:childData.value });
          } else {
              setData({ ...data,["tartozik"]: childData.value });
          }


        // Itt lehet kezelni a visszaküldött adatot a szülőkomponensben

    };

    const brutto = isDisabled ? data.netto : (Number(data.netto) + Number(data.netto * data.afa_mertek));
    const afaOsszeg = isDisabled ? 0 : (data.netto * data.afa_mertek);

    const handleCheckboxChange = () => {
        setIsDisabled(!isDisabled); // Invertáljuk az isDisabled állapotát a checkbox változásakor
    };


    console.log("data, ", data);
    console.log("bruott", brutto);
    useEffect(() => {

        if (activeButton === 1) {

            SetAfaKonyveles("467");
            setData({
                ...data,
                tartozik: "311",
                method: "vevo"
            });
        } else {
            SetAfaKonyveles("466");
            setData({
                ...data,
                method: "szallito",
                kovetel: "454"
            });


        }
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "partners"));
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());

                });
                const fetchedOptions = querySnapshot.docs.map((doc) => ({
                    value: doc.id,
                    label: doc.data().partner_name, // Módosítsd az adatbázis mezőjére, amit meg szeretnél jeleníteni
                }));
                console.log("options", fetchedOptions);
                setSelectedOption(fetchedOptions);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [activeButton]);
    console.log("opt", selectedOption);


    const handleAddKonyveles = async (e) => {
        e.preventDefault();
        console.log("data", data);
        console.log("kelt.date", keltDate);

        try {
            await setDoc(doc(db, "accounting", data.bizonylatszam), {
                ...data,
                brutto: brutto,
                afa: afakonyveles,
                afa_osszeg: afaOsszeg,
                kelt_date: keltDate,
                teljesites_date: teljesitesDate,
                fiz_hat_date: fizHatDate,
                timeStamp: serverTimestamp()
            });
            window.location.reload(false);
            toast.success('Sikeres beküldés!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });
          
        } catch (err) {

            toast.error('Hibás beküldés!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });
            console.log(err);
            console.log(err.code); // Kiírja a hibakódot
            console.log(err.message);
        }


    }
    console.log("active, ", activeButton === 2 ? " " : "311");
    return (
        <div>
            <h1>{activeButton === 1 ? 'Vevő számla' : 'Szállítói számla'}</h1>
            <div className="vevo_szallito_holder">
                <button type="button"
                    class={activeButton === 1 ?
                        "btn btn-outline-primary" : "btn btn-outline-secondary"}
                    onClick={() => handleButtonClick(1)}>Vevői számla</button>
                <button type="button"
                    class={activeButton === 2 ? "btn btn-outline-primary" : "btn btn-outline-secondary"}
                    onClick={() => handleButtonClick(2)}
                >Szállítói számla</button>
                <form class="vevo_szallito" onSubmit={handleAddKonyveles}>
                    <div>
                        <label>Keltezés:</label>
                        <DatePicker dateFormat="yyyy.MM.dd" selected={keltDate} onChange={(date) => setKeltDate(date)} />
                        <label>Teljesítés:</label>
                        <DatePicker dateFormat="yyyy.MM.dd" selected={teljesitesDate} onChange={(date) => setTeljesitesDate(date)} />
                        <label>Fizetési határidő:</label>
                        <DatePicker dateFormat="yyyy.MM.dd" selected={fizHatDate} onChange={(date) => setFizHatDate(date)} />
                        <label>Fizetési mód:</label>
                        <select name="fizmod" onChange={handleInput}>
                            <option value="" selected disabled hidden>Kérjük válasszon</option>
                            <option>Átutlás</option>
                            <option>Készpénz</option>
                        </select>
                        <label>Partner:</label>
                        <select name="partner_name" onChange={handleInput}>
                            {selectedOption && selectedOption.map(item => {
                                return (<option key={item.value} value={item.label} onChange={handleInput}>{item.label}</option>);
                            })}
                        </select >
                    </div>
                    <div>
                        <label>Bizonylatszám: </label>
                        <input class="form-control" required type="text" name="bizonylatszam" onChange={handleInput} />
                        <label>Esemény neve: </label>
                        <input class="form-control" type="text" name="esemeny" onChange={handleInput} />

                        <label>Tartozik oldal:</label>
                        {activeButton === 1 ? <input
                            class="form-control"
                            id="tartozik"
                            name="tartozik"
                            type="text"
                            value={"311 - Belföldi követelések forintban"}
                            disabled
                        /> : <Szamlatukor sendDataToParent={handleChildData} />}

                        <label>Követel oldal:</label>
                        {activeButton === 2 ?
                            <input
                                class="form-control"
                                id="kovetel"
                                name="kovetel"
                                type="text"
                                value={"454 - Szállítók"}
                                disabled
                            /> : <Szamlatukor sendDataToParent={handleChildData} />}
                    </div>
                    <div>
                        <label>Áfás tétel: </label>
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={handleCheckboxChange}
                            checked={!isDisabled} />
                        <select name="afa_mertek" onChange={handleInput} disabled={isDisabled}>
                            <option>Válasz</option>
                            <option value="0.18">18%</option>
                            <option value="0.27">27%</option>
                            <option value="0.05">5%</option>
                        </select>
                        <label>Áfa: </label>
                        <input
                            class="form-control"
                            id="afa"
                            name="afa_input"
                            type="text"
                            value={afaOsszeg}
                            disabled
                            onChange={handleInput}
                        />
                        <label>Áfa könyvelés: </label>
                        <input
                            type="text"
                            name="afa_konyveles"
                            value={(afakonyveles) + (activeButton === 1 ? "K" : "T")}
                            disabled
                        />
                        <label>Nettó ár: </label>
                        <input
                            class="form-control"
                            id="netto"
                            name="netto"
                            type="text"
                            onChange={handleInput}
                        />

                        <label>Bruttó: </label>
                        <input
                            class="form-control"
                            id="brutto_input"
                            name="brutto_input"
                            type="text"
                            value={brutto}
                            disabled={isDisabled}
                            onChange={handleInput}
                        />
                        <MDBBtn type="submit" block>Beküldés</MDBBtn>
                    </div>
                </form>
                <ToastContainer />
            </div>

            <Datatable collectionName="accounting" />

        </div>
    )
}

export default Vevo_szallito