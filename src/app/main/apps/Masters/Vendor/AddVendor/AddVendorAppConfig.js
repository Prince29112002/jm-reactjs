import React from 'react';

export const AddVendorAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/addvendor',
            component: React.lazy(() => import('./AddVendor'))
        }
    ]
};
