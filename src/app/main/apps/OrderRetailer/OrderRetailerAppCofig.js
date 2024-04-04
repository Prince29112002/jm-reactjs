import React from 'react';

export const OrderRetailerAppCofig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/orderretailer',
            component: React.lazy(() => import('./OrderRetailer'))
        }
    ]
};
