import React from 'react';
export const RepairedIssToJobWorAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/repairedisstojobwor',
            component: React.lazy(() => import('./RepairedIssToJobWor'))
        }
    ]
};
