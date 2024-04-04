import React from 'react';
export const AddMeltingIssueAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/meltingissue/addmeltingissue',
            component: React.lazy(() => import('./AddMeltingIssue'))
        }
    ]
};
