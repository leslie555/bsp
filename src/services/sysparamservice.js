/**
 * Created by DELL on 2018-7-5.
 */

import request from '../utils/request';

export async function querySysparam(params) {
  return request('/HiatmpPro/bsp/sysparam/getAllParamsByName', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function updateSysparam(params) {
  return request('/HiatmpPro/bsp/sysparam/saveParams', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
