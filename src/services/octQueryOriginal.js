/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 机动车省内出行量统计查询
export async function queryOriginal(params) {
  return request('/HiatmpPro/bsp/flow/queryFlowBy', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 项目分类统计查询
export async function queryUnit() {
  return request('/HiatmpPro/bsp/company/query', {
    method: 'POST',
    body: JSON.stringify(),
  });
}
// 项目分类统计 保存
export async function saveCustomData(params) {
  return request('/HiatmpPro/bsp/company/save', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 项目分类统计历史记录
export async function gethistoryById(params) {
  return request('/HiatmpPro/bsp/company/queryHistory', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 项目分类统计详情
export async function queryDetails(params) {
  return request('/HiatmpPro/bsp/company/queryDetails', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
