import React from 'react';

export const SchemeAppCofig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/scheme',
            component: React.lazy(() => import('./Scheme'))
        }
    ]
};
