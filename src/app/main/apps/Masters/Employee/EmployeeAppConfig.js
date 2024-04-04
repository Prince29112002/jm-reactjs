import React from 'react';

export const EmployeeAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/employee',
            component: React.lazy(() => import('./Employee'))
        }
    ]
};
