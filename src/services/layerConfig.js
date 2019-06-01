import request from '../utils/request';
// 查询列表名单
export async function getAllLayers(params) {
  return request('/HiatmpPro/bsp/layer/getAllLayers', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 删除
export async function saveLayerConfig(params) {
  return request('/HiatmpPro/bsp/layer/saveLayerConfig', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
