import React from 'react';

export const AddPrimaryAllocationAppConfig = {
    settings: {
        layout: {
            config: {

            }
        }
    },
    routes: [
        {
            path: "/dashboard/mobappadmin/addprimaryallocation",
            component: React.lazy(() => import('./AddPrimaryAllocation'))
        }
    ]
};


