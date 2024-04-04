import React from 'react';

export const StockNameRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/stocknameretailer',
            component: React.lazy(() => import('./StockNameRetailer'))
        }
    ]
};
