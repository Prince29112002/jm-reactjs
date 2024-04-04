import React from 'react';

export const MortageAppCofig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mortage',
            component: React.lazy(() => import('./Mortage'))
        }
    ]
};
