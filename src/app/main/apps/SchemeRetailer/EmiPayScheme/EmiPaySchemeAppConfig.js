import React from 'react';

export const EmiPaySchemeAppCofig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/scheme/emipay',
            component: React.lazy(() => import('./EmiPayScheme'))
        }
    ]
};
