import React, { useState } from "react";
import { LandlordSidebar } from "./LandlordSidebar";
import { Outlet } from "react-router-dom";

export const LandlordDashboard = () => {
  return (
    <div className="flex">
    <LandlordSidebar />  {/* Sidebar Included */}
    <Outlet/>
  </div>
  )
}
