import React from 'react';

export const AddOrderRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/orderretailer/addorderretailer',
            component: React.lazy(() => import('./AddOrderRetailer'))
        }
    ]
};
