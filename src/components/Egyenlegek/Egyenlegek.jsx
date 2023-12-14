import React, { useEffect } from 'react'
import Szamlatukor from '../Szamlatukor/Szamlatukor'
import { useState } from 'react';
import Datatable from '../datatable/Datatable';


const Egyenlegek = () => {
    const [kivalasztottSzamla, setKivalasztottSzamla] = useState({ szamlaszam: '', szamlaLeiras: '' });
    const [egyenleg, setEgyenleg] = useState({ tartozikEgyenleg: '', kovetelEgyenleg: '', osszesitettEgyenleg: '' });
    const [tablazatAdat, setTablazatAdat] = useState({});
    const handleChildData = (childData) => {
        console.log("kivalasztott szamla: ", childData);
        setKivalasztottSzamla({ szamlaszam: childData.value, szamlaLeiras: childData.label });
    }

    const handleTable = (childData) => {
        console.log("tablechild", childData);
        setTablazatAdat(childData);
    }

    useEffect(() => {
        if (Array.isArray(tablazatAdat)) {
            const kovetelAlapjanSzurtElemek = tablazatAdat.filter(item => item.kovetel === kivalasztottSzamla.szamlaszam);
            const tartozikAlapjanSzurtElemek = tablazatAdat.filter(item => item.tartozik === kivalasztottSzamla.szamlaszam);
            const kovetelOsszegSum = kovetelAlapjanSzurtElemek.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.netto), 0);
            const tartozikOsszegSum = tartozikAlapjanSzurtElemek.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.netto), 0);
            setEgyenleg({
                tartozikEgyenleg: tartozikOsszegSum, kovetelEgyenleg: kovetelOsszegSum,
                osszesitettEgyenleg: (((kivalasztottSzamla.szamlaszam.charAt(0) === ('4' || '9')) || (kivalasztottSzamla.szamlaszam.charAt(2) === 9))
                    ? (kovetelOsszegSum - tartozikOsszegSum) : (tartozikOsszegSum - kovetelOsszegSum))
            });
            console.log("kovv", kovetelOsszegSum);
        } else {
            console.error("Nem tomb");
        }
    }, [tablazatAdat, kivalasztottSzamla])

    console.log("egyenleg", egyenleg);
    console.log("egyenleg leng", egyenleg.length)
    return (
        <div><h1>Egyenlegek áttekintése</h1>

            <div className='egyenlegek'>
                <Szamlatukor sendDataToParent={handleChildData} sendDataFromParent={"attekintes"} />

                {(kivalasztottSzamla.szamlaszam !== '') ?
                    <div>
                        <h1>A  számla részletei: </h1>
                        <div className="szamla_reszletek">
                            <div className="szamla_adatok">
                                <h3>A {kivalasztottSzamla.szamlaLeiras} Összesített egyenlege:{egyenleg.osszesitettEgyenleg}</h3>
                                <p>A {kivalasztottSzamla.szamlaszam} számla összesített tartozik egyenlege: {egyenleg.tartozikEgyenleg} </p>
                                <p>A {kivalasztottSzamla.szamlaszam} számla összesített követel egyenlege: {egyenleg.kovetelEgyenleg} </p>
                            </div>
                            <Datatable sendDataToParent={handleTable} collectionName="egyenleg" szamlaId={kivalasztottSzamla.szamlaszam} />
                        </div></div> : null}
            </div>

        </div>
    )
}

export default Egyenlegek