import React, { useState, useEffect, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Steps, Button, Space, Row, Col, Modal, Card, Tag, Avatar, Input, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import './Book.stylesheet.scss';
import toast from 'react-hot-toast';
import moment from 'moment';
import useUser from '../hooks/useUser';
import { get, isEmpty } from 'lodash';
// Page specific components
import Services from '../components/book/Services';
import Dates from '../components/book/Dates';
import Times from '../components/book/Times';
import Barbers from '../components/book/Barbers';
import BookResult from '../components/book/BookResult';


const steps = [{
        title: "Service",
        description: "Select the type of service you want"

    }, {
        title: 'Barber',
        description: "Do you have a favorite barber in our shop?"

    }, {
        title: 'Date',
        description: "When would you like to get your service done"

    }, {
        title: 'Time',
        description: "What time is the most convenient for you"
        
    }, {
        title: 'Done'
    }];


// Booking page – Component
const Book = () => {
    /* ------------------------------ States ------------------------------ */
    const [currentStep, setCurrentStep] = useState(0);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [isBookingDetailsModalVisible, setIsBookingDetailsModalVisible] = useState(false);
    const [isBookingOnProgress, setIsBookingOnProgress] = useState(false);
    
    const { user, isAuthenticated } = useUser();
        
    // Selected Service
    const [selectedService, setSelectedService] = useState({});
    const [selectedBarber, setSelectedBarber] = useState({});
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedTime, setSelectedTime] = useState("");
    const [bookingNote, setBookingNote] = useState("");
    const [lastBookingDetails, setLastBookingDetails] = useState({});
    

    /* ------------------------------ Component Hooks ------------------------------ */
    // didLoad
    useEffect(() => {
        // Fetch all services this barbershop serves.
        fetch("api/services")
            .then(res => res.json())
            .then(({ data }) => {
                setServiceTypes(data);
            });

    }, []);


    /* ------------------------------ Methods ------------------------------ */
    // Manually change the current step (used for next and previous button on ui)
    // - direction: can be "next" or "previous"
    const handleStepChange = (direction) => {
        if (direction == "next") {
            if (currentStep == 0 && isEmpty(selectedService)) {
                // No service selected.
                // Cannot continue.
                toast.error("Please choose a service before continuing");
                return;
            
            } else if (currentStep == 1 && isEmpty(selectedBarber)) {
                // No barber selected.
                // Cannot continue.
                toast.error("Please choose a barber before continuing");
                return;

            }
            setCurrentStep(prevStep => prevStep + 1);

        } else if (direction == "previous") {
            setCurrentStep(prevStep => prevStep - 1);
        }
    };


    // Preview Selections
    const toggleBookingDetails = () => {
        if (currentStep == 3 && isEmpty(selectedTime)) {
            // No time selected
            // Cannot continue.
            toast.error("Please choose a time before continuing");
            return;
        }
        setIsBookingDetailsModalVisible(prevIsVisible => !prevIsVisible);
    };


    // Callback when a service is selected on Step 1 (0).
    const onServiceSelected = (service) => {
        setSelectedService(service);
        // toast("💈 You have selected " + service.title)
    };

    // Callback when a service is selected on Step 2 (1).
    const onBarberSelected = (barber) => {
        setSelectedBarber(barber);
        // toast("💇🏻‍♂️ You have selected " + barber.name)
    };

    // Callback when a date is selected on Step 3 (2).
    const onDateSelected = (date) => {
        if (!date.isBefore(moment())) {
            setSelectedDate(date);
        } else {
            if (moment().day() == 0) {
                setSelectedDate(moment().day(1, 'days'));
                
            } else {
                setSelectedDate(moment());

            }
        }
    };

    // Callback when a time is selected on Step 4 (3).
    const onTimeSelected = (time) => {
        setSelectedTime(time);
    };


    // On book confirmation!
    const onBook = () => {
        setIsBookingOnProgress(true);
        fetch("/api/bookings", {
            method: "POST",
            body: JSON.stringify({
                date:  selectedDate.format("DD/MM/YYYY"),
                time: selectedTime,
                service_id: selectedService.id,
                barber_id: selectedBarber.id,
                note: bookingNote,
            })
            
        }).then(res => {
            const { status } = res;
            if (status == 201) {
                // Created!
                res.json().then(({ data: createdBooking }) => {
                    setBookingNote(""); // clear notes form.
                    setLastBookingDetails(createdBooking);
                    toast("✅ Booked!");
                    setCurrentStep(steps.length - 1);
                    console.log("Booking created", createdBooking);
                });

            } else if (status == 401) {
                // Unauthorized!
                toast("Unauthorized. Please Login with your account");
                console.log("Unauthorized");

            } else {
                // Unknown error!
                toast("Something went wrong, please try again later");
                console.log("Something went wrong while booking", status);
            }

            setIsBookingOnProgress(false);
            setIsBookingDetailsModalVisible(false); // close the booking details modal
        });
    };


    /* ------------------------------ Inline Component Renderers ------------------------------ */
    const renderStepContent = () => {
        if (currentStep == 0) {
            // Service
            return (
                <div>
                    <Services serviceTypes={serviceTypes} selectedService={selectedService} onServiceSelected={onServiceSelected} />
                </div>
            );

        } if (currentStep == 1) {
            // Barber
            return (
                <div>
                    <Barbers selectedBarber={selectedBarber} onBarberSelected={onBarberSelected} />
                </div>
            );

        } else if (currentStep == 2) {
            // Date
             return (
                <div>
                    <Dates setSelectedDate={setSelectedDate} selectedDate={selectedDate} onDateSelected={onDateSelected} />
                </div>
            );
        
        } else if (currentStep == 3) {
            // Time
            return (
                <div>
                    <Times selectedDate={selectedDate} selectedTime={selectedTime} selectedBarber={selectedBarber} onTimeSelected={onTimeSelected} />
                </div>
            );

        } else if (currentStep == 4) {
            // Succesfully booked!
            return (
                <div>
                    <BookResult lastBookingDetails={lastBookingDetails} />
                </div>
            );
        }
    };


    /* ------------------------------ Render ------------------------------ */

    return (
        <div className="container">
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Book
                    </Breadcrumb.Item>
                </Breadcrumb>
                
                <h1 className="text-danger mb-0">
                    <strong>Book a service with us</strong>
                </h1>
                { isAuthenticated ? (
                    <p>Booking for <strong>{ user.fullname }</strong></p>
                ) : (
                    <p>Please <Link to={`/session?next=${encodeURIComponent("/book")}`}>Login</Link></p>
                ) }
            </div>

            <div className="mt-5">
                {/* Step */}
                <Steps responsive="true" current={currentStep}>
                    {steps.map(item => (
                        <Steps.Step description={item.description} key={item.title} title={item.title} />
                    ))}
                </Steps>
                
                {/* Content */}
                <div className="my-4">
                    {renderStepContent()}
                </div>
                
                <hr/>

                {/* Footer */}
                <div className="my-4">
                    <Row justify="center">
                        <Col>
                            <Space size="small">
                                { !isAuthenticated ? (
                                    <Link to={`/session?next=${encodeURIComponent("/book")}`}>
                                        <Button type="primary" shape="round" size='large'>Login to continue</Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Button onClick={() => handleStepChange("previous")} type="ghost" hidden={currentStep > 3} disabled={currentStep == 0} shape="round" size='large'>Back</Button>
                                        <Button onClick={() => handleStepChange("next")} type="primary" hidden={currentStep >= 3} shape="round" size='large'>Continue</Button>
                                        <Button onClick={toggleBookingDetails} type="primary" icon={<EyeOutlined/>} hidden={currentStep != 3} shape='round' size='large'>View booking details</Button>
                                    </>
                                ) }
                            </Space>
                        </Col>
                    </Row>
                </div>

            </div>

            <Modal title="Booking details" confirmLoading={isBookingOnProgress}
                visible={isBookingDetailsModalVisible} 
                onOk={onBook}
                onCancel={toggleBookingDetails}
                okText="Confirm & Book"
                closable={false}
                okButtonProps={{
                    size: "large",
                    shape: "round"
                }}
                cancelButtonProps={{
                    size: "large",
                    shape: "round"
                }}
                cancelText="Cancel">

                <Card className="book-card">
                    <h5>Service</h5>
                    <Tag color="green">{get(selectedService, 'type.title', "")}</Tag>
                    <div>{selectedService.title}</div>
                    <div className="text-muted">{selectedService.description}</div>
                    <div><strong>£{selectedService.price_in_gbp}</strong> – Duration: ~{selectedService.duration_in_mins}mins</div>
                    <div>For 1 person</div>

                    <hr/>

                    <Row gutter={12}>
                        { selectedBarber.photo_url && (
                            <Col>
                                <Avatar size='large' src={selectedBarber.photo_url} />
                            </Col>
                        ) }
                        <Col>
                            <h5 className="mb-2">Barber</h5>
                            <div>{selectedBarber.name}</div>
                        </Col>
                    </Row>

                    <hr/>

                    <h5>Date & Time</h5>
                    <div>Date: <strong>{selectedDate.format("ddd, DD MMMM, YYYY")}</strong></div>
                    <div>Time: <strong>{selectedTime}</strong></div>
                </Card>

                <div className="mt-4">
                    <h6>Add a note <small>(optional)</small>:</h6>
                    <Input.TextArea placeholder="anything else we should know?" onChange={(e) => setBookingNote(e.target.value)} value={bookingNote} showCount maxLength={255} />
                </div>
            </Modal>

        </div>
    );
};
export default Book;