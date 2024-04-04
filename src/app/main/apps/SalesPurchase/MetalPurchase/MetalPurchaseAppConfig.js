import React from 'react';
export const MetalPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/metalpurchase',
            component: React.lazy(() => import('./MetalPurchase'))
        }
    ]
};
