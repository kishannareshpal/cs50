import React from 'react';
import { Tag } from 'antd';
import { capitalize } from 'lodash';

const StatusTag = ({ status }) => {

    const tagColor = () => {
        if (status == 'accepted') {
            return 'green';
        } else if (status == 'done') {
            return 'cyan';
        } else if (status == 'rejected') {
            return 'red';
        } else if (status == 'canceled') {
            return 'orange';
        } else {
            return 'blue';
        }
    };

    return (
        <Tag color={tagColor()}>
            {capitalize(status)}
        </Tag>
    );
};

export default StatusTag;
