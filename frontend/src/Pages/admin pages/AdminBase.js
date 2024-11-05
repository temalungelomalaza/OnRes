import React from "react";
import { Outlet } from "react-router-dom";
import AdminNav from "../../Components/AdminNav";

function AdminBase({onLogout}){
    return(
        <>
            <AdminNav onLogout={onLogout} />   {/*renders navigation bar*/}
            <Outlet className="p-1"/>   {/* renders webpage */}
        </>
    )
}

export default AdminBase;