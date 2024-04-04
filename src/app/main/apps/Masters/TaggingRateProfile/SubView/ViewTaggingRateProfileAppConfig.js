import React from 'react';

export const ViewTaggingRateProfileAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/viewtaggingrateprofile',
            component: React.lazy(() => import('./ViewTaggingRateProfile'))
        }
    ]
};
