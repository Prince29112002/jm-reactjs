import React from 'react';

export const AcceptHmTransferAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/hallmark/accepthmtransfer',
            component: React.lazy(() => import('./AcceptHmTransfer'))

        }
    ]
};
