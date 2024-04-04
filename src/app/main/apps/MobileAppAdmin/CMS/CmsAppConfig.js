import React from 'react';

export const CmsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/cms",
            component: React.lazy(() => import('./CMS'))
        }
    ]
};


