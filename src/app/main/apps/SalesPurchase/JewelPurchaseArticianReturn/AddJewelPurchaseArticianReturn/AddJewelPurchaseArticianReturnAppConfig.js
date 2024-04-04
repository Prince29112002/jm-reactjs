import React from 'react';
export const AddJewelPurchaseArticianReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addarticianjewellerypurchasereturn',
            component: React.lazy(() => import('./AddJewelPurchaseArticianReturn'))
        }
    ]
};
