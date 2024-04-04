import React from 'react';

export const AddOrderAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/orders/addorder",
            component: React.lazy(() => import('./AddOrder'))
        }
    ]
};


