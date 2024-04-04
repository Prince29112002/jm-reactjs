import React from 'react';

export const EditSalesmanRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/editSalesmanretailer',
            component: React.lazy(() => import('./EditSalesmanRetailer'))
        }
    ]
};
