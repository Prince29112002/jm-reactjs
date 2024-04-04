import React from 'react';

export const EditCRMAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/crm/editcrm",
            component: React.lazy(() => import('./EditCRM'))
        },
    ]
};


