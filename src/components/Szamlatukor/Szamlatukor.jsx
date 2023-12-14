import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Select from 'react-select';



const Szamlatukor = (props) => {

    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [data, setData] = useState({});

    const storage = getStorage();
    const gsReference = ref(storage, 'gs://kettos-konyveles.appspot.com/szamlatukor.json');

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('szamlatukor')) !== null) {
            const storedOption = JSON.parse(localStorage.getItem('szamlatukor'));
            setOptions(storedOption);

        } else {
            getDownloadURL(gsReference)
                .then((url) => {
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                const json = JSON.parse(event.target.result);
                                localStorage.setItem('szamlatukor', JSON.stringify(json));
                                const storedOption = JSON.parse(localStorage.getItem('szamlatukor'));
                                setOptions(storedOption);
                            };
                            reader.readAsText(blob);
                        })
                        .catch((error) => {
                        });
                })
                .catch((error) => {
                });
        }

    }, []);

    const valami = options.map((item) => ({
        value: item.id,
        label: item.id + " - " + item.content.trim(),
    }));
    console.log("props",props);
    const result = (props.sendDataFromParent==='attekintes')?"Válassza ki melyik számla tartalma érdekli":(valami.find(item => item.value === props.dataFromParent)?.label);
    console.log("result",result);

    const handleInput = (e) => {
        setData(e);
        props.sendDataToParent(e);
    };

    return (
        <div>
            <Select
                options={valami}
                placeholder={result}
                onChange={handleInput}
            />
        </div>
    );
};
export default Szamlatukor