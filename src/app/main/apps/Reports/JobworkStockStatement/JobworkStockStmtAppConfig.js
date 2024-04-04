import React from 'react';
export const JobworkStockStmtAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reports/jobworkstmt',
            component: React.lazy(() => import('./JobworkStockStatement'))
        }
    ]
};
