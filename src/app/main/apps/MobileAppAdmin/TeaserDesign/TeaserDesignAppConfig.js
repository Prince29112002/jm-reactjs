import React from 'react';

export const TeaserDesignAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/teaserdesign",
            component: React.lazy(() => import('./TeaserDesign'))
        }
    ]
};


