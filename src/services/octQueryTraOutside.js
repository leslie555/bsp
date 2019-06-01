/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 机动车省外出行量统计查询
export async function chuXingNotChuan(params) {
  return request('/HiatmpPro/bsp/queryex/chuxing_notchuan', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
