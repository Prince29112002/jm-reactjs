import React from 'react';

export const ClientListRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/clientsretailer',
            component: React.lazy(() => import('./ClientListRetailer'))
        }
    ]
};
