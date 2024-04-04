import React from 'react';

export const DesignerRoleAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/designerrole',
            component: React.lazy(() => import('./DesignerRole'))
        }
    ]
};
