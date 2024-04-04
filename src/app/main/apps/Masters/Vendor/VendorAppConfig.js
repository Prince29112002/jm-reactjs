import React from 'react';

export const VendorAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/vendors',
            component: React.lazy(() => import('./Vendor'))
        }
    ]
};
