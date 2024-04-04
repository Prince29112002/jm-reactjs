import React from 'react';

export const MyCatalogueAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/mycatalogue",
            component: React.lazy(() => import('./MyCatalogue'))
        }
    ]
};


