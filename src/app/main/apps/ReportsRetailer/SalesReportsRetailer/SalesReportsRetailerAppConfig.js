import React from 'react';
export const SalesReportsRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/salesreportsretailer',
            component: React.lazy(() => import('./SalesReportsRetailer'))
        }
    ]
};
