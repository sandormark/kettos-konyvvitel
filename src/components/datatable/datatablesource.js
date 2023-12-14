export const usersColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
        field: "name",
        headerName: "Name",
        width: 160,
      },
    /*
    {
      field: "user",
      headerName: "User",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.img} alt="avatar" />
            {params.row.username}
          </div>
        );
      },
    },*/

    {
      field: "email",
      headerName: "Email",
      width: 160,
    },
  
    {
      field: "phone",
      headerName: "Telefon",
      width: 160,
    },
  ];


  export const partnersColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
        field: "partner_name",
        headerName: "Partner Név",
        width: 160,
      },
    {
      field: "tax_number",
      headerName: "Adószám",
      width: 160,
    },
  
    {
      field: "phone",
      headerName: "Telefon",
      width: 160,
    },
  ];
export const afa_konyvelesColumns=[
  {field:"bizonylatszam",headerName:"bizonylatszám",width:160},
  {field:"esemeny",headerName:"Esemény leírás",width:160},
  {field:"afa",headerName:"Áfa számla",width:160},
  {field:"afa_osszeg",headerName:"Áfa összege",width:160}
];
export const egyenlegColumns=[
  {field:"bizonylatszam",headerName:"Bizonylatszám",width:120},
  {field:"esemeny",headerName:"Esemény leírás",width:160},
  {field:"tartozik",headerName:"Tartozik",width:100},
  {field:"kovetel",headerName:"Követel",width:100},
  {field:"netto",headerName:"Könyvelt összeg",width:120}
];
  export const accountingColumns=[
    { field: "bizonylatszam", headerName: "Bizonylatszám", width: 120 },
    {
        field: "tartozik",
        headerName: "Tartozik számla",
        width: 120,
      },
    {
      field: "kovetel",
      headerName: "Követel számla",
      width: 120,
    },
  
    {
      field: "esemeny",
      headerName: "Esemény",
      width: 160,
    },
    {
      field: "netto",
      headerName: "Nettó összeg",
      width: 160,
    },
    {field:"afa_mertek",
    headerName:"Áfa kulcs",
    width:160,
    },
      {
      field: "afa_osszeg",
      headerName: "Áfa összeg",
      width: 160,
    },  {
      field: "brutto",
      headerName: "Bruttó összeg",
      width: 160,
    },  {
      field: "fizmod",
      headerName: "Fizetés módja",
      width: 160,
    },  {
      field: "partner_name",
      headerName: "Partner neve",
      width: 160,
    },  {
      field: "kelt_date",
      headerName: "Keltezés időpontja",
      width: 160,
    },
    {
      field: "fiz_hat_date",
      headerName: "Fizetési határidő",
      width: 160,
    },
    {
      field: "teljesites_date",
      headerName: "Teljesites idopontja",
      width: 100,
    },

  ]