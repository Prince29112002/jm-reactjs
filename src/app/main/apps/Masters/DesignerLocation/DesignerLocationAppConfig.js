import React from 'react';

export const DesignerLocationAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/designerlocation',
            component: React.lazy(() => import('./DesignerLocation'))
        }
    ]
};
