import React from 'react';
export const ArticianIssueIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/articianissue',
            component: React.lazy(() => import('./ArticianIssueIR'))
        }
    ]
};
