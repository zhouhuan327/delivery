import { coo_data1, coo_data2, coo_data3 } from '../testdata/coordinate.js'
function getData(data) {
    const res = []
    data.forEach((item, index) => {
        if (index === 0) {
            res.push({
                name: item.name,
                x: item.x * 5,
                y: item.y * 5,
                tooltip: '配送中心',
                itemStyle: {
                    color: "#909399"
                },
                symbolSize: 30,
            })
        } else {
            res.push({
                name: item.name,
                x: item.x * 5,
                y: item.y * 5,
                tooltip: {
                    formatter: `货物量:${item.qt}`
                }

            })
        }

    })
    return res
}
const getOptions = (links) => {
    let options = {
        title: {
            // text: 'Graph 简单示例',
            textStyle: {
                fontSize: 15
            }
        },
        color: '#949494',
        // legend: {
        //     data: ['节点', '小车1', '小车2'],
        //     selected: {
        //         '节点': true,
        //         '小车1': false,
        //         '小车2': false
        //     }
        // },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                type: 'graph',
                name: '节点',
                layout: 'none',
                symbolSize: 25,
                roam: true,
                itemStyle: {
                },
                label: {
                    show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [3, 5],
                edgeLabel: {
                    fontSize: 25
                },
                data: getData(coo_data2),
                // links: [],
                links: links,
                lineStyle: {
                    width: 2,
                    //弯曲度
                    curveness: 0,
                    color: '#c23531'
                },
            }
        ]
    }
    return options
}
export default getOptions