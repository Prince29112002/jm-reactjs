import React from 'react';

export const SalesmanRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/Salesmanretailer',
            component: React.lazy(() => import('./SalesmanRetailer'))
        }
    ]
};
