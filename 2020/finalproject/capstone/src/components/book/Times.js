import React, { useState, useEffect } from 'react';
import { Radio, Row, Col } from 'antd';
import moment from 'moment';
import toast from 'react-hot-toast';
import { get } from 'lodash';

const Time = ({ selectedDate, selectedTime, selectedBarber, onTimeSelected }) => {

    const [timeSlots, setTimeSlots] = useState([]);
    const [bookedHours, setBookedHours] = useState([]);
    const [open, setOpen] = useState(true);

    /**
     * Generate available time slots of 15mins intervals 
     * between business opening and closing time for the selected date and day
     */
    const generateAvailableTimeSlots = (businessHours) => {
        // First we get the day of the selected date.
        const day = selectedDate.day();
        // And we filter only the business hours for the selected day
        const businessHoursForSelectedDay = businessHours[day];
        // Grab the opening and closing time for the selected day, according to our business hours for the day
        const { opening_time, closing_time } = businessHoursForSelectedDay;

        // Check if the shop is open on this day
        if (opening_time && closing_time) {
            // Shop is open on this day
            // Generate the 15mins intervals between 
            const opening_time_hour = moment(opening_time, "HH:mm").hour();
            const closing_time_hour = moment(closing_time, "HH:mm").hour();

            const START = moment(selectedDate).hour(opening_time_hour).minute(0).format("HH:mm");
            const END = moment(selectedDate).hour(closing_time_hour).minute(0).format("HH:mm");
            const allSlots = getTimeSlotsFor(START, END);
            // Now subtract the booked hours
            // const onlyAvailableSlots = allSlots.filter(time => !bookedHours.includes(time));
            // group into time of day
            const groupedAvailableSlots = groupSlotsByTimeOfDay(allSlots);
            setTimeSlots(groupedAvailableSlots);

        } else {
            // Shop is closed on this day
            toast("🏝 Sorry, our barber shop is closed on this day!");
        }
    };

    function getTimeSlotsFor(start, end) {
        const startTime = moment(start, 'HH:mm');
        const endTime = moment(end, 'HH:mm');

        const stops = [];
        while (startTime.isBefore(endTime)) {
            stops.push(startTime.format('HH:mm'));
            startTime.add(15, 'minutes');
        }
        return stops;
    }


    const groupSlotsByTimeOfDay = (slots) => {
        const stops = [];
        const morningStops = { name: "Morning", slots: [] };
        const afternoonStops = { name: "Afternoon", slots: [] };
        const eveningStops = { name: "Evening", slots: [] };

        slots.forEach(time => {
            const hour = moment(time, 'HH:mm').hour();
            if (hour >= 3 && hour < 12) {
                // Morning
                morningStops.slots.push(time);

            } else if (hour > 11 && hour < 16){
                // Afternoon                    
                afternoonStops.slots.push(time);
                
            }   else if (hour > 15){
                // Evening
                eveningStops.slots.push(time);
            }
        });
        stops.push(morningStops, afternoonStops, eveningStops);
        return stops;
    };


    const isShopStillOpen = (businessHours) => {
        const today = moment();
        const selected = moment(selectedDate, "DD/MM/YYYY");
        if (selected.isSame(today, 'days')) {
            const dayOfWeek = today.day();
            const todayClosingTime = moment(businessHours[dayOfWeek].closing_time, "HH:mm");

            if (today.isAfter(todayClosingTime)) {
                // Closed
                // closing time has passed.
                return false;
            }
        }
        // Open
        return true;
    };


    useEffect(() => {
        // Fetch for the business hours and the booked hours so we can show all available time slots
        const url_businesshours = "/api/businesshours";

        fetch(url_businesshours)
            .then(res => res.json())
            .then(res => {
                const businessHours = res.data; // got business hours

                const queryParams = new URLSearchParams({ 
                    barber_id: get(selectedBarber, 'id', ""), 
                    date: selectedDate.format("DD/MM/YYYY") 
                });
                const url_bookings = `/api/bookings?${queryParams.toString()}`;
                fetch(url_bookings)
                    .then(res => res.json())
                    .then(res => {
                        const bookingsOnThisDate = res.data;
                        const bh = bookingsOnThisDate.filter(booking => !["canceled", "rejected", "done"].includes(booking.status))
                                        .map(booking => booking.time);
                        setBookedHours(bh);

                        // Check if the shop is still
                        const open = isShopStillOpen(businessHours);
                        setOpen(open);
                        if (!open) {
                            return; // no need to generate time slots bellow.
                        }
                        
                        // Now that we have the two things, we can generate the available time slots
                        generateAvailableTimeSlots(businessHours, bookedHours);
                    });
            });

        // setBusinessHours(res.data);
        // generateDefaultTimeSlots(res.data);
        // setLoading(false);
    }, []);


    const handleTimeSelection = (e) => {
        onTimeSelected(e.target.value);
    };

    const renderTimes = () => {
        return timeSlots.map(timeSlot => {
            return (
                <div key={timeSlot.name} className="mt-3">
                    <h6 className="mb-0">{timeSlot.name}</h6>
                    { timeSlot.slots.map(time => {
                        // Check to see if selected date is today, so we can disable
                        // times that have passed.
                        let timeIsPast = false;
                        if (selectedDate.isSameOrBefore(moment(), "day")) {
                            // Check to see if current time has passed.
                            timeIsPast = moment().isSameOrAfter(moment(time, "HH:mm"));
                        }
                        // until here
                        return <Radio.Button disabled={timeIsPast || bookedHours.includes(time)} key={time} className="m-2" value={time}>{time}</Radio.Button>;
                    }) }
                </div>
            );
        });
    };


    if (!open) {
        return (
            <div>
                <h4 className="mb-0">Sorry, we are already closed today!</h4>
                <small>We are not taking bookings for today anymore</small>
                <p>Go back and select another date</p>
            </div>
        );
    }
    return (
        <div>
            <Radio.Group onChange={handleTimeSelection} value={selectedTime} buttonStyle="solid" size="large">
                { renderTimes() }
            </Radio.Group>
        </div>
    );
};

export default Time;
