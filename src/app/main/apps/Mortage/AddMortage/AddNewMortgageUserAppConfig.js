import React from 'react';

export const AddNewMortgageUserAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/mortage/addnewmortageuser',
            component: React.lazy(() => import('./AddNewMortgageUser'))
        }
    ]
};