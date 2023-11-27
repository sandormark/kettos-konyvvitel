import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { usersColumns,partnersColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

const Datatable = ({ collectionName }) => {
    const [data, setData] = useState([]);

    let column='';
    switch(collectionName){
        case "users":
        column=usersColumns;
        break;
        case "partners":
        column=partnersColumns;
        break;
    }

    useEffect(() => {
        const fetchData = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(collection(db, collectionName));
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setData(list);
    
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);

    console.log(data);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
            setData(data.filter((item) => item.id !== id));
        } catch (err) {
            console.log(err);
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
                        <Link to={`/${collectionName}/${params.row.id}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">Szerkesztés</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={() => handleDelete(params.row.id)}
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
            {column===usersColumns ? (

            
            <div className="datatableTitle">
                Felhasználók
                <Link to="/register" className="link">
                  Új felhasználó hozzáadása
                </Link>
            </div>):(<p></p>)}

            <DataGrid
                className="datagrid"
                rows={data}
             columns={column.concat(actionColumn)}
                pageSize={9}
                rowsPerPageOptions={[9]}
            />
        </div>
    );
};
export default Datatable;