import React from 'react';
export const CreateAccountAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/createaccount',
            component: React.lazy(() => import('./CreateAccount'))
        }
    ]
};
