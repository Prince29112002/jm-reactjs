import React from 'react';
export const MetalPurchaseRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/metalpurchaseretailer',
            component: React.lazy(() => import('./MetalPurchaseRetailer'))
        }
    ]
};
