import React from 'react';

export const ClientListChainRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/clientschainretailer',
            component: React.lazy(() => import('./ClientListChainRetailer'))
        }
    ]
};
