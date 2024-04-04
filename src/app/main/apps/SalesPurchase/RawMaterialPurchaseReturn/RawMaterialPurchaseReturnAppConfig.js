import React from 'react';
export const RawMaterialPurchaseReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/rawmaterialpurchasereturn',
            component: React.lazy(() => import('./RawMaterialPurchaseReturn'))
        }
    ]
};
