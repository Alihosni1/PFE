import React from 'react';
import Sidebar from '../Components/Sidebar';
//import Header from '../Components/Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <> 
        
        <Sidebar />
        <div className="main-container">
          <div className="pd-ltr-20 xs-pd-20-10">
            <div className="min-height-200px">
              <Outlet />
            </div>
          </div>
        </div>
        
    </>
  );
};

export default MainLayout;
