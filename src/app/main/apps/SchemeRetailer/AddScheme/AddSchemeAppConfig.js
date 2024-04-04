import React from 'react';

export const AddSchemeAppCofig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/scheme/addscheme',
            component: React.lazy(() => import('./AddScheme'))
        }
    ]
};
