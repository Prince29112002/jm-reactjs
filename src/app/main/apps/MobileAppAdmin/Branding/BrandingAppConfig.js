import React from 'react';

export const BrandingAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/branding",
            component: React.lazy(() => import('./Branding'))
        }
    ]
};


