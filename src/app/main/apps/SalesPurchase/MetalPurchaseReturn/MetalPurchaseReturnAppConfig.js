import React from 'react';
export const MetalPurchaseReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/metalpurchasereturn',
            component: React.lazy(() => import('./MetalPurchaseReturn'))
        }
    ]
};
