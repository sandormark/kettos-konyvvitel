import React from 'react'
import Vevo_szallito from '../components/Vevo_Szallito/Vevo_szallito';
import { useState } from 'react';

const Konyveles = () => {

    const [selectedComponent, setSelectedComponent] = useState(null);

    const handleButtonClick = (componentName) => {
        switch (componentName) {
            case 'Vevo_szallito':
                setSelectedComponent(<Vevo_szallito />);
                break;
            default:
                setSelectedComponent(null);
                break;
        }
    };

    return (
        <div>
            <div>Konyveles</div>
            <button onClick={() => handleButtonClick('konyveles')}>Könyvelés</button>
            <button onClick={() => handleButtonClick('Vevo_szallito')}>Vevő/Szállító számla</button>
            <button onClick={() => handleButtonClick('harmadik')}>Pénztár/Bankbetét bizonylat</button>
            <div>
                {selectedComponent}
            </div>
        </div>
    )
}


export default Konyveles