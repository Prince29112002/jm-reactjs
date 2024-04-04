import React from 'react';

export const AddRateFixVendorAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addratevendor',
            component: React.lazy(() => import('./AddRateFixVendor'))
        }
    ]
};
