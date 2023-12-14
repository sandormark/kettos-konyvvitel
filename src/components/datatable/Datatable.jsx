import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { usersColumns, partnersColumns, accountingColumns, afa_konyvelesColumns, egyenlegColumns } from "./datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    or

} from "firebase/firestore";
import { db } from "../../services/firebase";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//const Datatable = ({ props.collectionName, props.szamlaId }) => {

const Datatable = (props) => {
    const [egyenleg,setEgyenleg]=useState({});
    const [data, setData] = useState([]);
    console.log("collect", props.collectionName);
    console.log("props.szamlaId", props.szamlaId);
    let column = '';
    switch (props.collectionName) {
        case "users":
            column = usersColumns;
            break;
        case "partners":
            column = partnersColumns;
            break;
        case "accounting":
            column = accountingColumns;
            break;
        case "afa_konyveles":
            column = afa_konyvelesColumns;
            break;
        case "egyenleg":
            column = egyenlegColumns;
            break;
    }

    useEffect(() => {
        const fetchData = async () => {
            let list = [];
            try { 
              const q = props.szamlaId!==undefined? query(
                    collection(db, "accounting"),
                    or(where("kovetel", "==", props.szamlaId),
                    where("tartozik", "==",props.szamlaId))
                  ):'';
               const querySnapshot =props.szamlaId!==undefined?await getDocs(q): await getDocs(collection(db, (props.collectionName === "afa_konyveles" || props.collectionName === "egyenleg" ? "accounting" : props.collectionName)));
              // const querySnapshot=await getDocs(collection(db, (props.collectionName === "afa_konyveles" || props.collectionName === "egyenleg" ? "accounting" : props.collectionName)));


                querySnapshot.forEach((doc) => {
                    const newData = { id: doc.id };
                    const docData = doc.data();

                    Object.keys(docData).forEach((key) => {
                        if (docData[key] && typeof docData[key] === 'object' && docData[key].hasOwnProperty('seconds')) {
                            const timestamp = docData[key];
                            const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                            const formattedDate = date.toLocaleDateString('hu-HU', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            });
                            newData[key] = formattedDate;
                        } else {
                            newData[key] = docData[key];
                        }
                       
                        if(key==="afa_mertek"){
                             newData[key]=docData[key]*100+" %";
                        }
                    });

                    list.push(newData);
                });

                setData(list);
                setEgyenleg(list);
                console.log("lita,", list);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
        console.log("Datatable",egyenleg);
      
    }, [props.szamlaId]);

   if (props.szamlaId!==undefined) props.sendDataToParent(egyenleg);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, props.collectionName, id));
            setData(data.filter((item) => item.id !== id));
        } catch (err) {
            console.log(err);
            toast.error('Nincs hozzá jogosultságod!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000
            });
        }
    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Műveletek",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/${props.collectionName}/${params.row.id}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">Szerkesztés</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={props.collectionName==="accounting"?()=>handleDelete(params.row.bizonylatszam):() => handleDelete(params.row.id)}
                        >
                            Törlés
                        </div>
                    </div>
                );
            },
        },
    ];



    return (
        <div className="datatable">
            {column === usersColumns ? (


                <div className="datatableTitle">
                    <h1>Felhasználók listázása</h1>
                    <Link to="/register" className="link">
                        Új felhasználó hozzáadása
                    </Link>
                </div>) : ("")}

            <DataGrid sx={{ width: '100%' }}
                className="datagrid"
                rows={data}
                columns={(props.collectionName === "afa_konyveles" || props.collectionName === "egyenleg") ? column : column.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
            />
        </div>
    );
};
export default Datatable;