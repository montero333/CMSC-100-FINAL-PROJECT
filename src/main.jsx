import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; 



import Root from './pages/Root';
import AdminProductListing from './pages/AdminProductListing';
import ViewUsers from './pages/AdminViewUser';
import AdminSales from './pages/AdminSales';
import AdminOrderFulfillment from './pages/AdminOrderFulfillment';

const router = createBrowserRouter([
  { path: '/', element: <Root />, children: [
    { path: '/', element: <ViewUsers /> },
    { path: 'product-listing', element: <AdminProductListing /> },
    { path: 'sales-report', element: <AdminSales /> },
    { path: 'order-fulfillment', element: <AdminOrderFulfillment /> }
  ]}
])

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />    
  </React.StrictMode>
);
