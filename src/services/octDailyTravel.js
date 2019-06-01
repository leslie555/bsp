/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 日均机动车出行总数查询
export async function chuXingTotal(params) {
  console.log(params);
  return request('/HiatmpPro/bsp/queryex/dailyVehicleTravel', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
