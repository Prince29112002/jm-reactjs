import React from 'react';
export const AddSalesConsumableAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/salesconsumable/addsalesconsumable',
            component: React.lazy(() => import('./AddSalesConsumable'))
        }
    ]
};
