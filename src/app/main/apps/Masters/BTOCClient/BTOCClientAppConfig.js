import React from 'react';

export const BTOCClientAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/masters/btocclient",
            component: React.lazy(() => import('./BTOCClient'))
        }
    ]
};


