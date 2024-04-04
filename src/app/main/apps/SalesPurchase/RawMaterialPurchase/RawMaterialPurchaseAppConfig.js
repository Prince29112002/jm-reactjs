import React from 'react';
export const RawMaterialPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/rawmaterialpurchase',
            component: React.lazy(() => import('./RawMaterialPurchase'))
        }
    ]
};
