import React from "react";
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Toaster } from 'react-hot-toast';
// Pages
import NoMatch from './pages/NoMatch';
import Home from './pages/Home';
import Session from './pages/Session';
import Book from './pages/Book';
import Bookings from './pages/Bookings';
import Manage from './pages/admin/Manage';



const App = () => {
    return (
        <Router>
            <NavBar />
            
            <div className="p-4">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/session" component={Session} />
                    <Route path="/book" component={Book} />
                    <Route path="/bookings" component={Bookings} />
                    <Route path="/manage" component={Manage} />
                    <Route path="*">
                        <NoMatch />
                    </Route>
                </Switch>

                <Toaster position="bottom-left"
                    toastOptions={{
                        className: "rounded-pill",
                        style: {
                            background: '#333', 
                            color: '#fff' 
                        }}} />
            </div>
        </Router>
    );
};

export default App;