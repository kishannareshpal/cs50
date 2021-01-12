import React, { useEffect, useState } from 'react';
import { Table, Menu, Dropdown, Tag, Button, Space, Input } from 'antd';
import StatusTag from '../../components/StatusTag';
import { CheckCircleTwoTone, CloseCircleOutlined, QrcodeOutlined } from '@ant-design/icons';
import QrReader from 'react-qr-reader';
import toast from 'react-hot-toast';

const columns = [
    {
        title: "Number",
        dataIndex: "number",
        key: "number",
        // fixed: "left"
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name"
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date"
    },
    {
        title: "Time",
        dataIndex: "time",
        key: "time"
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
            <StatusTag status={status} />
        )
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space direction="vertical" size="small">
                <Button onClick={() => record.markBookingAs("done", record.number)} type="primary" disabled={ ['done', 'rejected', 'canceled'].includes(record.status) } shape="round"><CheckCircleTwoTone /> Mark as done</Button>
                <Button onClick={() => record.markBookingAs("rejected", record.number)} type="dashed" danger disabled={ ['done', 'rejected', 'canceled'].includes(record.status) } shape="round"><CloseCircleOutlined /> Reject</Button>
            </Space>
        ),
        // fixed: "right"
    }];



const ManageBookings = () => {
    // States
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCamera, setShowCamera] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Load all bookings
        const params = new URLSearchParams({
            search_query: searchTerm
        });

        fetch(`/api/bookings?${params.toString()}`)
            .then(res => res.json())
            .then(res => {
                setBookings(res.data);
                setLoading(false);
            });

    }, [searchTerm]);


    const markBookingAs = (status, booking_number) => {
        fetch("api/bookings/update", {
            method: "POST",
            body: JSON.stringify({
                booking_number,
                status
            })
        
        }).then(res => {
            if (res.status == 200) {
                const updatedBookings = bookings.map((booking) => {
                    if (booking.number == booking_number) {
                        const modifiedBooking = booking;
                        modifiedBooking.status = status;
                        return modifiedBooking;
                    }
                    return booking;
                });
                setBookings(updatedBookings);
                // Canceled!
                toast(`✅ Booking marked as ${status} succesfully`);

            } else if ((res.status == 401) || (res.status == 403)) {
                // Unauthorized!
                toast("🚫 Unauthorized");
            
            } else {
                // Unknown error!
                toast(`🚫 There was a problem marking this booking as ${status}.`);
            }
        });
    };



    const data = () => {
        return bookings.map(booking => {
            return {
                key: booking.id,
                number: booking.number,
                name: booking.user.fullname,
                time: booking.time,
                date: booking.date,
                status: booking.status,
                description: (
                    <dl className="">
                        <dt className="font-weight-bold">Barber name</dt>
                        <dd>{booking.barber.fullname}</dd>

                        <dt className="font-weight-bold">Service</dt>
                        <dd>{booking.service.title}</dd>

                        <dt className="font-weight-bold">Note</dt>
                        <dd>{booking.note ? booking.note : "N/A"}</dd>
                    </dl>
                ),
                markBookingAs
            };
        });
    };


    return (
        <div>

            <div className="mb-2 row">
                <div className="col">
                    <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Filter # Booking number"/>
                </div>
                <div className="col">
                    <Button onClick={() => setShowCamera(prev => !prev)} shape="round" type={ showCamera ? "default" : "primary" } icon={<QrcodeOutlined/>}>
                        { showCamera ? "Close camera" : "Scan QR code" }
                    </Button>
                </div>
            </div>

            { showCamera && (
                <div className="row justify-content-center mt-4">
                    <div className="col-12 col-md-6">
                        <QrReader delay={300} style={{ width: "100%", borderRadius: "16px", overflow: "overlay" }}
                            onScan={(result) => {
                                if (result) {
                                    setSearchTerm(result);
                                }
                            }}
                            onError={() => { /* Do Nothing here */ }}
                        />
                    </div>
                </div>
            ) }

            <Table title={() => "All bookings"} 
                loading={loading} 
                style={{ width: "100%", overflowX: "scroll" }} 
                columns={columns}
                dataSource={data()}
                expandable={
                    {
                        expandedRowRender: (record) => <div key={record.number} className="m-0">{record.description}</div>,
                    }
                }
                />
        </div>
    );
};

export default ManageBookings;
