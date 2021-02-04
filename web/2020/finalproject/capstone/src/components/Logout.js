import React, { useState } from 'react';
import useUser from '../hooks/useUser';
import './Logout.stylesheet.scss';

const Logout = () => {
    const { removeUser } = useUser();
    const [confirming, setConfirming] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState("");

    const onLogout = () => {
        // click
        // sure?
        // click again on sure
        // logout

        if (confirming) {
            fetch("api/logout").then(() => {
                // Logged out
                removeUser();

                window.location.reload();
            });
        }

        setConfirming(prevConfirming => !prevConfirming);
        setTimeout(() => {
            // reset after 5s
            setConfirming(false);
        }, 3500);

    };

    return (
        <div>
            <div role="button" onClick={onLogout} className={`nav-link text-danger ${confirming ? 'logout-confirming' : ''}`}>
                <strong>
                    { confirming ? "Sure?" : "Logout" }
                </strong>
            </div>
        </div>
    );
};

export default Logout;
