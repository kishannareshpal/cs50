import React, { Component } from "react"
import { HashRouter as Router, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Nav from "./components/Nav"

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Following from "./pages/Following";



class App extends Component {
    render() {
        return (
            <>
                <Nav />
                
                <Router>
                    <div className="body container my-5">
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/user/:userId" component={Profile} />
                        <Route exact path="/following" component={Following} />
                    </div>
                </Router>

                <ToastContainer limit={1} />
            </>
        )
    }
}


export default App