import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Breadcrumb, Dropdown, Tag, Button, Modal, Radio, Empty, Input, Typography } from 'antd';
import toast from 'react-hot-toast';
import { CopyTwoTone, FilterOutlined, SortDescendingOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';
import StatusTag from '../components/StatusTag';
import QRCode from 'qrcode.react';
import './Bookings.stylesheet.scss';
import useUser from '../hooks/useUser';
import dateToNum from '../utils/dateToNum';
import moment from 'moment';
import Avatar from 'antd/lib/avatar/avatar';


const filterOptions = [
    {
        label: "All",
        value: "all"

    }, {
        label: "Accepted",
        value: "accepted"

    }, {
        label: "Done",
        value: "done"

    }
];


const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const { user, isAuthenticated } = useUser();


    useEffect(() => {
        // Fetch all of my bookings
        fetch("/api/profile/bookings")
            .then(res => {
                const { status } = res;
                if (status == 200) {
                    // Loaded
                    res.json().then(({ data }) => {
                        // Sort by upcoming...
                        data.sort((a, b) => {
                            return Math.abs(dateToNum(moment().format("DD/MM/YYYY")) - dateToNum(a.date)) - Math.abs(dateToNum(moment().format("DD/MM/YYYY")) - dateToNum(b.date));
                        });

                        setBookings(data);
                        console.log("All your bookings", data);
                    });

                } else if (status == 401) {
                    // Unauthorized!
                    toast("Unauthorized. Please Login with your account");
                    console.log("Unauthorized");

                } else {
                    // Unknown error!
                    toast("Something went wrong, please try again later");
                    console.log("Something went wrong while ", status);
                }
            });
    }, []);


    const cancelBooking = (booking_number) => {
        const new_status = "canceled";
        fetch("api/bookings/update", {
            method: "POST",
            body: JSON.stringify({
                booking_number,
                status: new_status
            })
        
        }).then(res => {
            const { status } = res;
            if (status == 200) {
                const updatedBookings = bookings.map((booking) => {
                    if (booking.number == booking_number) {
                        const modifiedBooking = booking;
                        modifiedBooking.status = new_status;
                        return modifiedBooking;
                    }
                    return booking;
                });
                setBookings(updatedBookings);
                // Canceled!
                toast("✅ Booking canceled succesfully");

            } else if (status == 401) {
                // Unauthorized!
                toast("Unauthorized. Please Login with your account");

            } else {
                // Unknown error!
                toast("There was a problem canceling this booking");
            }
        });
    };


    const showQRCode = (booking_number) => {
        Modal.info({
            title: "Show this when you arrive",
            content: (
                <div>
                    <QRCode value={booking_number} />
                    <div className="mt-2">
                        <p className="font-weight-bold text-muted mb-0">BOOKING #:</p>
                        <p className="mb-1">{booking_number}</p>
                        <Button onClick={() => {
                            // copy the booking number to clipboard
                            copy(booking_number);
                            toast("📋 Booking number copied to clipboard");
                            
                        }} icon={<CopyTwoTone />}></Button>
                    </div>
                </div>
            )
        });
    };


    const onFilter = ({ target: { value: filter }}) => {
        setSelectedFilter(filter);
    };


    const onSearch = () => {
        const queryParams = new URLSearchParams({
            search_query: searchQuery
        });
        
        fetch(`/api/profile/bookings?${queryParams.toString()}`)
            .then(res => res.json())
            .then(({ data }) => {
                data.sort((a, b) => {
                    return Math.abs(dateToNum(moment().format("DD/MM/YYYY")) - dateToNum(a.date)) - Math.abs(dateToNum(moment().format("DD/MM/YYYY")) - dateToNum(b.date));
                });

                setBookings(data);
            });
    };


    const renderAllBookingsLI = () => {
        let filteredBookings = bookings;
        
        if (selectedFilter != "all") {
            filteredBookings = filteredBookings.filter(booking => {
                return booking.status == selectedFilter;
            });
        }


        if (filteredBookings.length == 0) {
            // No Bookings
            return (
                <Empty description={`No ${selectedFilter != 'all' ? selectedFilter : ''} bookings`} />
            );
        }
        
        return filteredBookings.map(booking => {
            return (
                <div key={booking.id} className="card bookings-card mb-3">
                    <div className="p-3">
                        <div>
                            <small>BOOKING # <span className="booking-number" onClick={() => showQRCode(booking.number)}><strong>{booking.number.toUpperCase()}</strong></span></small>
                        </div> 
                        <div>
                            <small>Booked at {booking.timestamp}</small>
                        </div>
                        { booking.note && (
                            <div className="text-muted">
                                <mark>
                                    <small>
                                        Note: {booking.note}
                                    </small>
                                </mark>
                            </div>
                        ) }
                    </div>
                    <hr className="m-0 p-0" />
                    <div className="p-3">
                        <div className="row">
                            <div className="col">
                                <StatusTag status={booking.status} />
                                <p className="mt-2 mb-0">{booking.service.title}</p>
                                <small className="text-muted">{booking.service.description}</small>
                                <div className="text-danger">£{booking.service.price_in_gbp}</div>
                                <div>For 1 person • Duration: {booking.service.duration_in_mins}mins</div>
                                <div className="mt-3">
                                    <Dropdown overlay={
                                        <Menu>
                                            <Menu.Item onClick={() => showQRCode(booking.number)}>
                                                Show QR Code
                                            </Menu.Item>

                                            { booking.status == "accepted" && (
                                                <Menu.Item danger onClick={() => cancelBooking(booking.number)}>
                                                    Cancel this booking
                                                </Menu.Item>
                                            )}
                                        </Menu>
                                    }
                                    trigger='click' >
                                        <Button icon={<i className="fas fa-ellipsis-v" />} type="primary" shape="circle"></Button>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="col text-right">
                                <div>Date: <strong>{booking.date}</strong></div>
                                <div>Time: <strong>{booking.time}</strong></div>
                                <small>Barber: <Avatar src={booking.barber.photo_url} size={24}></Avatar> <strong>{booking.barber.fullname}</strong></small>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="container">
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Bookings
                    </Breadcrumb.Item>
                </Breadcrumb>

                <h1 className="text-danger mb-0">
                    <strong>Your bookings</strong>
                </h1>
                { isAuthenticated ? (
                    <h3 title={user.email}>{ user.fullname }</h3>
                ) : (
                    <p>Please <Link to={`/session?next=${encodeURIComponent("/book")}`}>Login</Link> to view all your bookings</p>
                ) }
            </div>

            { isAuthenticated && (
                <div className="mt-4">
                    <div className="row mb-4 align-items-center">
                        <div className="col-12 col-md-auto my-2">
                            <FilterOutlined className="m-2" /> Filter by:
                        </div>
                        <div className="col my-2">
                            <Radio.Group onChange={onFilter}
                                options={filterOptions}
                                optionType="button"
                                value={selectedFilter} />
                        </div>
                        <div className="col-12 col-md-auto my-2">
                            <Input.Search value={searchQuery}
                                onSearch={onSearch}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search"
                                allowClear />
                        </div>
                    </div>

                    <div className="mb-3 text-right">
                        <SortDescendingOutlined /> Sorted by upcoming
                    </div>

                    { renderAllBookingsLI() }
                </div>
            ) }

        </div>
    );
};

export default MyBookings;
