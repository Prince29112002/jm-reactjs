import React from 'react';
export const JewelleryPurchaseReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/jewellerypurchasereturn',
            component: React.lazy(() => import('./JewelleryPurchaseReturn'))
        }
    ]
};
