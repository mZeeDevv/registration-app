import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 print:hidden">
        <div className="container mx-auto">
          <p className="text-center">© {new Date().getFullYear()} @mZeeDev 2025. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;