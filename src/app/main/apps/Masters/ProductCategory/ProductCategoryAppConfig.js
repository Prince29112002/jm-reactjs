import React from 'react';

export const ProductCategoryAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/productcategory',
            component: React.lazy(() => import('./ProductCategory'))
        }
    ]
};
