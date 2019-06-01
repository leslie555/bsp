/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, message, Modal } from 'antd';
import Search from '../components/DictionaryManage/DictionarySearch';
import List from '../components/DictionaryManage/DictionaryList';
import Info from '../components/DictionaryManage/DictionaryInfo';

const { confirm } = Modal;

class DictionaryManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      currentId: '', // 当前选中行的枚举Id
    };
  }

  render() {
    const { dictionarymanage, dispatch, common } = this.props;
    const {
      dictionarylist,
      dictionaryinfo,
      queryobj,
      queryMemObj,
      pagination,
      paginationMem,
    } = dictionarymanage;
    const { codeList } = common;
    const { flag, currentId } = this.state;
    // 搜索框组件用到的props
    const dictionarysearchprops = {
      queryobj,
      codeList,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'dictionarymanage/queryEnumTypes',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
        dispatch({
          type: 'dictionarymanage/getDictionaryInfoSuccess',
          payload: { dictionaryinfo: {}, paginationMem: { ...paginationMem, total: null } },
        });
        this.setState({
          flag: '2',
          currentId: '',
        });
      },
    };
    // 列表组件用到的props
    const dictionarylistprops = {
      pagination,
      paginationMem,
      dictionarylist,
      codeList,
      currentId,
      // 分页
      onPageChange(page) {
        dispatch({
          type: 'dictionarymanage/queryEnumTypes',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
      },
      // 查看枚举详情
      onView: (data) => {
        const page = { ...paginationMem, current: 1, pageSize: 5 };
        dispatch({
          type: 'dictionarymanage/getDictionaryInfo',
          payload: { queryMemObj: { ...queryMemObj, ...data, enumMemName: '' }, paginationMem: page },
        });
        dispatch({ type: 'dictionarymanage/updateState', payload: { queryMemObj: { enumMemName: '' } } });
        this.setState({
          flag: '2',
          currentId: data.enumtypeid,
        });
      },
      // 修改枚举详情
      onEdit: (data) => {
        const page = { ...paginationMem, current: 1, pageSize: 5 };
        dispatch({
          type: 'dictionarymanage/getDictionaryInfo',
          payload: { queryMemObj: { ...queryMemObj, ...data, enumMemName: '' }, paginationMem: page },
        });
        dispatch({ type: 'dictionarymanage/updateState', payload: { queryMemObj: { enumMemName: '' } } });
        this.setState({
          flag: '3',
          currentId: data.enumtypeid,
        });
      },
      // 新增枚举类型
      onEnumAdd: () => {
        dispatch({
          type: 'dictionarymanage/getDictionaryInfoSuccess',
          payload: { dictionaryinfo: {}, paginationMem: { ...paginationMem, total: null } },
        });
        dispatch({ type: 'dictionarymanage/updateState', payload: { queryMemObj: { enumMemName: '' } } });
        this.setState({
          flag: '1',
          currentId: '',
        });
      },
      // 枚举类型删除
      handleDelete: (desObj) => {
        const curthis = this;
        confirm({
          title: '删除确认',
          content: '确定要删除该枚举类型吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({ type: 'dictionarymanage/deleteEnum', payload: { desObj } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (data.flag == 1) {
                  const page = { ...pagination, current: 1 };
                  dispatch({ type: 'dictionarymanage/queryEnumTypes', payload: { queryobj, pagination: page } });
                  dispatch({ type: 'dictionarymanage/getDictionaryInfoSuccess', payload: { dictionaryinfo: {} } });
                  curthis.setState({
                    flag: '2',
                  });
                }
              } else {
                Modal.error({
                  title: '删除失败',
                  content: '删除失败，请联系管理员。',
                });
              }
            });
          },
          onCancel() {

          },
        });
      },
    };
    // 详情、添加、修改用到的props
    const dictionaryinfoprops = {
      dictionaryinfo,
      flag,
      paginationMem,
      codeList,
      queryMemObj,
      // 枚举详情分页
      onMemPageChange(page) {
        dispatch({
          type: 'dictionarymanage/getDictionaryInfo',
          payload: {
            queryMemObj,
            paginationMem: { ...paginationMem, current: page.current, pageSize: page.pageSize },
          },
        });
      },
      // 根据枚举描述查询枚举值
      onEnumMemSearch(query) {
        const page = { ...paginationMem, current: 1 };
        dispatch({
          type: 'dictionarymanage/getDictionaryInfo',
          payload: { queryMemObj: { ...queryMemObj, ...query }, paginationMem: page },
        });
      },
      handleAdd: (desObj) => {
        dispatch({ type: 'dictionarymanage/addEnum', payload: { desObj } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({ type: 'dictionarymanage/queryEnumTypes', payload: { queryobj, pagination: page } });
              dispatch({ type: 'dictionarymanage/getDictionaryInfoSuccess', payload: { dictionaryinfo: {} } });
              this.setState({
                flag: '2',
              });
            }
          } else {
            Modal.error({
              title: '添加失败',
              content: '添加失败，请联系管理员。',
            });
          }
        });
      },
      handleEdit: (srcObj, desObj) => {
        dispatch({ type: 'dictionarymanage/editEnum', payload: { srcObj, desObj } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({ type: 'dictionarymanage/queryEnumTypes', payload: { queryobj, pagination: page } });
              dispatch({ type: 'dictionarymanage/getDictionaryInfoSuccess', payload: { dictionaryinfo: {} } });
              this.setState({
                flag: '2',
              });
            }
          } else {
            Modal.error({
              title: '编辑失败',
              content: '编辑失败，请联系管理员。',
            });
          }
        });
      },
      handleDeleteMem: (desObj) => {
        confirm({
          title: '删除确认',
          content: '确定要删除该枚举值吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({ type: 'dictionarymanage/deleteEnumMem', payload: { desObj } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                if (data.flag == 1) {
                  const page = { ...pagination, current: 1 };
                  dispatch({
                    type: 'dictionarymanage/getDictionaryInfo',
                    payload: { queryMemObj, paginationMem: page },
                  });
                }
              } else {
                Modal.error({
                  title: '删除失败',
                  content: '删除失败，请联系管理员。',
                });
              }
            });
          },
          onCancel() {
          },
        });
      },
      handleAddMem: (desObj) => {
        dispatch({ type: 'dictionarymanage/addEnumMem', payload: { desObj } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({
                type: 'dictionarymanage/getDictionaryInfo',
                payload: { queryMemObj, paginationMem: page },
              });
            }
          } else {
            Modal.error({
              title: '添加失败',
              content: '添加失败，请联系管理员。',
            });
          }
        });
      },
      handleEditMem: (srcObj, desObj) => {
        dispatch({ type: 'dictionarymanage/editEnumMem', payload: { srcObj, desObj } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({
                type: 'dictionarymanage/getDictionaryInfo',
                payload: { queryMemObj, paginationMem: page },
              });
            }
          } else {
            Modal.error({
              title: '编辑失败',
              content: '编辑失败，请联系管理员。',
            });
          }
        });
      },
      handleCancle: () => {
        this.setState({
          flag: '2',
        });
      },
    };
    return (
      <div>
        <Search {...dictionarysearchprops} />
        <Row>
          <Col span={14}>
            <List {...dictionarylistprops} />
          </Col>
          <Col span={10}>
            <Info {...dictionaryinfoprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ dictionarymanage, common }) {
  return { dictionarymanage, common };
}

export default connect(mapStateToProps)(DictionaryManage);
