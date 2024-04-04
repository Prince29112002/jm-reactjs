
import React from 'react';

export const DepartmentAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/department',
            component: React.lazy(() => import('./Department'))
        }
    ]
};
