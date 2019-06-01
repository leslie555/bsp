import request from 'utils/request';

// 查询道路列表
export async function getRoadList({ roadname = '' }) {
  return request(`/HiatmpPro/sem/common/getRoadList?roadname=${roadname}`, {
    method: 'get',
  });
}

// 查询路口列表
export async function getRoadCrossList({ roadcode = '', crossname = '' }) {
  return request(
    `/HiatmpPro/sem/common/getRoadCrossList?roadcode=${roadcode}&crossname=${crossname}`,
    {
      method: 'get',
    }
  );
}

// 查询枚举值列表
export async function getEnumList({ enumtypeid = '' }) {
  // return request(`/HiatmpPro/scs/common/getEnumList?enumtypeid=${enumtypeid}`, {
  return request('/fake/scs/common/getEnumList', {
    method: 'get',
  });
}

// 获取警员列表信息
export async function getPoliceList({ policename = '' }) {
  // return request(`/HiatmpPro/scs/common/getPoliceList?policename=${policename}`, {
  return request('/fake/scs/common/getPoliceList', {
    method: 'get',
  });
}

// 获取登录用户信息
export async function getOperatorInfo() {
  return request('/fake/scs/common/getOperatorInfo', {
    method: 'get',
  });
}

// 获取FTP前缀
export async function getFilePathPrefix() {
  return request('/fake/scs/common/getURLPrefix', {
    method: 'get',
  });
}
// 获取部门信息列表
export async function getDepartmentList({ departmentname = '', departmentcode = '' }) {
  return request(
    `/fake/scs/common/getDepartmentList?departmentname=${departmentname}&departmentcode=${departmentcode}`,
    {
      method: 'get',
    }
  );
}

// 查询六合一人员信息
export async function queryPersonByLhy({ sfzh = '' }) {
  return request(`/HiatmpPro/sem/common/queryDrivingLicence?sfzh=${sfzh}`, {
    method: 'get',
  });
}
// 查询六合一车辆信息
export async function getVehInfo(params) {
  return request('/HiatmpPro/scs/common/getVehInfo', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询在逃人员信息
export async function queryFugitiveInfor({ sfzh = '' }) {
  return request(`/HiatmpPro/sem/common/queryFugitiveInfor?sfzh=${sfzh}`, {
    method: 'get',
  });
}
// 查询停车场列表
export async function getParkingList(deptid) {
  return request(`/fake/scs/common/getParkingList?departmentid=${deptid}`, {
    method: 'get',
  });
}
// 查询系统参数列表
export async function getSysParamsList({ params }) {
  return request(`/fake/scs/common/getParams?paramcode=${params}`, {
    method: 'get',
  });
}
// 查询点位信息 也就是采集地点
export async function getPointList({ pointname, funcitems }) {
  let url = `/fake/scs/common/getPointList?pointname=${pointname}`;
  url += funcitems != null && funcitems.length > 0 ? `&funcitems=${funcitems}` : '';
  return request(url, {
    method: 'get',
  });
}

// 获取车牌信息枚举
export async function getCarBrand() {
  return request('/fake/scs/common/getCarBrandEnum', {
    method: 'get',
  });
}

// 获取分拣人员信息枚举
export async function getUserList() {
  return request('/fake/scs/common/getUserList', {
    method: 'get',
  });
}
// 获取数据库服务器当前时间
export async function getCurrentDBTime() {
  return request('/HiatmpPro/scs/common/getCurrentDBTime', {
    method: 'get',
  });
}

export async function getCarNoProfix() {
  return request('/fake/scs/common/getCarNoProfix', {
    method: 'get',
  });
}
