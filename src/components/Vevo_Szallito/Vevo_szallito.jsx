import React from 'react';
import { db } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Input, Select } from '@mui/material';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setDoc, doc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';




const Vevo_szallito = () => {
    const [options, setOptions] = useState([]);
    const [bruttoOsszeg, SetBruttoOsszeg] = useState([]);
    const [data, setData] = useState({});
    const [keltDate, setKeltDate] = useState(new Date());
    const [teljesitesDate, setTeljesitesDate] = useState(new Date());
    const [fizHatDate, setFizHatDate] = useState(new Date());
    const [values, setValues] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true); // Kezdetben legyen disabled



   

        const [isLoading, setLoading] = useState(true);
    const [exchangeRate, setExchangeRate] = useState();

    const baseurl = "http://api.napiarfolyam.hu/?valuta=eur";

    useEffect(() => {
        axios.get(baseurl)
            .then((response) => {
                setExchangeRate(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Hiba történt:', error);
                setLoading(false);
            });
    }, []);

    console.log("exc",exchangeRate);

    const handleInput = (e) => {
        const id = e.target.name;
        const value = e.target.value;
        setData({ ...data, [id]: value });
        setData(prevData => ({ ...prevData, ["tartozik"]: "311" }));

    };





    const brutto = isDisabled ? data.netto : (Number(data.netto) + Number(data.netto * data.afa));
    const afa = isDisabled ? 0 : (data.netto * data.afa);

    const handleCheckboxChange = () => {
        setIsDisabled(!isDisabled); // Invertáljuk az isDisabled állapotát a checkbox változásakor
    };


    console.log("data, ", data);
    console.log("bruott", brutto);
    useEffect(() => {
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
    }, []);
    console.log("opt", selectedOption);
    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            setSelectedOption(''); // Állítsd be az értéket, ne a teljes objektumot
            console.log(`Selected:`, selectedOption);
        } else {
            setSelectedOption("");
        }
    };

    const handleAddKonyveles = async (e) => {
        e.preventDefault();
        console.log("data", data);
        console.log("kelt.date", keltDate);
        try {
            await setDoc(doc(db, "accounting", data.bizonylatszam), {
                ...data,
                brutto: brutto,
                afa: afa,
                afaK:"467",
                keltDate: keltDate,
                teljesitesDate: teljesitesDate,
                fizHatDate: fizHatDate,
                timeStamp: serverTimestamp()
            });
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

    return (
        <div><h1>Vevő számla</h1>
            <form class="vevo_szallito" onSubmit={handleAddKonyveles}>
                <div>
                    <label>Keltezés:</label>
                    <DatePicker   name="keltdate" dateFormat="yyyy/MM/dd" selected={keltDate} onChange={(date) => setKeltDate(date)} />
                    <label>Teljesítés:</label>
                    <DatePicker  dateFormat="yyyy/MM/dd" selected={teljesitesDate} onChange={(date) => setTeljesitesDate(date)} />
                    <label>Fizetési határidő:</label>
                    <DatePicker    dateFormat="yyyy/MM/dd" selected={fizHatDate} onChange={(date) => setFizHatDate(date)} />
                    <label>Fizetési mód:</label>
                    <select    name="fizmod" onChange={handleInput}>
                        <option>Átutlás</option>
                        <option>Készpénz</option>
                        <option></option>
                    </select>
                    <label>Partner:</label>
                    <select name="partner_id" defaultValue="Tölt" onChange={handleInput}>
                        {selectedOption && selectedOption.map(item => {
                            return (<option key={item.value} value={item.label} onChange={handleInput}>{item.label}</option>);
                        })}
                    </select >
                </div>
                <div>
                    <label>Bizonylatszám: </label>
                    <input     class="form-control" required type="text" name="bizonylatszam" onChange={handleInput} />
                    <label>Esemény neve: </label>
                    <input     class="form-control" type="text" name="esemeny" onChange={handleInput}/>
            
                    <label>Tartozik oldal:</label>
                    <input
                        class="form-control"
                        id="tartozik"
                        name="tartozik"
                        type="text"
                        value="311"
                        disabled
                    />
                    <label>Követel oldal:</label>
                    <input
                        class="form-control"
                        id="kovetel"
                        name="kovetel"
                        type="text"
                        onChange={handleInput}
                    />


                </div>
                <div>
                    <label>Áfás tétel: </label>
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={handleCheckboxChange}
                        checked={!isDisabled} />
                    <select name="afa" onChange={handleInput} disabled={isDisabled}>
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
                        value={afa}
                        disabled
                        onChange={handleInput}
                    />
                    <label>Áfa könyvelés: </label>
                    <input
                        type="text"
                        value="467K"
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

        </div>

    )
}

export default Vevo_szallito