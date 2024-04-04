import React from 'react';
export const AddOldJewelleryPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/oldjewellerypurchase/addoldjewellerypurchase',
            component: React.lazy(() => import('./AddOldJewelleryPurchase'))
        }
    ]
};
