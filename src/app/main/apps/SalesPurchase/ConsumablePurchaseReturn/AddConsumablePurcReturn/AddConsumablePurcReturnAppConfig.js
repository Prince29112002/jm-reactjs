import React from 'react';
export const AddConsumablePurcReturnAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addconsumablepurchasereturn',
            component: React.lazy(() => import('./AddConsumablePurcReturn'))
        }
    ]
};
