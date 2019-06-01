/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 断面流量统计查询
export async function duanmian(params) {
  return request('/HiatmpPro/bsp/queryex/queryProfileFlow', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
