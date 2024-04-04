import React from 'react';

export const EditSalesManAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/editsalesman',
            component: React.lazy(() => import('./EditSalesMan'))
        }
    ]
};
