import React from 'react';

export const DistributorMasterAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/distributormaster",
            component: React.lazy(() => import('./DistributorMaster'))
        }
    ]
};


