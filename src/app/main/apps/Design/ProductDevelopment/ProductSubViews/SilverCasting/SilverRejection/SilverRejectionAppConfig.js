import React from 'react';

export const SilverRejectionAppConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: true
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/design/silverrejection",
            component: React.lazy(() => import('./SilverRejection'))

        }
    ]
};
