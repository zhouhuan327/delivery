import XLSX from 'xlsx'
import axios from './http';
const exportResultExcel = (calcResult, parama) => {
    let id = parama.id
    let mapData
    axios.post('/getNode', { id: id }).then(res => {
        if (res.data.statu === 100) {
            mapData = res.data.data
            let mapWb
            if (mapData.type === 'distance') {
                mapWb = mapData.wb
            } else if ((mapData.type === 'coodinate')) {
                let data = mapData.cooData
                let table = []
                table.push({
                    A: '客户点',
                    B: '横坐标',
                    C: '纵坐标',
                    D: '需求量'
                })
                data.forEach(item => {
                    table.push({
                        A: item.name,
                        B: item.x,
                        C: item.y,
                        D: item.qt
                    })
                })
                const wb = XLSX.utils.book_new()
                const ws = XLSX.utils.json_to_sheet(table, {
                    header: ['A', 'B', 'C', 'D'],
                    skipHeader: true
                })
                ws['!cols'] = [{ width: 10 }, { width: 10 }, { width: 10 }, { width: 10 }]

                //sheet写入book
                XLSX.utils.book_append_sheet(wb, ws, 'file')
                //输出
                mapWb = wb
            }
            let paramaTable = []
            paramaTable.push({
                A: '客户数',
                B: '大车载货量',
                C: '小车载货量',
                D: '最大里程数',
            })
            paramaTable.push({
                A: parama.n,
                B: parama.q,
                C: parama.smallq,
                D: parama.maxroad,
            })
            const paramaWs = XLSX.utils.json_to_sheet(paramaTable, {
                header: ['A', 'B', 'C', 'D'],
                skipHeader: true
            })
            paramaWs['!cols'] = [{ width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }]
            XLSX.utils.book_append_sheet(mapWb, paramaWs, '参数')

            let calcResTable = []
            calcResTable.push({
                A: '车',
                B: '路线',
                C: '载重',
                D: '行驶距离'
            })
            let formaterRes = []
            calcResult.route.forEach((item, index) => {
                formaterRes.push({
                    route: item,
                    distance: calcResult.distance[index],
                    weight: calcResult.weight[index]
                })
            })
            formaterRes.forEach((item, index) => {
                calcResTable.push({
                    A: `车${index + 1}`,
                    B: String(item.route),
                    C: item.weight,
                    D: item.distance
                })
            })
            const resWb = XLSX.utils.json_to_sheet(calcResTable, {
                header: ['A', 'B', 'C', 'D'],
                skipHeader: true
            })
            XLSX.utils.book_append_sheet(mapWb, resWb, '计算结果')
            XLSX.writeFile(mapWb, 'result' + '.xlsx')
        } else {
            this.$message({
                message: res.data.msg,
                type: 'error'
            })
        }
    })
        .catch(e => {
            console.log(e)
        })

}

export { exportResultExcel }