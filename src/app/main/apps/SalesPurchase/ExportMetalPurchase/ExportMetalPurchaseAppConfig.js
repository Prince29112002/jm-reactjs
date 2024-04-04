import React from 'react';
export const ExportMetalPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/exportmetalpurchase',
            component: React.lazy(() => import('./ExportMetalPurchase'))
        }
    ]
};
