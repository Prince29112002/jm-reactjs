import React from 'react';

export const AddSalesmanRetailerAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/mastersretailer/Salesmanretailer/addsalesmanretailer',
            component: React.lazy(() => import('./AddSalesmanRetailer'))
        }
    ]
};
