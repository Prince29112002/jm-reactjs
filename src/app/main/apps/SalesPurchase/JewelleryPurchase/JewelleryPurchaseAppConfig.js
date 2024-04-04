import React from 'react';
export const JewelleryPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/jewellerypurchase',
            component: React.lazy(() => import('./JewelleryPurchase'))
        }
    ]
};
