import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';



const NoMatch = () => {
    return (
        <div className="text-center mt-5">
            <h1 className="display-1 font-weight-bold mb-0 text-danger">404</h1>
            <h1 className="text-muted">Page Not Found</h1>
            <Link exact to="/">
                <Button type="dashed" shape="round"><HomeOutlined /> Go back home</Button>
            </Link>
            
        </div>
    );
};

export default NoMatch;