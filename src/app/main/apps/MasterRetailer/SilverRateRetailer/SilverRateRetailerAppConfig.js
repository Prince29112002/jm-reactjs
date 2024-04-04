import React from 'react';

export const SilverRateRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/silverrateretailer',
            component: React.lazy(() => import('./SilverRateRetailer'))
        }
    ]
};
