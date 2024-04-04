import React from 'react';

export const StockGroupAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/stockgroup',
            component: React.lazy(() => import('./StockGroup'))
        }
    ]
};
