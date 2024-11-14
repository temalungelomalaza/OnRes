import React from "react";
import { Outlet } from "react-router-dom";
import Navi from "../Components/Navbar";

function Base({onLogout}){
    return(
        <>
            <Navi onLogout={onLogout} />   {/*renders navigation bar*/}
            <Outlet className="p-1"/>   {/* renders webpage */}
        </>
    )
}

export default Base;