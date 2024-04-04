import React from 'react';
export const AddConsumablePurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addconsumablepurchase',
            component: React.lazy(() => import('./AddConsumablePurchase'))
        }
    ]
};
