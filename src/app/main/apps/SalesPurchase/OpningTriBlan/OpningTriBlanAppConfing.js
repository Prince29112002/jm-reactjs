import React from 'react';
export const OpningTriBlanAppConfing = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/OpningTriBlan',
            component: React.lazy(() => import('./OpningTriBlan'))
        }
    ]
};
