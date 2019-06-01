import request from 'utils/request';
// 获取所有枚举值
export function queryEnums() {
  return request('/HiatmpPro/getEnumTypeList', {
    method: 'post',
  });
}
export function queryDepts() {
  return request('/HiatmpPro/getDeptList', {
    method: 'post',
  });
}

// 修改密码
export async function updatePwdForOperator(params) {
  return request('/HiatmpPro/wbc/auth/updatePwdForOperator4React', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// 记录用户退出日志
export async function writeLogForLogout() {
  return request('/HiatmpPro/wbc/common/writeLogForLogout', {
    method: 'POST',
  });
}
