import React from 'react';

export const UpdateBrandingsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/updatebrandings",
            component: React.lazy(() => import('./UpdateBrandings'))
        }
    ]
};


