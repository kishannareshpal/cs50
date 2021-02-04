import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import useUser from '../hooks/useUser';
import BarberIllustration from '../images/barber-illustration.png';
import { ArrowRightOutlined, CalendarOutlined, InfoCircleOutlined, MailTwoTone, PhoneTwoTone } from '@ant-design/icons';
import { Button, Card } from 'antd';
import moment from 'moment';
import EmailValidator from '../utils/EmailValidator';



const Home = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [businessHours, setBusinessHours] = useState([]);
    const [redirectUrl, setRedirectUrl] = useState();
    const [today, setToday] = useState(moment().day());
    const {user, isAuthenticated} = useUser();
    

    useEffect(() => {
        fetch("/api/businesshours")
            .then(res => res.json())
            .then(({ data }) => {
                setBusinessHours(data);
                
            });

    }, []);


    const handleBookNow = () => {
        setError("");
        if (isAuthenticated) {
            // Redirect to booking page
            setRedirectUrl("/book");
            return;
        }

        // Check to see if the email address is well formed
        const isEmailWellFormed = EmailValidator(email);
        if (!isEmailWellFormed) {
            // Not well formed
            setError("Please enter a valid email address");
            return;
        }
    
        const queryParams = new URLSearchParams({
            email
        });

        fetch(`/api/users?${queryParams.toString()}`)
            .then(res => {
                if (res.status == 200) {
                    // Existing user. Login
                    const qp = new URLSearchParams({
                        email,
                        tab: "login",
                        next: "/book"
                    });
                    setRedirectUrl(`/session?${qp.toString()}`);

                } else if (res.status == 404) {
                    // New user. Register
                    const qp = new URLSearchParams({
                        email,
                        tab: "register",
                        next: "/book"
                    });
                    setRedirectUrl(`/session?${qp.toString()}`);
                    
                }
            });
    };


    const handleManage = () => {
        setRedirectUrl("/manage");
    };


    function businessHoursRows() {
        return businessHours.map((bh) => (
            <tr key={bh.id}>
                <th>
                    { bh.day_name }
                    { today == bh.day && <span className="ml-2 p-1 badge bg-danger text-light ">Today!!</span>}
                </th>

                { (bh.opening_time == null && bh.closing_time == null) ? (
                    <td colSpan="2" className="text-center text-warning font-weight-bold">
                        We're Closed
                    </td>
                ) : (
                    <>
                        <td>
                            { bh.opening_time }
                        </td>
                        <td>
                            { bh.closing_time }
                        </td>
                    </>
                )}

            </tr>
        ));
    }


    
    return redirectUrl ? (
        <Redirect to={redirectUrl} />

    ) : (
        <div className="container">
            <div className="row align-items-center">
                <div className="col-12 col-md-6">
                    <h1 className="font-weight-bold mb-0">Welcome { isAuthenticated && ("back") } to</h1>
                    <h1 className="font-weight-bold text-danger mb-0">GATO</h1>
                    <p className="text-muted"><i>Barbering at it's best</i></p>
                    <p>
                        Are you looking for a fresh new look?<br/>
                        Come experience a time when caring for your hair was masculine and part of being a man.
                    </p>


                    <div className="my-3">
                        { !isAuthenticated ? (
                            <>
                                <input className={`form-control ${error ? 'is-invalid' : ''}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    aria-describedby="emailBook" />

                                { error && (
                                    <div className="text-danger">
                                        <small>
                                            Please enter a valid email address.
                                        </small>
                                    </div>
                                ) }
                                <div className="text-muted">
                                    <small>
                                        <InfoCircleOutlined /> We'll just ask you to create an account if you don't have one already.
                                    </small>
                                </div>
                            </>
                        ) : (
                            <h4>😉 Hi {user.fullname}</h4>
                        )}
                    </div>


                    { user.is_staff ? (
                        <Button icon={<ArrowRightOutlined />} onClick={handleManage} type="primary" danger shape="round" size='large'>
                            Manage
                        </Button>

                    ) : (
                        <Button icon={<CalendarOutlined />} onClick={handleBookNow} danger shape="round" size='large'>
                            Book now
                        </Button>
                    ) }

                    

                </div>
                <div className="col">
                    <img width="100%" src={BarberIllustration} alt="Barber illustration"/>
                </div>
            </div>

            
            <hr/>

            <div className="mt-5">
                <h3 className="text-center font-weight-bold">LOCATION</h3>
                <iframe width="100%" height="450" style={{ border: 0 }}
                    src="https://www.google.com/maps/embed/v1/view?zoom=17&center=51.5407,-0.1430&key=AIzaSyAvUhoArYbymxI6g7tmK6-ssFNMr3Lbpfo" 
                    allowFullScreen />
            </div>

            <div className="mt-5">
                <h3 className="text-center font-weight-bold">OPENING TIMES</h3>
                <p className="text-center text-muted">These are our normal business hours</p>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Opens at</th>
                            <th>Closes at</th>
                        </tr>
                    </thead>
                    <tbody>
                        { businessHoursRows() }
                    </tbody>
                </table>
            </div>


            <div className="mt-5">
                <h3 className="text-center font-weight-bold mb-0">CONTACT US</h3>
                <p className="text-center">Get in touch</p>

                <div className="row justify-content-center">
                    <div className="col-auto my-2">
                        <div className="card-body d-inline-block" style={{ borderRadius: '12px', background: 'ghostwhite' }}>
                            <MailTwoTone />
                            <h5 className="mb-0"><strong>Email</strong></h5>
                            <p className="mb-0"><a href="mailto:staff@gato.co.uk">staff@gato.co.uk</a></p>
                        </div>
                    </div>
                    <div className="col-auto my-2">
                        <div className="card-body d-inline-block" style={{ borderRadius: '12px', background: 'ghostwhite' }}>
                            <PhoneTwoTone />
                            <h5 className="mb-0"><strong>Phone</strong></h5>
                            <p className="mb-0"><a href="tel:07812345671">07812345671</a></p>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    );
};
export default Home;
