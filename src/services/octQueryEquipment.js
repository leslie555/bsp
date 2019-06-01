/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 采集设备数量总数查询
export async function chuXingDevice(params) {
  return request('/HiatmpPro/bsp/queryex/collectEquipment', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
