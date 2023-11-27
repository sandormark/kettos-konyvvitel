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