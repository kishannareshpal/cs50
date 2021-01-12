import React from 'react';
import QRCode from 'qrcode.react';
import { Result, Button, Space } from 'antd';
import { ScheduleTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const BookResult = ({ lastBookingDetails }) => {
    return (
        <Result
            status="success"
            title="You have been succesfully booked with us!"
            extra={
                <div>
                    <h6>Please have this ready to show staff when you arrive</h6>
                    <QRCode value={lastBookingDetails.number} />
                    <p>BOOKING # <strong>{lastBookingDetails.number}</strong></p>
                    <p className="text-muted"><strong>How to pay?</strong> <i>We'll take payments by cash or card on site.</i></p>
                    <div className="mt-4">
                        <Space size="middle">
                            <Link to="/bookings/" className="text-reset">
                                <Button icon={<ScheduleTwoTone />} size='large' shape="round" type="primary" key="my_bookings">View My Bookings</Button>
                            </Link>
                        </Space>
                    </div>
                </div>
            }
        />
    );
};

export default BookResult;
