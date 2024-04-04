import SalesBlankPage from './SalesBlankPage';

export const SalesBlankPageAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales',
            component: SalesBlankPage
        }
    ]
};
