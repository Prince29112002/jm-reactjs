import React from 'react';
export const TagMakingLotAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/tagmakinglot',
            component: React.lazy(() => import('./TagMakingLot'))
        }
    ]
};
