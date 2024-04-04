import React from 'react';

export const AddEmployeeAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/addemployee',
            component: React.lazy(() => import('./AddEmployee'))
        }
    ]
};
