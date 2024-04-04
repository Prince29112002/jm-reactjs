import React from 'react';
export const JewelPurchaseArticianAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/articianjewellerypurchase',
            component: React.lazy(() => import('./JewelPurchaseArtician'))
        }
    ]
};
