import React from 'react';

export const OrdersAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/orders",
            component: React.lazy(() => import('./Orders'))
        }
    ]
};


