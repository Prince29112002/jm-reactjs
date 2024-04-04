import React from 'react';
export const JobWorkStockStatementRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/JobWorkstockstatementretailer',
            component: React.lazy(() => import('./JobWorkStockStatementRetailer'))
        }
    ]
};
