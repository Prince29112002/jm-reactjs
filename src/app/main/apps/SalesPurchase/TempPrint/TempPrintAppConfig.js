import React from 'react';
export const TempPrintAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/tempPrint',
            component: React.lazy(() => import('./TempPrint'))
        }
    ]
};
