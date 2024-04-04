
import React from 'react';
export const AddRawMatPurcReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addrawmaterialpurchasereturn',
            component: React.lazy(() => import('./AddRawMaterialPurchaseReturn'))
        }
    ]
};
