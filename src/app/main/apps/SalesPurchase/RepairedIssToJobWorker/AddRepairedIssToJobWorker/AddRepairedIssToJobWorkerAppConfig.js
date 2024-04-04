import React from 'react';
export const AddRepairedIssToJobWorkerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addrepairedisstojobwor',
            component: React.lazy(() => import('./AddRepairedIssToJobWorker'))
        }
    ]
};
