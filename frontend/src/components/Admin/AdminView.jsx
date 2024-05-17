import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHome.css';

const AdminHome = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform any logout logic here, e.g., clearing tokens, etc.
        navigate('/login');
    };

    return (
        <div className="admin-home">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="#">Admin Panel</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/manage-accounts">Manage User Accounts</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/product-listing">Product Listings</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Order Fulfillment</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Sales Reports</Link>
                            </li>
                        </ul>
                        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>
            <div className="container">
                <h1>Welcome to the Admin Panel</h1>
                <p>Select an option from the navigation bar to manage the platform.</p>
            </div>
        </div>
    );
}

export default AdminHome;
