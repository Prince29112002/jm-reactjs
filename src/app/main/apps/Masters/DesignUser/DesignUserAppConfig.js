import React from 'react';

export const DesignUserAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/designuser',
            component: React.lazy(() => import('./DesignUser'))
        }
    ]
};
