import React from 'react';

export const EditVendorAppCofig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/editvendor',
            component: React.lazy(() => import('./EditVendor'))
        }
    ]
};
