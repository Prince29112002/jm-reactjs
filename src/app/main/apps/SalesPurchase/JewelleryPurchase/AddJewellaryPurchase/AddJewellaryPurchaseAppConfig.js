import React from 'react';
export const AddJewellaryPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addjewellerypurchase',
            component: React.lazy(() => import('./AddJewellaryPurchase'))
        }
    ]
};
