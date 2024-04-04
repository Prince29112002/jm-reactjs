import React from 'react';
export const FinishPurityAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/finishpurity',
            component: React.lazy(() => import('./FinishPurityMaster'))
        }
    ]
};
