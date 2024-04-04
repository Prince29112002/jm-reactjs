import React from 'react';

export const CADRejectionReceivedAppConfig = {
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
            path     : "/dashboard/design/cadrejectionreceived",
            component: React.lazy(() => import('./CADRejectionReceived'))

        }
    ]
};
