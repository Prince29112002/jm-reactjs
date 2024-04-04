import React from 'react';

export const PushNotificationAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/pushnotification",
            component: React.lazy(() => import('./PushNotification'))
        }
    ]
};


