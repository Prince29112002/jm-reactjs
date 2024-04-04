import React from 'react';
export const ProductDevelopmentAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/design/productevelopment',
            component: React.lazy(() => import('./ProductDevelopment'))
        }
    ]
};
