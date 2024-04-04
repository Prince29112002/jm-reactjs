import React from 'react';
export const AddMeltingReceiveAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/meltingreceive/addmeltingreceive',
            component: React.lazy(() => import('./AddMeltingReceive'))
        }
    ]
};
