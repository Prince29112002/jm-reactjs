import React from 'react';

export const AnniversaryListAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/anniversarylist",
            component: React.lazy(() => import('./AnniversaryList'))
        }
    ]
};
