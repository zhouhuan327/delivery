import { coo_data1, coo_data2, coo_data3 } from '../testdata/coordinate.js'

let options = {
    title: {
        text: 'Graph 简单示例',
        textStyle: {
            fontSize: 15
        }
    },
    color: ['#949494', '#ED7C30', '#177ED7'],
    legend: {
        data: ['节点', '小车1', '小车2'],
        selected: {
            '节点': true,
            '小车1': false,
            '小车2': false
        }
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            type: 'graph',
            name: '节点',
            layout: 'none',
            symbolSize: 25,
            roam: false,
            itemStyle: {
            },
            label: {
                show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [3, 10],
            edgeLabel: {
                fontSize: 25
            },
            data: getData(coo_data2),
            // links: [],
            links: [],
            lineStyle: {
                width: 2,
                //弯曲度
                curveness: 0,
                color: '#949494'
            },
        },
        {
            type: 'graph',
            name: '小车1',
            layout: 'none',
            symbolSize: 25,
            itemStyle: {
            },
            roam: false,
            label: {
                show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [3, 10],
            edgeLabel: {
                fontSize: 25
            },
            data: getData(coo_data2),
            links: getLinks(coo_data2),
            // links: [{
            //     source: 0,
            //     target: 2
            // }, {
            //     source: 2,
            //     target: 3
            // },
            // {
            //     source: 3,
            //     target: 1
            // }, {
            //     source: 1,
            //     target: 6
            // }],
            lineStyle: {
                width: 2,
                //弯曲度
                curveness: 0,
                color: '#ED7C30'
            },
        },
        {
            type: 'graph',
            name: '小车2',
            layout: 'none',
            symbolSize: 25,
            roam: false,
            itemStyle: {
            },
            label: {
                show: true
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [3, 10],
            edgeLabel: {
                fontSize: 25
            },
            data: getData(coo_data2),
            // links: [],
            links: [{
                source: 0,
                target: 4
            }, {
                source: 4,
                target: 2
            },
            {
                source: 2,
                target: 5
            }, {
                source: 5,
                target: 2
            }],
            lineStyle: {
                width: 2,
                //弯曲度
                curveness: 0,
                color: '#177ED7'
            },
        }
    ]
}
function getData(data) {
    const res = []
    data.forEach((item, index) => {
        if (index === 0) {
            res.push({
                name: item.name,
                x: item.x * 5,
                y: item.y * 5,
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

function getLinks(data) {
    const res = []
    for (let i = 0; i < data.length; i++) {
        const source = data[i].name
        for (let j = i + 1; j < data.length; j++) {
            const target = data[j].name
            const value = getInstance(data[j], data[i])
            res.push({
                source: source,
                target: target,
                label: {
                    show: true,
                    formatter: value.toString(),
                    fontSize: 13,
                    color: '#BDBDBD'
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    lineStyle: {
                        color: 'red'
                    }
                }
            })
        }
    }
    return res
}
function getInstance(coo1, coo2) {
    let xi = Math.abs(coo2.x - coo1.x)
    let yi = Math.abs(coo2.y - coo1.y)
    let instance = Math.sqrt(xi * xi + yi * yi)
    return Math.round(instance)
}


export { options }