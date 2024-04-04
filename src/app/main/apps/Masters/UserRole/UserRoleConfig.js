import React from 'react';

export const UserRoleAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/userrole',
            component: React.lazy(() => import('./UserRole'))
        }
    ]
};
