import React from 'react';
export const AddJewellaryPurchaseReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addjewellerypurchasereturn',
            component: React.lazy(() => import('./AddJewellaryPurchaseReturn'))
        }
    ]
};
