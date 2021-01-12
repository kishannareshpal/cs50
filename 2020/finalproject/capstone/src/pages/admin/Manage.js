import React, { useState, useEffect } from 'react';
import { Breadcrumb, Input, List, Button, Menu } from 'antd';
import { Link } from 'react-router-dom';
import useUser from '../../hooks/useUser';
import toast from 'react-hot-toast';
import dateToNum from '../../utils/dateToNum';
import moment from 'moment';
import ManageBookings from '../../components/manage/ManageBookings';

const Manage = () => {
    const { user, isAuthenticated } = useUser();

    return (
        <div className="container">
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Manage Bookings
                    </Breadcrumb.Item>
                </Breadcrumb>

                <h1 className="text-danger mb-0">
                    <strong>Manage Bookings</strong>
                </h1>
                { isAuthenticated && user.is_staff ? (
                    <>
                        <h3 className="mb-0" title={user.email}>Logged in as <strong>{ user.fullname }</strong></h3>
                        <div className="text-muted">{user.email}</div>
                    </>
                ) : (
                    <p>
                        You do not have permission to access this page. <Link to="/">Go back to the Home Page</Link>
                    </p>
                ) }
            </div>

            { (isAuthenticated && user.is_staff) && (
                <div className="mt-3">
                    <ManageBookings />
                </div>
            ) }
            
        </div>
    );
};

export default Manage;
