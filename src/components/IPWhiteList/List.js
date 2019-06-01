import React, { Component } from 'react';
import { Table, Icon, Button, Form, notification, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import { IPDelete, mulDel } from '../../services/IPWhiteList';
import styles from './List.less';

const { confirm } = Modal;
class List extends Component {
  constructor(props) {
    super(props);
    // const { selectedRowKeys } = this.props;
    this.state = {
      selectedRowKeys: [],
      fileList: [],
    };
    // this.IPEdit = this.IPEdit.bind(this);
    // this.IPDelete = this.IPDelete.bind(this);
    this.mulDelete = this.mulDelete.bind(this);
    this.IpDel = this.IpDel.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   const { selectedRowKeys } = this.props;
  //
  //   if (selectedRowKeys !== nextProps.selectedRowKeys) {
  //     this.setState({
  //       selectedRowKeys: nextProps.selectedRowKeys,
  //     });
  //   }
  // }
  // 选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys);
    console.log(selectedRows);
    this.setState({ selectedRowKeys });
  }

  // 下载模板
  handleDownload = (key) => {
    if (key === 1) {
      const src = 'template/blmExcel2003.xls';
      window.open(src);
    }
    if (key === 2) {
      const src = 'template/blmExcel2007.xlsx';
      window.open(src);
    }
    if (key === 3) {
      // const src = 'template/blmTxt.txt';
      // window.open(src);
      const eleLink = document.createElement('a');
      eleLink.download = 'blmTxt.txt';
      eleLink.style.display = 'none';
      eleLink.href = 'template/blmTxt.txt';
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    }
  };

  // 文件上传
  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file);
    });
  };

  // 编辑
  IPEdit(record) {
    console.log(record);
    const { onEdit } = this.props;
    onEdit(record);
  }

  // 删除
  IpDel(record) {
    const { onEdit } = this.props;
    const { onPageChange, pagination } = this.props;
    console.log(this.props);
    confirm({
      title: '是否删除此条信息?',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        IPDelete({ loginrestrict: record }).then((data) => {
          console.log(data);
          if (data.result == 'success') {
            // console.log(this.props);
            onPageChange(pagination);
            message.success('删除成功！');
            // notification.success({ message: '删除成功！' });
          } else {
            message.error('删除失败！');
            // notification.error({ message: '删除失败！' });
          }
        }).catch((e) => {
          message.error('删除失败！！');
          // notification.error({ message: '删除失败！！' });
        });
      },
      onCancel() {

      },
    });
  }

  // 批量删除
  mulDelete() {
    const { selectedRowKeys } = this.state;
    mulDel({ selectedRowKeys }).then((data) => {
      if (data) {
        if (data.result === 'success') {
          message.success('批量删除成功！');
          // notification.success({ message: '删除成功！' });
          const { onPageChange, pagination } = this.props;
          onPageChange(pagination);
        }
      } else {
        message.error('批量删除失败！');
        // notification.error({ message: '删除失败！' });
      }
    }).catch((e) => {
      message.error('批量删除失败！！');
      // notification.error({ message: '删除失败！' });
    });
  }

  render() {
    const { loading, list, pagination, onPageChange, onAdd, onEdit, totalCount } = this.props;
    console.log(pagination);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys2, selectedRows) => {
        this.onSelectChange(selectedRowKeys2, selectedRows);
      },
      // onChange: this.onSelectChange(),
      // onSelect: (record) => {
      //   this.onSelectChange(record);
      //   // console.log(`selected: ${selected}`, 'selectedRows: ', selectedRows);
      //   // console.log(record)
      // },
    };

    // 列表
    const columns = [
      {
        title: '网段名称',
        width: '15%',
        dataIndex: 'segment_name',
        key: 'segment_name',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow} title={text}>
              <span>{text}</span>
            </div>
          );
        },
      },
      {
        title: '起始地址',
        width: '15%',
        dataIndex: 'start_address',
        key: 'start_address',
        align: 'center',
      },
      {
        title: '结束地址',
        width: '15%',
        dataIndex: 'end_address',
        align: 'center',
        key: 'carbrand',
      },
      {
        title: '用户名',
        width: '15%',
        dataIndex: 'user_id',
        align: 'center',
        key: 'user_id',
      },
      {
        title: '登记人',
        width: '15%',
        align: 'center',
        dataIndex: 'recorder',
        key: 'recorder',
      },
      {
        title: '登记时间',
        width: '15%',
        align: 'center',
        dataIndex: 'operating_time',
        key: 'operating_time',
      },

      {
        title: '操作',
        width: '10%',
        align: 'center',
        key: 'action',
        render: (text, record) => {
          const data = { ...record };
          return (
            <span>
              <Icon
                type="edit"
                style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                onClick={() => { this.IPEdit(record); }}
                title="编辑"
              />
              <Icon
                type="delete"
                style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                onClick={() => { this.IpDel(record); }}
                title="删除"
              />
            </span>
          );
        },
      },
    ];

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <table style={{ width: '100%' }}>
              <tbody>
                <tr style={{ width: '100%' }}>
                  <td style={{ width: '60%' }}>
                    <div>
                      搜索结果 共 <span className="allNumLight">{pagination.total}</span> 条
                    </div>
                  </td>
                  <td style={{ width: '40%', textAlign: 'right' }}>
                    {/* <Button type="primary" style={{ margin: '0 5px' }} onClick={() => {}}> */}
                    {/* <i className="table-right icon iconfont icon-import" />导入 */}
                    {/* </Button> */}
                    {/* <Button type="primary" style={{ margin: '0 5px' }} onClick={() => {}}> */}
                    {/* <i className="table-right icon iconfont icon-export" />导出 */}
                    {/* </Button> */}
                    <Button
                      type="primary"
                      style={{ margin: '0 5px' }}
                      onClick={() => {
                        onAdd();
                      }}
                    >
                      <i className="table-right icon iconfont icon-tianjia" />添加
                    </Button>
                    {/* <Button */}
                    {/* type="primary" */}
                    {/* style={{ margin: '0 20px 0 5px', width: 100 }} */}
                    {/* onClick={this.mulDelete} */}
                    {/* > */}
                    {/* <i className="table-right icon iconfont icon-delete-tab" />批量删除 */}
                    {/* </Button> */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Table
            columns={columns}
            className={styles.tableList}
            rowClassName={(record, index) => {
              return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
            }}
            // scroll={{ x: 1800, y: 620 }}
            loading={loading}
            dataSource={list}
            pagination={pagination}
            onChange={onPageChange}
            // rowSelection={rowSelection}
            scroll={{ y: 600 }}
            locale={{ emptyText: '暂无数据' }}
            rowKey={record => `${record.lrpkid}`}
            size="big"
          />
        </div>
      </div>
    );
  }
}
List.propTypes = {
  loading: PropTypes.bool,
  list: PropTypes.array,
  pagination: PropTypes.object,
};
List.defaultProps = {
  list: [],
  loading: false,
  pagination: {},
};
// export default List;
export default Form.create()(List);
