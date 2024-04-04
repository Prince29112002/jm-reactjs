import React from 'react';

export const MasterRejectionReceivedAppConfig = {
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
            path     : "/dashboard/design/masterrejectionreceived",
            component: React.lazy(() => import('./MasterRejectionReceived'))

        }
    ]
};
