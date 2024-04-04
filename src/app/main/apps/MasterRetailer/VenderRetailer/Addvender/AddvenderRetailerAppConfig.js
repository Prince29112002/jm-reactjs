import React from 'react';

export const AddvenderRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/vendorretailer/addvendorretailer',
            component: React.lazy(() => import('./AddVenderRetailer'))
        }
    ]
};
