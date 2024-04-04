import React from 'react';
export const ConsumablePurchaseReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/consumablepurchasereturn',
            component: React.lazy(() => import('./ConsumablePurchaseReturn'))
        }
    ]
};
