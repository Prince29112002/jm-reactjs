import React from 'react';

export const HallmarkIssuedListkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/hallmark/issuetohallmarklist',
            component: React.lazy(() => import('./HallmarkIssuedList'))

        }
    ]
};
