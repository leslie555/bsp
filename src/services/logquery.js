/**
 * Created by cherry on 2018/7/10.
 */
import request from '../utils/request';
// 查询日志
export async function queryLogList(params) {
  return request('/HiatmpPro/bsp/log/queryLogList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 日志导出记录日志
export async function logExportRecord(params) {
  return request('/HiatmpPro/bsp/log/logExportRecord', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查看日志详情记录日志
export async function logDetailRecord(params) {
  return request('/HiatmpPro/bsp/log/logDetail', {
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
// 获取一级菜单，用于功能模块
export async function getFirstMenuList() {
  return request('/HiatmpPro/bsp/common/getFirstMenus', {
    method: 'POST',
  });
}
