import Stock from './Stock'

export const StockAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/stock',
            component: Stock
        }
    ]
};
