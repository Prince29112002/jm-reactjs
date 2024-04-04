import React from 'react';

export const TaggingRateProfileAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/taggingrateprofile',
            component: React.lazy(() => import('./TaggingRateProfile'))
        }
    ]
};
