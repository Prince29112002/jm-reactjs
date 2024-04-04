import React from 'react';
export const AddMetalPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addmetalpurchase',
            component: React.lazy(() => import('./AddMetalPurchase'))
        }
    ]
};
