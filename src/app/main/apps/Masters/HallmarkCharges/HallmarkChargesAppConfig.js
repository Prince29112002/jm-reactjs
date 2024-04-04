import React from 'react';

export const HallmarkChargesAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/hallmarkcharges',
            component: React.lazy(() => import('./HallmarkCharges'))
        }
    ]
};
