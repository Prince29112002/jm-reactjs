import React from 'react';

export const HSNMastersRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/hsnmastersretailer',
            component: React.lazy(() => import('./HSNMastersRetailer'))
        }
    ]
};
