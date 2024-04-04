import React from 'react';

export const StockGroupRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/stockgroupretailer',
            component: React.lazy(() => import('./StockGroupRetailer'))
        }
    ]
};
