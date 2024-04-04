import React from 'react';
export const AddFixedSalesRetalierAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesretalier/addfixedsales',
            component: React.lazy(() => import('./AddFixedSalesRetailer'))
        }
    ]
};
