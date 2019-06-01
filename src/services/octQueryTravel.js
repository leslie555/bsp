/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 机动车省内出行量统计查询
export async function chuXingChuan(params) {
  return request('/HiatmpPro/bsp/queryex/vehicleStatistics', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
