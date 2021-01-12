import React, { useState } from 'react';
import Logo from '../images/gato-logo.svg';
import useUser from '../hooks/useUser';
import { NavLink } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons'
import Logout from './Logout';
import './Navbar.stylesheet.scss';


const NavBar = () => {

    const { user, isAuthenticated } = useUser();

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid p-4">
                    <a href="" className="text-reset text-decoration-none">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <img className="text-danger" src={Logo} width="42px" alt="Logo" />
                            </div>
                            <div className="col">
                                <h5 className="p-0 m-0 font-weight-bold">GATO</h5>
                                <small>The Barbershop</small>
                            </div>
                        </div>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="Navigation Menu" aria-expanded="false" aria-label="Toggle navigation menu">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div id="navbar" className="collapse navbar-collapse justify-content-end">
                        <ul className="navbar-nav">

                            <li className="nav-item">
                                <NavLink activeClassName="b-nav-active" className="nav-link" exact to="/"><strong>Home</strong></NavLink>
                            </li>

                            { user.is_staff && (
                                <li className="nav-item">
                                    <NavLink activeClassName="b-nav-active" className="nav-link" exact to="/manage"><strong>Manage bookings</strong></NavLink> 
                                </li>
                            ) }

                            { !isAuthenticated && (
                                <li className="nav-item">
                                    <NavLink activeClassName="b-nav-active" className="nav-link" exact to="/session"><strong>Login</strong></NavLink> 
                                </li>
                            ) }

                            { (isAuthenticated && !user.is_staff) && (
                                <>
                                    <li className="nav-item">
                                        <NavLink activeClassName="b-nav-active" className="nav-link" exact to="/book"><strong>Book</strong></NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink activeClassName="b-nav-active" className="nav-link" exact to="/bookings"><strong>Your Bookings</strong></NavLink> 
                                    </li>
                                </>
                            ) }

                            { isAuthenticated && <li className="nav-item"><Logout /></li>}

                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};
export default NavBar;