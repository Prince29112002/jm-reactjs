import React from 'react';

export const SalesMenAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/salesman',
            component: React.lazy(() => import('./SalesMen'))
        }
    ]
};
