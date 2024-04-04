import React from 'react';

export const CategoriesAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/categories",
            component: React.lazy(() => import('./Categories'))
        }
    ]
};


