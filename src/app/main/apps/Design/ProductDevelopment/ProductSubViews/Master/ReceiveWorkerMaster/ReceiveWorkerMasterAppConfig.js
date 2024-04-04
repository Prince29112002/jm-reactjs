import React from 'react';

export const ReceiveFromWorkerMasterAppConfig = {
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
            path     : '/dashboard/design/receivefromworkermaster',
            component: React.lazy(() => import('./ReceiveFromWorkerMaster'))
        }
    ]
};
