import moment from "moment";
import React from "react";

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null && sortConfig.isDate === false) {
            sortableItems
                .sort((a, b) => {
                    if (a[sortConfig.key] === null || a[sortConfig.key] === "" || a[sortConfig.key] === "-" || a[sortConfig.key] === undefined) return 1
                    if (b[sortConfig.key] === null || b[sortConfig.key] === "" || b[sortConfig.key] === "-" || b[sortConfig.key] === undefined) return -1

                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                });
        }
        if (sortConfig !== null && sortConfig.isDate === true) {
            sortableItems
                .sort((a, b) => {
                    const date1 = moment(a[sortConfig.key], "DD-MM-YYYY");
                    const date2 = moment(b[sortConfig.key], "DD-MM-YYYY");
                    return sortConfig.direction === "ascending" ? date1 - date2 : date2 - date1;
                });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key, isDate = false) => {//pass true if we want to sort by date
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction, isDate });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

export default useSortableData;