/**
 * Created by cherry on 2018/7/13.
 */
import request from '../utils/request';
// 查询日志
export async function queryMessageLog(params) {
  return request('/HiatmpPro/bsp/message/findSmsList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
