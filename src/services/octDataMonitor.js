/**
 * Created by cherry on 2018/7/20.
 */
import request from '../utils/request';
// 查询四个统计图表接口
export async function getAll() {
  return request('https://www.easy-mock.com/mock/59ac2783e0dc6633419a2508/example/testxx', {
    method: 'get',
    body: JSON.stringify(),
  });
}
