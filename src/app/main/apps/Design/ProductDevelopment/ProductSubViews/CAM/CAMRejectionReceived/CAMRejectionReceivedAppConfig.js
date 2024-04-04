import React from 'react';

export const CAMRejectionReceivedAppConfig = {
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
            path     : "/dashboard/design/camrejectionreceived",
            component: React.lazy(() => import('./CAMRejectionReceived'))

        }
    ]
};
