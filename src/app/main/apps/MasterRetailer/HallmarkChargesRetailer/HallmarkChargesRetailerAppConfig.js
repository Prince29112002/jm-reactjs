import React from 'react';

export const HallmarkChargesRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/hallmarkchargesretailer',
            component: React.lazy(() => import('./HallmarkChargesRetailer'))
        }
    ]
};
