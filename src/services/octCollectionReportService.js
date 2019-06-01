/**
 * Created by xr on 2019/2/27.
 */
import request from '../utils/request';
// 查询设备质量检测报告列表
export async function query(params) {
  return request('/HiatmpPro/bsp/devicecheck/query', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 通过id查询质量报告
export async function save(params) {
  return request('/HiatmpPro/bsp/octdevice/queryDeviceByPro', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询质量检测设备分组
export async function querydevicegroup() {
  return request('/HiatmpPro/bsp/devicecheck/GetTreeOnlyLeaf', {
    method: 'POST',
    body: '',
  });
}
// 历史记录查询设备分组
export async function queryGetTreeOnlyLeaf() {
  return request('/HiatmpPro/bsp/chartList/GetTreeOnlyLeaf', {
    method: 'POST',
    body: '',
  });
}
// 车辆类型历史记录查询
export async function queryHistorVehicletype(params) {
  return request('/HiatmpPro/bsp/chartList/queryVehicleType', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询采集设备详情
export async function queryProjectDeviceDetail(params) {
  return request('/HiatmpPro/bsp/devicedetails/query', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询采集设备详情
export async function queryDetails(params) {
  return request('/HiatmpPro/bsp/devicedetails/queryDetails', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 车籍分类历史记录查询
export async function queryClassificationHistory(params) {
  return request('/HiatmpPro/bsp/chartList/queryClassification', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询号牌分类历史记录
export async function queryHistoricalofNumberColor(params) {
  return request('/HiatmpPro/bsp/chartList/queryPlateColor', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询设备状态历史记录
export async function queryHistorDevicestatus(params) {
  return request('/HiatmpPro/bsp/chartList/queryPlateColor', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询过车历史记录
export async function queryAverageTrafficFlowHistoryRecord(params) {
  return request('/HiatmpPro/bsp/chartList/queryPlateColor', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询接口服务器状态
export async function getServerStatus(params) {
  return request('/HiatmpPro/bsp/sysdep/getServerStatus', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询接口服务器版本号
export async function getServerVersion(params) {
  return request('/HiatmpPro/bsp/sysdep/getServerVersion', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询接口服务器版本号详情
export async function getVersionDetailed(params) {
  return request('/HiatmpPro/bsp/sysdep/getVersionDetailed', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 新增
export async function uploadFile(params) {
  return request('/HiatmpPro/bsp/sysdep/uploadFile', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 接口服务器详情by ip
export async function GetServiceDevice(params) {
  return request('/HiatmpPro/bsp/sysdep/getService_device', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询接口服务器下的设备by ip
export async function GetDeviceForServiceIp(params) {
  return request('/HiatmpPro/bsp/sysdep/getServerStatus', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
