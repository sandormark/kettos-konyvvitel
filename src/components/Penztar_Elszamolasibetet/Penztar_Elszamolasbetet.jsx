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




const Peztar_Elszamolasibetet = () => {
    const [data, setData] = useState({ ["tartozik"]: "311" });
    const [keltDate, setKeltDate] = useState(new Date());
    const [teljesitesDate, setTeljesitesDate] = useState(new Date());
    const [fizHatDate, setFizHatDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState(null);
    const [isDisabled, setIsDisabled] = useState(true); // Kezdetben legyen disabled
    const [afakonyveles, SetAfaKonyveles] = useState("466");
    const [activeButton, setActiveButton] = useState(1);
    const [beveteKiadasButton, setBevetelKiadasButton] = useState(1);



    const handleButtonClick = (buttonNumber) => {
        setActiveButton(buttonNumber);
    }

    const handleBevetelKiadasButtonClick = (buttonNumber) => {
        setBevetelKiadasButton(buttonNumber);
    }
    console.log("dataaaa", data);

    const handleInput = (e) => {
        const id = e.target.name;
        const value = e.target.value;
        setData({ ...data, [id]: value });

    };

    const handleChildData = (childData) => {
        if (activeButton === 1) {
            setData({ ...data, ["kovetel"]: childData.value });
        } else {
            setData({ ...data, ["tartozik"]: childData.value });
        }


        // Itt lehet kezelni a visszaküldött adatot a szülőkomponensben

    };

    const brutto = isDisabled ? data.netto : (Number(data.netto) + Number(data.netto * data.afa_mertek));
    const afaOsszeg = isDisabled ? 0 : (data.netto * data.afa_mertek);

    const handleCheckboxChange = () => {
        setIsDisabled(!isDisabled); // Invertáljuk az isDisabled állapotát a checkbox változásakor
    };

    useEffect(() => {
        console.log("activebutton",activeButton);
        console.log("bevetel kiadas",beveteKiadasButton);
        
        if (activeButton === 1) {
            if (beveteKiadasButton === 1) {
                SetAfaKonyveles("467");
                setData({
                    ...data,
                    tartozik: "3811",
                    method: "penztar"
                });
            } else {
                SetAfaKonyveles("466");
                setData({
                    ...data,
                    kovetel: "3811",
                    method: "penztar"
                })
            }

        } else if (activeButton === 2) {
            if (beveteKiadasButton === 1) {
                SetAfaKonyveles("467");
                setData({
                    ...data,
                    tartozik: "384",
                    method: "elszamolasibetet"
                });
            } else {
                SetAfaKonyveles("466");
                setData({
                    ...data,
                    kovetel: "384",
                    method: "elszamolasibetet"
                });
            }




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
    }, [activeButton,beveteKiadasButton]);


    const handleAddKonyveles = async (e) => {
        e.preventDefault();

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
            });  window.location.reload(false);
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
        <div>
            <h1>{activeButton === 1 ? 'Pénztári bizonylat' : 'Banki bizonylat'}</h1>
            <div className="penztar_bank_holder">
                <div className='penztar_bank_valto'>
                <button type="button"
                    class={activeButton === 1 ? "btn btn-outline-primary" : "btn btn-outline-secondary"}
                    onClick={() => handleButtonClick(1)}>Pénztár bizonylat</button>
                <button type="button"
                    class={activeButton === 2 ? "btn btn-outline-primary" : "btn btn-outline-secondary"}
                    onClick={() => handleButtonClick(2)}>Banki bizonylat</button>
                     </div>
                <div class="bevetel_kiadas_button_holder">
                    <button type="button"
                        class={beveteKiadasButton === 1 ? "btn btn-outline-primary" : "btn btn-outline-secondary"}
                        onClick={() => handleBevetelKiadasButtonClick(1)}>Bevétel</button>
                    <button type="button"
                        class={beveteKiadasButton === 2 ? "btn btn-outline-primary" : "btn btn-outline-secondary"}
                        onClick={() => handleBevetelKiadasButtonClick(2)}>Kiadás</button>
                </div>
                    <h1>{beveteKiadasButton === 1 ? 'Bevétel' : 'Kiadás'}</h1>
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
                            <option></option>
                        </select>
                        <label>Partner:</label>
                        <select name="partner_name" defaultValue="Tölt" onChange={handleInput}>
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
                        {beveteKiadasButton === 1 ? <input
                            class="form-control"
                            id="tartozik"
                            name="tartozik"
                            type="text"
                            value={activeButton === 1 ? "3811 - Pénztárszámla" : "384 - Elszámolási betétszámla"}
                            disabled
                        /> : <Szamlatukor sendDataToParent={handleChildData} />}

                        <label>Követel oldal:</label>
                        {beveteKiadasButton === 2 ?
                            <input
                                class="form-control"
                                id="kovetel"
                                name="kovetel"
                                type="text"
                                value={activeButton === 1 ? "3811 - Pénztárszámla" : "384 - Elszámolási betétszámla"}
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

export default Peztar_Elszamolasibetet