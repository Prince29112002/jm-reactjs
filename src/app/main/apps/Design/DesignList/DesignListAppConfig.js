import React from 'react';
export const DesignListAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/design/designlist',
            component: React.lazy(() => import('./DesignList'))
        }
    ]
};
