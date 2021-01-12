import React, { useEffect, useState } from 'react';
import { List, Avatar } from 'antd';

const Barbers = ({ selectedBarber, onBarberSelected }) => {

    const [staff, setStaff] = useState([]);

    useEffect(() => {
        // Fetch all barbers (staff)
        fetch("/api/barbers")
            .then(res => res.json())
            .then(res => {
                setStaff(res.data);
            });

    }, []);


    const handleBarberSelection = (barber) => {
        onBarberSelected(barber);
    };

    return (
        <div>
            <h1>Barber</h1>
            <p className="my-4">Choose one:</p>
            <List split={false}
                dataSource={staff}
                renderItem={barber => (
                    <List.Item onClick={() => handleBarberSelection(barber)} key={barber.id} className={`gato-list-item p-4 mb-2 ${ selectedBarber.id == barber.id ? 'active' : ''}`}>
                        <List.Item.Meta avatar={ (barber.photo_url) ? (<Avatar shape='circle' size={64} src={barber.photo_url} />) : (false)}
                            title={<p>{barber.fullname}</p>}
                            description={barber.description} />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Barbers;
