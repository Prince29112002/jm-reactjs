import React from 'react';
export const ToolsConsumptionAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/toolsconsumption',
            component: React.lazy(() => import('./ToolsConsumption'))
        }
    ]
};
