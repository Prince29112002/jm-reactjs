import React from 'react';

export const IssueToHallmarkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/hallmark/issuetohallmark',
            component: React.lazy(() => import('./IssueToHallmark'))

        }
    ]
};
