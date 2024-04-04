import React from 'react';
export const AddSalesRetalierAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesretalier/addsalesretalier',
            component: React.lazy(() => import('./AddSalesRetalier'))
        }
    ]
};
