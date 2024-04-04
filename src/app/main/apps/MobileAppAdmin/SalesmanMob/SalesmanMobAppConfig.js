import React from 'react';

export const SalesmanMobAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/salesman",
            component: React.lazy(() => import('./SalesmanMob'))
        }
    ]
};


