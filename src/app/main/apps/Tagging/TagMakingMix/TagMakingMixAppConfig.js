import React from 'react';
export const TagMakingMixAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/tagmakingmix',
            component: React.lazy(() => import('./TagMakingMix'))
        }
    ]
};
