/**
 * Created by cherry on 2018/7/10.
 */
import request from '../utils/request';
// 查询主机日志
export async function queryHostLogList(params) {
  return request('/HiatmpPro/bsp/hostlog/queryHostLogList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 日志导出记录日志
export async function logExportRecord(params) {
  return request('/HiatmpPro/bsp/hostlog/logExportRecord', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查看日志详情记录日志
export async function logDetailRecord(params) {
  return request('/HiatmpPro/bsp/hostlog/logDetail', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 日志导出
export async function exportLogList(params) {
  return request('/HiatmpPro/bsp/exportexcel/exportExcel', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
