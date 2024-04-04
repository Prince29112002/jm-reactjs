import React from 'react';

export const AddSalesManAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/addsalesman',
            component: React.lazy(() => import('./AddSalesMan'))
        }
    ]
};
