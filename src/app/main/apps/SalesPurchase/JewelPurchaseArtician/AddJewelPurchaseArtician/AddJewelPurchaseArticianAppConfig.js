import React from 'react';
export const AddJewelPurchaseArticianAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addarticianjewellerypurchase',
            component: React.lazy(() => import('./AddJewelPurchaseArtician'))
        }
    ]
};
