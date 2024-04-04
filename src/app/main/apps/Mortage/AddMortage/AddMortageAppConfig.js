import React from 'react';

export const AddMortageAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mortage/addmortage',
            component: React.lazy(() => import('./AddMortage'))
        }
    ]
};
