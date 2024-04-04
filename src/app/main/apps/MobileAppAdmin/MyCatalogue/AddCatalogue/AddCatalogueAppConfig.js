import React from 'react';

export const AddCatalogueAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/addcatalogue",
            component: React.lazy(() => import('./AddCatalogue'))
        }
    ]
};


