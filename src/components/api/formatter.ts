const formatterApi = () => {
        const formatterTime = (row: any, column: any, cellValue: number, index: any) => {
            if (cellValue > 0) {
                const newDate = new Date();
                newDate.setTime(cellValue * 1000);
                return newDate.toLocaleString();
            } else {
                return '-';
            }
        }
        const formatterDate = (row: any, column: any, cellValue: number, index: any) => {
            if (cellValue > 0) {
                const newDate = new Date();
                newDate.setTime(cellValue * 1000);
                return newDate.toLocaleDateString();
            } else {
                return '-';
            }
        }

        return {

            formatterTime,
            formatterDate,
        }
    }
;

export default formatterApi;
