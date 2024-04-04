import React from 'react';

export const RetailerMasterAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/retailermaster",
            component: React.lazy(() => import('./RetailerMaster'))
        }
    ]
};


