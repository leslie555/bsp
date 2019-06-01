/**
 * Created by DELL on 2018-7-5.
 */

import request from '../utils/request';

export async function queryIllegal(params) {
  return request('/HiatmpPro/bsp/dm/findAllByDictionary', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function updateIllegal(params) {
  return request('/HiatmpPro/bsp/dm/editIllegal', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function addIllegal(params) {
  return request('/HiatmpPro/bsp/dm/saveIllegal', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function deleteIllegal(params) {
  return request('/HiatmpPro/bsp/dm/deleIllegalItem', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
