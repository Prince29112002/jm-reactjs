import React from 'react';

export const AddRateFixClientAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addrateClient',
            component: React.lazy(() => import('./AddRateFixClient'))
        }
    ]
};
