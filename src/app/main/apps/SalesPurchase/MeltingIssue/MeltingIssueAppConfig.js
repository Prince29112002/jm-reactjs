import React from 'react';
export const MeltingIssueAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/meltingissue',
            component: React.lazy(() => import('./MeltingIssue'))
        }
    ]
};
