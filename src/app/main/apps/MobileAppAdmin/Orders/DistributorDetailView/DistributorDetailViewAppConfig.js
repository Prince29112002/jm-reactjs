import React from 'react';

export const DistributorDetailViewAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/orders/distributorview",
            component: React.lazy(() => import('./DistributorDetailView'))
        }
    ]
};


