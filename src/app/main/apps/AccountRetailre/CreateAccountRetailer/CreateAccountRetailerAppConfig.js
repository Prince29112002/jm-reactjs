import React from 'react';

export const CreateAccountRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/createaccountretailer',
            component: React.lazy(() => import('./CreateAccountRetailer'))
        }
    ]
};
