import React, { useState, useEffect } from 'react';
import { Tabs, Button, Alert } from 'antd';
import { Redirect, useHistory } from 'react-router-dom';
import EmailValidator from '../utils/EmailValidator';
import BarberIllustrationAlt from '../images/barber-illustration-alt.png';
import useQuery from '../hooks/useQuery';
import useUser from "../hooks/useUser";
import 'animate.css';
import './Session.stylesheet.scss';

const Session = () => {
    // Declare and init component wide states
    const [email, setEmail]             = useState("");
    const [error, setError]             = useState("");
    const [firstName, setFirstName]     = useState("");
    const [lastName, setLastName]       = useState("");
    const [password, setPassword]       = useState("");
    const [loading, setLoading]         = useState(false);
    const [success, setSuccess]         = useState(false);
    const [tab, setTab]                 = useState("login");
    const [redirectUrl, setRedirectUrl] = useState();

    // Declare and init hooks
    const queryParams = useQuery();
    const history = useHistory();
    const { user, isAuthenticated, setUser } = useUser();


    // comopnentWillMount
    useEffect(() => {
        if (isAuthenticated) {
            // Redirect to next page (if specified) or to home.
            if (queryParams.next) {
                // to the specified page.
                setRedirectUrl(queryParams.next);
            } else {
                // to home.
                setRedirectUrl("/");
            }
            return;
        }

        // If not authenticated
        if (queryParams.email) {
            // Pre-fill the email field
            setEmail(queryParams.email);
        }

        if (queryParams.tab == "register") {
            // Pre-select the register tab if asked to register
            setTab(queryParams.tab);
        }
    }, []);

    /**
     * Checks if input fields are typed.
     * – Inteligently know which fields to check based on if we are logging in or registering :)
     *
     * @returns true if can continue, otherwise false
     */
    const checkUserInput = () => {
        // Reset all errors
        setError("");

        // We need to check additional fields if we are registering
        if (tab == "register") {
            // Check additional fields if we are registering an account
            if (firstName.length === 0) {
                setError("Please enter your first name");
                return false;
            }

            if (lastName.length === 0) {
                setError("Please enter your last name");
                return false;
            }
        }

        // Check if email is correctly formed.
        const isEmailWellFormed = EmailValidator(email);
        if (!isEmailWellFormed) {
            // Not well formed
            setError("Please enter a valid email address");
            return false;
        }

        // Check if password is written
        if (password.length === 0) {
            setError("Please enter the password");
            return false;
        }

        // If all check passes, return true, which means that the fields are valid.
        return true;
    };

    /**
     * Login
     */
    const onLogin = () => {
        setLoading(true);
        // Validate
        const isUserInputValid = checkUserInput();
        if (!isUserInputValid) {
            setLoading(false);
            return;
        };

        // Login the user.
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })

        }).then(res => {
            const { status } = res;
            if (status == 200) {
                // Succesfully logged in.
                res.json().then(({ data: user }) => {
                    // Save the user details in localStorage
                    setUser(user);
                    setSuccess(true);
                    setTimeout(() => {
                        // reload this page after 3s
                        // and let useEffect redirect to the next page.
                        history.go(0);
                    }, 3000);
                });

            } else if (status == 404) {
                // Invalid credentials
                setError("These credentials do not match our records");
            }
            setLoading(false);
        });
    };

    /**
     * Register
     */
    const onRegister = () => {
        setLoading(true);
        // Validate
        const isUserInputValid = checkUserInput();
        if (!isUserInputValid) {
            setLoading(false);
            return;
        };

        // Register the user.
        fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                password
            })

        }).then(res => {
            const { status } = res;
            if (status == 200) {
                // Succesfully registered, and automatically logged in.
                res.json().then(({ data: user }) => {
                    // Save the user details in localStorage
                    setUser(user);
                    setSuccess(true);
                    setTimeout(() => {
                        // reload this page after 3s
                        // and let useEffect redirect to the next page.
                        history.go(0);
                    }, 3000);
                });

            } else if (status == 403) {
                // Email already registered
                setError("Email already registered. Try logging in?");
            }
            setLoading(false);
        });
    };


    if (redirectUrl) {
        return <Redirect to={redirectUrl} />;
    }
    return (
        <div className="container">
            <div className="row align-items-center">
                <div className="col-12 col-lg-6">
                    <img width="100%" src={BarberIllustrationAlt} alt="Barber illustration"/>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card card-body sessions-rounded">
                        <Tabs className="mb-2"
                            centered
                            onChange={(tab) => {
                                setError("");
                                setTab(tab);
                            }}
                            activeKey={tab}>

                            <Tabs.TabPane disabled={success} className="p-2" tab="Login" key="login">
                                <h1 className="text-danger mb-0">
                                    <strong>Let's log you in</strong>
                                </h1>
                                <p className="font-weight-bold">Welcome back, you have been missed!</p>

                                <div className="mb-3">
                                    <p className="mb-2">Your Email</p>
                                    <input disabled={success} value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="name@example.com" />
                                </div>

                                <div className="mb-3">
                                    <p className="mb-2">Password</p>
                                    <input disabled={success} value={password} onChange={(e) => setPassword(e.target.value)} type='password' className="form-control" placeholder="shh, it's a secret..." />
                                </div>

                                <div>
                                    <Button loading={loading} disabled={success} className="d-inline-block" onClick={onLogin} danger type='primary' shape="round" size='large'>
                                        { !success ? 'Login' : 'You are now logged in' }
                                    </Button>
                                </div>
                            </Tabs.TabPane>


                            <Tabs.TabPane disabled={success} className="p-2" tab="Register" key="register">
                                <h1 className="text-danger mb-0">
                                    <strong>Register</strong>
                                </h1>
                                <p className="font-weight-bold">Create an account so you can book and manage it all!</p>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input disabled={success} value={firstName} onChange={(e) => setFirstName(e.target.value)} type="name" className="form-control"/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input disabled={success} value={lastName} onChange={(e) => setLastName(e.target.value)} type="name" className="form-control"/>
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input disabled={success} value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="name@example.com" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input disabled={success} value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" placeholder="shh, it's a secret..." />
                                </div>

                                <div>
                                    <Button loading={loading} disabled={success} className="d-inline-block" onClick={onRegister} danger type='primary' shape="round" size='large'>
                                        { !success ? 'Register' : 'You are now logged in' }
                                    </Button>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>

                        { success && <small className="px-2 animate__animated animate__fadeIn animate__fast">⏭ Wait! You will be redirected in 3 seconds.</small> }

                        { error && <Alert className="sessions-rounded animate__animated animate__fadeIn animate__faster" message={error} type="error" /> }
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Session;
