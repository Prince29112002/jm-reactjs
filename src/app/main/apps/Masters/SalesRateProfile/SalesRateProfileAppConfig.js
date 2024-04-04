import React from 'react';

export const SalesRateProfileAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/salesrateprofile',
            component: React.lazy(() => import('./SalesRateProfile'))
        }
    ]
};
