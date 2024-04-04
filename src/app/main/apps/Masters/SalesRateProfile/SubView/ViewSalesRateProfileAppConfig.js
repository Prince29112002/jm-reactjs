import React from 'react';

export const ViewSalesRateProfileAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/viewsalesrateprofile',
            component: React.lazy(() => import('./ViewSalesRateProfile'))
        }
    ]
};
