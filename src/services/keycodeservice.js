import request from '../utils/request';

export async function queryHotkeys() {
  return request('/HiatmpPro/bsp/hotkey/queryHotkeysByUserId', {
    method: 'POST',
  });
}
export async function updateHotkey(params) {
  return request('/HiatmpPro/bsp/hotkey/updateHotkey', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
