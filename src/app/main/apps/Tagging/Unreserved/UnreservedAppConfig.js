import React from 'react';
export const UnreservedAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/unreserved',
            component: React.lazy(() => import('./Unreserved'))
        }
    ]
};
