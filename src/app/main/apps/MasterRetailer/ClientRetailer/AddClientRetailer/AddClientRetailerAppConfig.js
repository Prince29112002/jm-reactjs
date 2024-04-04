import React from 'react';

export const AddClientRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/clientsretailer/addclientretailer',
            component: React.lazy(() => import('./AddClientRetailer'))
        }
    ]
};
