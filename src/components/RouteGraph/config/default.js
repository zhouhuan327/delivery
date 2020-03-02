import { coo_data1, coo_data2 } from '../testdata/coordinate.js'

let options = {
    title: {
        text: 'Graph 简单示例',
        textStyle: {
            fontSize: 15
        }
    },
    tooltip: {},
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            type: 'graph',
            layout: 'none',
            symbolSize: 25,
            itemStyle: {


            },
            roam: true,
            label: {
                show: true
            },
            edgeSymbol: ['circle', 'circle'],
            edgeSymbolSize: [1, 1],
            edgeLabel: {
                fontSize: 25
            },
            data: getData(coo_data2),
            // links: [],
            links: getLinks(coo_data2),
            lineStyle: {
                width: 2,
                //弯曲度
                curveness: 0,
                color: '#808080'
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
                    color: "#2E2E2E"
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