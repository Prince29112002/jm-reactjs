import React from 'react';

export const PrimaryAllocationAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/primaryallocation",
            component: React.lazy(() => import('./PrimaryAllocation'))
        }
    ]
};


