import React from 'react';
export const JobWorkChainStockStatementRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/JobWorkchainstockstatementretailer',
            component: React.lazy(() => import('./JobWorkChainStockStatementRetailer'))
        }
    ]
};
