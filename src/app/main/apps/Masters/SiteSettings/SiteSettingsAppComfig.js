import React from 'react';
export const SiteSettingsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/sitesettings',
            component: React.lazy(() => import('./SiteSettings'))
        }
    ]
};
