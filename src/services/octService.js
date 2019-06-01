/**
 * Created by ljf on 2018/10/08.
 */
import request from '../utils/request';
// 车籍统计数据
export async function getStaOrigin() {
  return request('/HiatmpPro/bsp/oct/queryStaOrigin', {
    method: 'POST',
    body: '',
  });
}
