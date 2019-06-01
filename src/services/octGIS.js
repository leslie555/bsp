/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/requestEx';
// 查询：三类设备详情，0--路段；1--维护建设单位；2--组织机构
export async function queryDevices(params) {
  return request('/HiatmpPro/bsp/gisoperate/selectBy', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 所有设备
export async function queryAllDevices() {
  return request('/HiatmpPro/bsp/gisoperate/queryAll', {
    method: 'POST',
    body: '',
  });
}
export async function updateMonitorPoint(params) {
  return request('/HiatmpPro/bsp/octdevice/updateMonitorPoint', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function addOrUpdatePoint(params) {
  return request('/HiatmpPro/bsp/octdevice/addOrUpdatePoint', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function policeStruct() {
  return request('/HiatmpPro/bsp/policearea/policeStruct', {
    method: 'POST',
  });
}
export async function weihujianse() {
  return request('/HiatmpPro/bsp/policearea/weihujianse', {
    method: 'POST',
  });
}
// 查询一定范围内的所有marker
export async function getMarker(params) {
  return request('/HiatmpPro/bsp/octgis/queryMarker', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
// 查询一个marker
export async function getOneMarker(params) {
  return request('/HiatmpPro/bsp/octgis/queryMarkerOne', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function getRoadInfo(lng, lat) {
  // const url = `http://4.zhuamm.com:3456/analysisNearPointByAll?lon=${lng}&lat=${lat}`;
  const url = `http://20.5.11.26:6080/CDTGIS/mapapi/nearPoint/analysisNearPointByAll?lon=${lng}&lat=${lat}`;
  return request(url, {
    method: 'GET',
  });
}

export async function queryDeviceList(params) {
  return request('/HiatmpPro/bsp/octgis/getTrackPlayback', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function queryUrlInfo(params) {
  return request('/HiatmpPro/bsp/downFile/downloadPicture', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
