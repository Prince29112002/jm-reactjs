import React from 'react';
export const AddToolsConsumptionAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addtoolsconsumption',
            component: React.lazy(() => import('./AddToolsConsumption'))
        }
    ]
};
