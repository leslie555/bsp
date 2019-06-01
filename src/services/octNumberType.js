/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 查询号牌
export async function queryAllByParam(params) {
  return request('/HiatmpPro/bsp/platetype/queryAllByParam', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
