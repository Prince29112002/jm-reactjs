import React from 'react';

export const TagSystemAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/TagSystem',
            component: React.lazy(() => import('./TagSystem'))
        }
    ]
};
