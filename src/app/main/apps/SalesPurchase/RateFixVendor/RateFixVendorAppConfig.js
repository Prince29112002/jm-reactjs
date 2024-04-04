import React from 'react';
export const RateFixVendorAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/ratefixvendor',
            component: React.lazy(() => import('./RateFixVendor'))
        }
    ]
};
