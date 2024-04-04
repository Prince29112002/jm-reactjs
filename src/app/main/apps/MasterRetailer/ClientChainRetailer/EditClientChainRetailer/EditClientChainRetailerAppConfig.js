import React from 'react';

export const EditClientChainRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/editclientchainretailer',
            component: React.lazy(() => import('./EditClientChainRetailer'))
        }
    ]
};
