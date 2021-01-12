import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import { isEmpty } from 'lodash';


const Date = ({onDateSelected, selectedDate, setSelectedDate}) => {

    const [businessHours, setBusinessHours] = useState([]);

    useEffect(() => {
        // get business hours
        fetch("/api/businesshours")
            .then(res => res.json())
            .then(({ data }) => {
                setBusinessHours(data);
            });
    
    }, []);


    useEffect(() => {
        // If today is sunday, pre-select the next monday by default. Because the shop is closed on sundays
        if (selectedDate.day() == 0) {
            const tommorow = selectedDate.clone().add(1, 'days');
            setSelectedDate(tommorow);
        }
        
    }, [selectedDate, setSelectedDate]);


    const disabledDateFn = useCallback((current) => {
        if (current.day() === 0) {
            // If it is sunday, should be unselectable
            // closed on sundays
            return true;
        }
    }, []);


    return (
        <div>
            <h1>Date</h1>
            <p>Choose a date</p>
            <h3 className="mb-0 text-primary">{selectedDate.format('DD, MMMM YYYY')}</h3>
            <small>
                {selectedDate.calendar({
                    sameDay: '[Today]',
                    nextDay: '[Tomorrow]',
                    nextWeek: 'dddd',
                    lastDay: '[Yesterday]',
                    lastWeek: '[Last] dddd',
                    sameElse: ' '
                })}
            </small>

            <Calendar value={selectedDate}
                onSelect={onDateSelected}
                fullscreen={false}
                disabledDate={disabledDateFn} // closed on sundays
                validRange={[moment().hour(0), moment().add(2, 'year')]} // from today - +2years
                />
        </div>
    );
};

export default Date;
