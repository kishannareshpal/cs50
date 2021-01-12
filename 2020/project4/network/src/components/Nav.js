import React from 'react'
import { HashRouter as Router, NavLink } from "react-router-dom";

const Nav = () => {
    return (
        <Router>
            <nav className="navbar navbar-expand-lg navbar-light" data-username="{{ user.username }}">
                <NavLink className="navbar-brand" exact to="/"><strong>Network</strong></NavLink>
            
                <div>
                <ul className="navbar-nav mr-auto">
                    { isUserLoggedIn && (
                        <li className="nav-item">
                            <NavLink className="nav-link" exact to={`/user/${currentUser.id}`}>{currentUser.username}</NavLink>
                        </li>  
                    )}
                    
                    <li className="nav-item">
                        <NavLink className="nav-link" exact to="/">All posts</NavLink>
                    </li>
                    
                    { isUserLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/following">Following</NavLink>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/logout">Log Out</a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/register">Register</a>
                            </li>
                        </>
                    )}
                </ul>
                </div>
            </nav>
        </Router>
    )
}

export default Nav;
