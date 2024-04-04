import React from 'react';
export const AddSalesReturnDomesticAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addsalesreturndomestic',
            component: React.lazy(() => import('./AddSalesReturnDomestic'))
        }
    ]
};
