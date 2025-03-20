import React, { useState } from 'react';
import  Sidebar from './components/Sidebar';
import { Header } from './pages/tenants/Header';
import {Outlet} from 'react-router-dom'

function App() {

  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} /> */}
    <Sidebar />
    <div className="flex-1 ml-64">
      <Header />
      <main className="p-8">
        <Outlet/>
      </main>
    </div>
  </div>
  );
}

export default App;
