import React from 'react';
export const AddSalesReturnJobworkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addsalesreturnjobwork',
            component: React.lazy(() => import('./AddSalesReturnJobwork'))
        }
    ]
};
