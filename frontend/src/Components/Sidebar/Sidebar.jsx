import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import config from '../../config';

function Sidebar() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch(`${config.BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="sidebar bg-dark text-white">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
                <div className="sidebar-center">
                    <div className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white">
                        <span className="caption">Menu</span>
                    </div>

                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => 
                                "btn navlink align-middle px-3 mb-4 " + (isActive ? "active" : "")
                            }>
                                <i className="fs-4 bi-house"></i>
                                <span className="ms-1 d-sm-inline">Dashboard</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/Patients" className={({ isActive }) => 
                                "btn navlink px-3 align-middle mb-4 " + (isActive ? "active" : "")
                            }>
                                <i className="fs-4 bi bi-person-vcard-fill"></i>
                                <span className="ms-1 d-sm-inline">Patients</span>
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/History" className={({ isActive }) => 
                                "navlink btn px-3 align-middle mb-4 " + (isActive ? "active" : "")
                            }>
                                <i className="fs-4 bi-grid"></i>
                                <span className="ms-1 d-sm-inline">History</span>
                            </NavLink>
                        </li>
                        
                        <hr />
                        <li className="nav-item">
                            <NavLink onClick={handleLogout} className="logout">
                                <i className="fs-4 bi bi-box-arrow-right"></i>
                                <span className="ms-1">Log Out</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;