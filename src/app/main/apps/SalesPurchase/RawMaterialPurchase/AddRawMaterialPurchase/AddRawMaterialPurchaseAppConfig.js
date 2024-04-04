import React from 'react';
export const AddRawMaterialPurchaseAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addrawmaterialpurchase',
            component: React.lazy(() => import('./AddRawMaterialPurchase'))
        }
    ]
};
