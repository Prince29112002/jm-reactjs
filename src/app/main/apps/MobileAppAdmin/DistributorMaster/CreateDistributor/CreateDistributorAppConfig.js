import React from 'react';

export const CreateDistributorAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/createdistributor",
            component: React.lazy(() => import('./CreateDistributor'))
        }
    ]
};


