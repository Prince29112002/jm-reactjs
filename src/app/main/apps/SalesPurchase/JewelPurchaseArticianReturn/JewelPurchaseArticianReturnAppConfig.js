import React from 'react';
export const JewelPurchaseArticianReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/articianjewellerypurchasereturn',
            component: React.lazy(() => import('./JewelPurchaseArticianReturn'))
        }
    ]
};
