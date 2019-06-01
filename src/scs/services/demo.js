import request from '../../utils/request';
// 查询列表名单
export async function query(params) {
  return request('/fake/scs/bkgl/getBlackList', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
