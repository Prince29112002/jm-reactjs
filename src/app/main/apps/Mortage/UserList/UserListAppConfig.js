import React from 'react';

export const UserListAppCofig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/userlists',
            component: React.lazy(() => import('./UserList'))
        }
    ]
};
