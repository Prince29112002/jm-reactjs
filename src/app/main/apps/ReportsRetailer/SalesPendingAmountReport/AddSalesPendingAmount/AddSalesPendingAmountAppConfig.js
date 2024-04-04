import React from 'react';
export const AddSalesPendingAmountAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/udhaaramountreports/addudhaaramount',
            component: React.lazy(() => import('./AddSalesPendingAmount'))
        }
    ]
};
