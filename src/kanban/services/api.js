import request from 'utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${JSON.stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${JSON.stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeMobileLogin(params) {
  return request('/api/login/mobile', {
    method: 'POST',
    body: params,
  });
}

/**
 * 获取系统相关的全局信息 如左侧可选的菜单栏
 * @returns {Promise<Object>}
 */
export async function fetchCommonInfo() {
  return request('/HiatmpPro/wbc/auth/getMenuStr', {
    method: 'POST',
  });
}
/**
 * 首页柱状图数据 根据分拣员统计
 * @returns {Promise<Object>}
 */
export async function queryIlligalDataByPoliceInfo() {
  return request('/HiatmpPro/wbc/chart/getIlligalDataByPolice', {
    method: 'POST',
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getVAMData(params) {
  return request('/HiatmpPro/wbc/chart/getVAMData', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
