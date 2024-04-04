import React from 'react';
export const AddExportMetalPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addexportmetalpurchase',
            component: React.lazy(() => import('./AddExportMetalPurchase'))
        }
    ]
};
