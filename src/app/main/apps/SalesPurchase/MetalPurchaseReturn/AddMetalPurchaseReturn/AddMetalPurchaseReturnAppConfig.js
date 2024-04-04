import React from 'react';
export const AddMetalPurchaseReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addmetalpurchasereturn',
            component: React.lazy(() => import('./AddMetalPurchaseReturn'))
        }
    ]
};
