import React from 'react';
export const AddMetalPurchaseRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/metalpurchaseretailer/addmetalpurchaseretailer',
            component: React.lazy(() => import('./AddMetalPurchaseRetailer'))
        }
    ]
};


