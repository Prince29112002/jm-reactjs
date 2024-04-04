import React from 'react';

export const GoldRateRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/goldrateretailer',
            component: React.lazy(() => import('./GoldRateRetailer'))
        }
    ]
};
