import React from 'react';

export const AddClientChainRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/clientschainretailer/addclientchainretailer',
            component: React.lazy(() => import('./AddClientChainRetailer'))
        }
    ]
};
