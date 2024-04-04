import React from 'react';

export const OrderDetailsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/orders/orderView",
            component: React.lazy(() => import('./OrderDetails'))
        }
    ]
};


