import React from 'react';
export const ConsumablePurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/consumablepurchase',
            component: React.lazy(() => import('./ConsumablePurchase'))
        }
    ]
};
