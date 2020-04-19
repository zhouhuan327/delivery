import axios from 'axios'
import { Message } from 'element-ui';
const service = axios.create({});

service.interceptors.request.use(request => {
    const server_url = process.env.VUE_APP_URL
    request.url = server_url + request.url
    return Promise.resolve(request)
})
service.interceptors.response.use(response => {
    if (response.status === 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
}, err => {
    Message.error('请求失败')
    return Promise.reject(err);
})
export default service