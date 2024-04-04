import React from 'react';

export const VendorRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/vendorretailer',
            component: React.lazy(() => import('./VendorRetailer'))
        }
    ]
};
