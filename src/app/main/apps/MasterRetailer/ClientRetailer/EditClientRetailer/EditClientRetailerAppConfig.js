import React from 'react';

export const EditClientRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/editclientretailer',
            component: React.lazy(() => import('./EditClientRetailer'))
        }
    ]
};
