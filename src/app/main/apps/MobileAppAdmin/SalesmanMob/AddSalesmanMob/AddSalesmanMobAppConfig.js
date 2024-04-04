import React from 'react';

export const AddSalesmanMobAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/addsalesman",
            component: React.lazy(() => import('./AddSalesmanMob'))
        }
    ]
};


