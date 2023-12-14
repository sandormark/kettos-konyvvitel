import React from 'react'
import Vevo_szallito from '../components/Vevo_Szallito/Vevo_szallito';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MDBBtn } from 'mdb-react-ui-kit';
import { db } from '../services/firebase';
import { getDoc, doc, getDocs, collection, updateDoc } from 'firebase/firestore';
import DatePicker from "react-datepicker";
import Szamlatukor from '../components/Szamlatukor/Szamlatukor';
import { toast, ToastContainer } from 'react-toastify';
import Penztar_Elszamolasibetet from '../components/Penztar_Elszamolasibetet/Penztar_Elszamolasbetet';
const Accounting = () => {

    const navigate = useNavigate();

    const [selectedComponent, setSelectedComponent] = useState(<Vevo_szallito />);
    const [activeButton, setActiveButton] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true); // Kezdetben legyen disabled

    const [keltDate, setKeltDate] = useState(new Date());
    const [teljesitesDate, setTeljesitesDate] = useState(new Date());
    const [fizHatDate, setFizHatDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState(null);
    const [accountingData, setAccountingData] = useState({});
    const [childData, setChildData] = useState({});

    const [data, setData] = useState({});


    const { id: documentId } = useParams();
    console.log("doci", documentId);

    const brutto = isDisabled ? data.netto : (Number(data.netto) + Number(data.netto * (data.afa_mertek ? data.afa_mertek : accountingData.afa_mertek)));
    const afaOsszeg = isDisabled ? 0 : (data.netto * (data.afa_mertek ? data.afa_mertek : accountingData.afa_mertek));


    const handleChildData = (childData) => {
        console.log('Gyermekkomponens által visszaküldött adat:', childData);
        if (accountingData.method === "vevo") {
            setData({
                ...data, kovetel: childData.value,
                tartozik: "454"
            });
        } else if (accountingData.method === "szallito") {
            setData({
                ...data, kovetel: "311",
                tartozik: childData.value
            });
        } else if (accountingData.method === "penztar") {
            if (accountingData.tartozik === "3811") {
                setData({
                    ...data, tartozik: "3811",
                    kovetel: childData.value
                })
            } else if (accountingData.kovetel === "3811") {
                setData({
                    ...data, kovetel: "3811",
                    tartozik: childData.value
                })
            }
        } else if (accountingData.method === "elszamolasibetet") {
            if (accountingData.tartozik === "384") {
                setData({
                    ...data, tartozik: "384",
                    kovetel: childData.value
                })
            } else if (accountingData.kovetel === "384") {
                setData({
                    ...data, kovetel: "384",
                    tartozik: childData.value
                })
            }
        }


        // Itt lehet kezelni a visszaküldött adatot a szülőkomponensben

    };


    const handleCheckboxChange = () => {
        setIsDisabled(!isDisabled); // Invertáljuk az isDisabled állapotát a checkbox változásakor
    };


    useEffect(() => {
        if (documentId !== undefined) {
            setEditMode(true);
        }

        const fetchDataById = async (documentId) => {
            try {
                const docRef = doc(db, 'accounting', documentId);
                const docSnap = await getDoc(docRef);
                const newData = { id: documentId };
                if (docSnap.exists()) {
                    const newData = { id: docSnap.id };
                    const docData = docSnap.data();

                    Object.keys(docData).forEach((key) => {
                        if (docData[key] && typeof docData[key] === 'object' && docData[key].hasOwnProperty('seconds')) {
                            const timestamp = docData[key];
                            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                            const formattedDate = date.toLocaleDateString('hu-HU', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            }).replace(/\s/g, '');
                            newData[key] = formattedDate;
                        } else {
                            newData[key] = docData[key];
                        }
                    });

                    setAccountingData(newData); // Adat beállítása az állapotba (jelen esetben egyetlen adat egy tömbben)

                } else {
                    // Dokumentum nem létezik
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error getting document:', error);
            }
        };


        const partnerFetch = async () => {
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
                console.log("Partner: ", fetchedOptions);
                setSelectedOption(fetchedOptions);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        partnerFetch();
        fetchDataById(documentId);
        setKeltDate(accountingData.keltDate);
    }, [documentId]);


    console.log("Adat:", accountingData);
    console.log("kelt data: ", accountingData.keltDate);

    const handleFormCancel = () => {
        const resetData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, ''])
        );

        const resetAccountingData = Object.fromEntries(
            Object.entries(accountingData).map(([key, value]) => [key, ''])
        );
        setData(resetData);
        setAccountingData(resetAccountingData);
        setEditMode(false);
        setIsDisabled(true);
    }



    const handleInput = (e) => {
        const id = e.target.name;
        const value = e.target.value;
        console.log("id ", id);
        console.log("value", value);
        setData({ ...data, [id]: value })
    };

    console.log("szerk data", data);
    const handleButtonClick = (componentName, buttonNumber) => {
        setActiveButton(buttonNumber);
        switch (componentName) {
            case 'Vevo_szallito':
                setSelectedComponent(<Vevo_szallito />);
                break;
            case 'Penztar_elszamolasibetet':
                setSelectedComponent(<Penztar_Elszamolasibetet />);
                break;
            default:
                setSelectedComponent(null);
                break;
        }
    };
    const handleFormSave = async (e) => {
        e.preventDefault();
        const AccountingRef = doc(db, "accounting", documentId);
        try {
            await updateDoc(AccountingRef, {
                bizonylatszam: data.bizonylatszam ? data.bizonylatszam : accountingData.bizonylatszam,
                partner_name: data.partner_name ? data.partner_name : accountingData.partner_name,
                esemeny: data.esemeny ? data.esemeny : accountingData.esemeny,
                netto: data.netto ? data.netto : accountingData.netto,
                brutto: data.brutto ? data.brutto : accountingData.brutto,
                afa: data.afa ? data.afa : accountingData.afa,
                afa_mertek: data.afa_mertek ? data.afa_mertek : accountingData.afa_mertek,
                afa_osszeg: afaOsszeg ? afaOsszeg : accountingData.afa_osszeg,
                fizmod: data.fizmod ? data.fizmod : accountingData.fizmod,
                kelt_date: keltDate ? keltDate : accountingData.kelt_date,
                fiz_hat_date: fizHatDate ? fizHatDate : accountingData.fiz_hat_date,
                teljesites_date: teljesitesDate ? teljesitesDate : accountingData.teljesites_date,
                method: data.method ? data.method : accountingData.method,
                tartozik: data.tartozik ? data.tartozik : accountingData.tartozik,
                kovetel: data.kovetel ? data.kovetel : accountingData.kovetel

            });
            setEditMode(false);
            navigate('/accounting');
            window.location.reload(false);
            toast.success('Sikeres frissítés!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });

            //window.location.reload(false);

        } catch (err) {
            console.log("error", err);
            toast.error('Ez a partner már létezik!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });

        }

    }


    console.log("selected", selectedComponent);
    return (
        <div>
            <h1> Könyvelés </h1>
            <div className='konyveles_valto'>
                <button type="button"
                    class={activeButton === 1 ? "btn btn-primary btn-rounded" : "btn btn-secondary btn-rounded"}
                    onClick={() => handleButtonClick('Vevo_szallito', 1)}>Vevő/Szállító számla</button>
                <button type="button"
                    class={activeButton === 1 ? "btn btn-secondary btn-rounded" : "btn btn-primary btn-rounded"}
                    onClick={() => handleButtonClick('Penztar_elszamolasibetet', 2)}>Pénztár/Bankbetét bizonylat</button>
            </div>
            <div>
                {selectedComponent}
            </div>
            {editMode ?
                <div class="overlay" id="overlay" >
                    <div className='vevo_szallito_edit_container_pop_up'>
                        <div className='vevo_szallito_edit'>

                            <div>
                                <form class="vevo_szallito" >
                                    <div>
                                        <label>Keltezés:</label>
                                        <DatePicker dateFormat="yyyy.MM.dd" value={accountingData.kelt_date} onChange={(date) => setKeltDate(date)} />
                                        <label>Teljesítés:</label>
                                        <DatePicker dateFormat="yyyy.MM.dd" value={accountingData.teljesites_date} onChange={(date) => setTeljesitesDate(date)} />
                                        <label>Fizetési határidő:</label>
                                        <DatePicker dateFormat="yyyy.MM.dd" value={accountingData.fiz_hat_date} onChange={(date) => setFizHatDate(date)} />
                                        <label>Fizetési mód:</label>
                                        <select name="fizmod" defaultValue={accountingData.fizmod ? accountingData.fizmod : "Kérjük válasszon"} onChange={handleInput}>
                                            <option selected disabled hidden>Kérjük válasszon</option>
                                            <option>Átutlás</option>
                                            <option>Készpénz</option>
                                        </select>

                                        <label>Partner:</label>
                                        <select name="partner_name" defaultValue={accountingData.partner_name} onChange={handleInput}>
                                            {selectedOption && selectedOption.map(item => {
                                                return (<option key={item.value} value={item.partner_name} onChange={handleInput}>{item.label}</option>);
                                            })}
                                        </select >
                                    </div>

                                    <div>
                                        <label>Bizonylatszám: </label>
                                        <input class="form-control" type="text" name="bizonylatszam" defaultValue={accountingData.bizonylatszam} onChange={handleInput} disabled/>
                                        <label>Esemény neve: </label>
                                        <input class="form-control" type="text" name="esemeny" defaultValue={accountingData.esemeny} onChange={handleInput} />

                                        <label>Tartozik oldal:</label>
                                        {accountingData.method === "vevo" ? <input
                                            class="form-control"
                                            id="tartozik"
                                            name="tartozik"
                                            type="text"
                                            value={"311 - Belföldi követelések forintban"}
                                            disabled
                                        /> : <Szamlatukor sendDataToParent={handleChildData} dataFromParent={accountingData.tartozik} />}

                                        <label>Követel oldal:</label>
                                        {accountingData.method === "szallito" ?
                                            <input
                                                class="form-control"
                                                id="kovetel"
                                                name="kovetel"
                                                type="text"
                                                value={"454 - Szállítók"}
                                                disabled
                                            /> : <Szamlatukor sendDataToParent={handleChildData} dataFromParent={accountingData.kovetel} />}
                                    </div>

                                    <div>
                                        <label>Áfás tétel: </label>
                                        <input class="form-check-input" type="checkbox" id="flexCheckDefault" onChange={handleCheckboxChange}
                                            checked={!isDisabled}
                                        />
                                        <select name="afa_mertek" onChange={handleInput} defaultValue={accountingData.afa_mertek} disabled={isDisabled}>
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
                                            defaultValue={afaOsszeg ? afaOsszeg : accountingData.afa_osszeg}
                                            disabled
                                            onChange={handleInput}
                                        />
                                        <label>Áfa könyvelés: </label>
                                        <input
                                            type="text"
                                            name="afa_konyveles"
                                            value={(accountingData.method === "vevo" ? "467K" : "466T")}
                                            disabled
                                        />
                                        <label>Nettó ár: </label>
                                        <input
                                            class="form-control"
                                            id="netto"
                                            name="netto"
                                            type="text"
                                            defaultValue={accountingData.netto}
                                            onChange={handleInput}
                                        />

                                        <label>Bruttó: </label>
                                        <input
                                            class="form-control"
                                            id="brutto_input"
                                            name="brutto_input"
                                            type="text"
                                            value={brutto ? brutto : accountingData.brutto}
                                            disabled={accountingData.afa_mertek}
                                            onChange={handleInput}
                                        />

                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <MDBBtn type="button" onClick={handleFormCancel} block>Mégsem</MDBBtn>
                                        <MDBBtn type="button" onClick={handleFormSave} block>Mentés</MDBBtn></div>
                                </form>
                            </div>
                        </div>
                    </div></div> : <p></p>
            }

        </div>
    )
}


export default Accounting