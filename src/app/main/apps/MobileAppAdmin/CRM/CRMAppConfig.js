import React from 'react';

export const CRMAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/crm",
            component: React.lazy(() => import('./CRM'))
        },
    ]
};


