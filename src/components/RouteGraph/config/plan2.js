
const getLinks = (arr, color) => {
    let res = [];
    arr.forEach((item, index) => {
        if (index < arr.length - 1) {
            res.push({
                source: item - 1,
                target: arr[index + 1] - 1,
                emphasis: {
                    label: {
                        show: true
                    },
                    lineStyle: {
                        color: color
                    }
                }
            })
        }
    });
    return res
}
