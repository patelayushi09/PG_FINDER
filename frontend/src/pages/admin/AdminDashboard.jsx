import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Outlet } from "react-router-dom";


export const AdminDashboard = () => {
 
  return (
    <div className="flex">
      <AdminSidebar />  {/* Sidebar Included */}
      <Outlet/>
    </div>
  );
};
