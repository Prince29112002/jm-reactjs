import React from 'react';

export const CreateCompanyAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/createretailer",
            component: React.lazy(() => import('./CreateCompany'))
        }
    ]
};


