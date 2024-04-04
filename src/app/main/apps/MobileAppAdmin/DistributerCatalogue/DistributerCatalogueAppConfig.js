import React from 'react';

export const DistributerCatalogueAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/distributercatalogue",
            component: React.lazy(() => import('./DistributerCatalogue'))
        }
    ]
};


