import React from 'react';

export const AddDisCatalogueAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/addDiscatalogue",
            component: React.lazy(() => import('./AddDisCatalogue'))
        }
    ]
};


