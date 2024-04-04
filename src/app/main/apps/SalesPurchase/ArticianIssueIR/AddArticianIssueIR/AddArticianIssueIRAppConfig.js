import React from 'react';
export const AddArticianIssueIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addarticianissue',
            component: React.lazy(() => import('./AddArticianIssueIR'))
        }
    ]
};
