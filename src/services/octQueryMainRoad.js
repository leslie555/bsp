/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 日均出行频率查询
export async function GaoFeng(params) {
  return request('/HiatmpPro/bsp/queryex/gaofeng', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}