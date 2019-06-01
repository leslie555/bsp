/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 机动车月均车速
export async function chesu(params) {
  return request('/HiatmpPro/bsp/queryex/averageSpeed', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
