import React from 'react';
import { Collapse, List, Avatar, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import FacialTreatmentSVG from '../../images/facial_treatment.svg';
import JustBeardSVG from '../../images/just_beard.svg';
import HairAndBeardSVG from '../../images/hair_and_beard.svg';
import JustHairSVG from '../../images/just_hair.svg';
import DefaultServiceTypeSVG from '../../images/default_service_type.svg';

const Services = ({ serviceTypes, onServiceSelected, selectedService }) => {

    const handleServiceSelection = (service) => {
        onServiceSelected(service);
    };

    const panels = () => {
        return serviceTypes.map((serviceType) => {
            let avatarSrc;
            switch (serviceType.type) {
                case "Just Hair":
                    avatarSrc = JustHairSVG;
                    break;

                case "Just Beard":
                    avatarSrc = JustBeardSVG;
                    break;

                case "Facial Treatments":
                    avatarSrc = FacialTreatmentSVG;
                    break;

                case "Hair & Beard":
                    avatarSrc = HairAndBeardSVG;
                    break;
            
                default:
                    avatarSrc = DefaultServiceTypeSVG;
                    break;
            }

            return (
                <Collapse.Panel  style={{ background: "white" }} extra={ (selectedService.title && serviceType.type == selectedService.type.title) ? <Tag icon={<CheckCircleOutlined />} color="green">{selectedService.title}</Tag> : "" } header={serviceType.type} key={serviceType.type}>
                    <List 
                        split={false}
                        itemLayout="horizontal"
                        dataSource={serviceType.services}
                        renderItem={service => (
                            <List.Item onClick={() => handleServiceSelection(service)} className={`gato-list-item mb-2  ${ selectedService.id == service.id ? 'active' : '' }`} key={service.id}>
                                <List.Item.Meta
                                    avatar={<Avatar src={avatarSrc} />}
                                    title={<strong>{service.title}</strong>}
                                    description={(
                                        <>
                                            <div>{service.description}</div>
                                            <strong className="text-dark">£{service.price_in_gbp}</strong>
                                        </>
                                    )}
                                />
                            </List.Item>
                        )}
                    />
                </Collapse.Panel>
            );
        });
    };

    return (
        <>
            <h1>Service</h1>
            <p>Choose one</p>
            <Collapse accordion>
                { panels() }
            </Collapse>
        </>
    );
};

export default Services;
