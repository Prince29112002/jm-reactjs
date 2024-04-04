import React from 'react';
export const MetalLedStmtAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reports/metalledger',
            component: React.lazy(() => import('./MetalLedStatement'))
        }
    ]
};
