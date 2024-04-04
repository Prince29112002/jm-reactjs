import React from 'react';
export const WeeklyReminderReportAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/weeklyreminderreport',
            component: React.lazy(() => import('./WeeklyReminderReport'))
        }
    ]
};
