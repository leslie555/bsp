import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal, message, Row, Col, Button, Input, Table, Form, notification } from 'antd';
import Search from '../../components/oct/common/historysearch';
import List from '../../components/oct/common/versionuploadlist';
import FileUpload from '../../components/oct/common/UploadFile';
import codeMessage from '../../utils/request';

const { confirm } = Modal;
const { TextArea } = Input;
const FormItem = Form.Item;

class versionUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      dataSource: [],
      addvisible: false, // 是否显示新增,默认不显示
      fileUploadVisible: false, // 上传窗口,默认不显示
      SGvisible: false, // 升级窗口,默认不显示
      selectedRowKeys: [],
      version: '', // 版本号
      isupload: false, // 是否上传
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octVersionUpload/getServerVersion',
      payload: {},
    });
  }

  onClose = () => {
    this.setState({ addvisible: false, SGvisible: false });
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  // 全选
  onAllChange = () => {
    const { octVersionUpload } = this.props;
    const { selectedRowKeys } = this.state;
    const { Detailedresultlist } = octVersionUpload;
    const arr = [];
    for (let i = 0; i < Detailedresultlist.length; i += 1) {
      arr.push(Detailedresultlist[i].interfaceip);
    }
    if (selectedRowKeys.length === arr.length) {
      this.setState({
        selectedRowKeys: [],
      });
    } else {
      this.setState({
        selectedRowKeys: arr,
      });
    }
  }

  // 上传文件
  showUpload = () => {
    this.setState({ fileUploadVisible: true });
  }

  // 上传提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch, octVersionUpload } = this.props;
    const { versionArr } = octVersionUpload;
    const versionStr = versionArr.join(',');
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { file, version, remark } = values;
        if (versionStr.indexOf(version) == -1) {
          // 提交
          dispatch({
            type: 'octVersionUpload/uploadFile',
            payload: {
              version,
              remark,
              // file,
            },
          });
          // 关闭窗口
          this.setState({ addvisible: false });
          message.success('提交成功');
          // 重新加载
          dispatch({
            type: 'octVersionUpload/getServerVersion',
            payload: {},
          });
        } else {
          Modal.error({
            title: '错误',
            content: `版本号${version}已存在！`,
          });
        }
      } else {
        // message.info('提交失败');
      }
    });
  }

  checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    console.log(codeMessage);
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
  }

  parseJSON = (response) => {
    if (response.status === 210) {
      window.location.href = `/HiatmpPro/login?_g=${__modulename}&url=${encodeURIComponent(
        window.location.href
      )}`;
    } else {
      return response.json();
    }
  }

  // 升级
  upgrade = () => {
    this.setState({ addvisible: false, SGvisible: false });
    const { dispatch } = this.props;
    const { version, selectedRowKeys } = this.state;
    const mybody = { version, iplist: selectedRowKeys };
    const initObj = {
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(mybody),
    };
    return fetch('http://20.2.15.33:8808/DeployTask', initObj)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(res => res)
      .catch(e => {
        const status = e.name;
        if (status === 401) {
          dispatch(routerRedux.push('/exception/500'));
          return;
        }
        if (status === 403) {
          dispatch(routerRedux.push('/exception/404'));
          return;
        }
        if (status <= 504 && status >= 500) {
          dispatch(routerRedux.push('/exception/500'));
          return;
        }
        if (status >= 404 && status < 422) {
          dispatch(routerRedux.push('/exception/404'));
        }
      });
  }

  // 反选
  ReverseChange = () => {
    const { octVersionUpload } = this.props;
    const { selectedRowKeys } = this.state;
    const { Detailedresultlist } = octVersionUpload;
    const arr = [];
    const arr1 = [];
    for (let i = 0; i < Detailedresultlist.length; i += 1) {
      arr.push(Detailedresultlist[i].interfaceip);
    }
    if (selectedRowKeys.length == 0) {
      this.setState({
        selectedRowKeys: arr,
      });
    } else {
      const str = selectedRowKeys.join(',');
      for (let i = 0; i < Detailedresultlist.length; i += 1) {
        if (str.indexOf(Detailedresultlist[i].interfaceip) == -1) {
          arr1.push(Detailedresultlist[i].interfaceip);
        }
      }
      this.setState({
        selectedRowKeys: arr1,
      });
    }
  }

  // 升级详情页
  showgrade = (num) => {
    const { dispatch } = this.props;
    const { version } = this.state;
    console.log('showgrade,升级', num);
    this.setState({ SGvisible: true, version: num });
    dispatch({
      type: 'octVersionUpload/getVersionDetailed',
      payload: { version },
    });
  }

  render() {
    const { octVersionUpload, common, dispatch, loading, form } = this.props;
    const { dataSource, addvisible, fileUploadVisible, SGvisible,
      selectedRowKeys, version, isupload } = this.state;
    const { getFieldDecorator } = form;
    const {
      queryobj,
      pagination,
      resultlist,
      Detailedresultlist,
      treeData,
      imglist,
    } = octVersionUpload;
    const arr = [];
    const disabled = selectedRowKeys.length > 0;
    if (Detailedresultlist) {
      for (let i = 0; i < Detailedresultlist.length; i += 1) {
        arr.push(Detailedresultlist[i].interfaceip);
      }
    }
    const allTxt = selectedRowKeys.length != arr.length ? '全选' : '取消全选';
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;
    const searchprops = {
      title: '设备状态历史记录',
      queryobj,
      enumList,
      dataSource,
      treeData,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octVersionUpload/queryHistorDevicestatus',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const FileUploadprops = {
      type: 'hide',
      name: 'file',
      action: '/HiatmpPro/bsp/sysdep/insertMultiFile',
      showUploadList: true,
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      downloadTemplate: '/HiatmpPro/bsp/devicegroup/downloadModel',
      width: '40%',
      visible: fileUploadVisible,
      onClose: () => { this.setState({ fileUploadVisible: false }); },
      onOk: () => { this.setState({ fileUploadVisible: false }); },
      iscallback: true,
      onChange: (info) => {
        console.log(info);
        if (info) {
          if (info.file.response) {
            if (info.file.response.status == 'success') {
              message.success('上传成功');
              this.setState({
                isupload: true,
              });
            } else {
              message.warning('上传失败');
            }
          }
        }
      },
    };
    const listprops = {
      columns: [
        {
          title: '序号',
          width: '20%',
          align: 'center',
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: '版本号',
          width: '20%',
          dataIndex: 'version',
          key: 'version',
          align: 'center',
        },
        {
          title: '上传时间',
          width: '20%',
          dataIndex: 'uploadtime',
          key: 'uploadtime',
          align: 'center',
        },
        {
          title: '备注',
          width: '20%',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
        },
        {
          title: '操作',
          width: '20%',
          dataIndex: 'action',
          key: 'action',
          align: 'center',
          render(text, record) {
            return (
              <span>
                <Button onClick={() => myThis.showgrade(record.version)}>升级</Button>
              </span>
            );
          },
        },
      ],
      imglist,
      pagination,
      currentId,
      resultlist,
      enumList,
      loading,
      onPageChange: (page) => {
        dispatch({
          type: 'octVersionUpload/queryHistorDevicestatus',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
        });
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
      onDownload: (record) => {
        console.log(record);
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/illegalevent/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        console.log(inputElement);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        if (pagination.total < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (pagination.total < 100000) {
          confirm({
            title: '导出确认',
            content: '由于数据量很大导出需要一定时间，确认导出？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              formElement.submit();
              document.body.removeChild(formElement);
            },
            onCancel() {
              // alert('操作取消');
            },
          });
        } else {
          message.warning('数据大于100000条,禁止导出');
        }
      },
      onAddVersion: () => {
        this.setState({ addvisible: true });
      },
    };
    const tableprops = {
      columns: [
        {
          title: '序号',
          width: '20%',
          align: 'center',
          key: 'center',
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: '接口ip',
          width: '20%',
          dataIndex: 'interfaceip',
          align: 'center',
          key: 'interfaceip',
        },
        {
          title: '接口名称',
          width: '20%',
          dataIndex: 'interfacename',
          align: 'center',
          key: 'interfacename',
        },
        {
          title: '版本号',
          width: '20%',
          dataIndex: 'version',
          align: 'center',
          key: 'version',
        },
        {
          title: '备注',
          width: '20%',
          dataIndex: 'remark',
          align: 'center',
          key: 'remark',
        },
      ],
      dataSource: Detailedresultlist,
      rowSelection: {
        selectedRowKeys,
        onChange: this.onSelectChange,
      },
      pagination: false,
      scroll: { y: 400 },
      rowKey: 'interfaceip',
    };
    return (
      <div>
        {/* <Row>
          <Col span={24} style={{ width: '100%', paddingBottom: '0' }}>
            <Search {...searchprops} />
          </Col>
        </Row> */}
        <Form>
          <Modal
            title="选择版本号和上传代码包"
            visible={addvisible}
            onCancel={this.onClose}
            width="40%"
            footer={[
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.handleSubmit}
                disabled={!isupload}
              >
                确定
              </Button>,
              <Button onClick={this.onClose}>关闭</Button>,
            ]}
          >
            <FormItem
              label="版本号"
            >
              {getFieldDecorator('version', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    pattern: /^\d+[.]\d+$/,
                    message: '请输入正确的版本号!',
                  },
                ],
              })(
                <Input placeholder="1.0" />
              )}
            </FormItem>
            <FormItem label="备注:">
              {getFieldDecorator('remark', {
                initialValue: '',
                rules: [
                  { required: true, message: '请输入备注' },
                ],
              })(
                <TextArea autosize />
              )}
            </FormItem>
            <FormItem label="上传文件:">
              {getFieldDecorator('file', {
                initialValue: '',
                rules: [
                  { required: true, message: '请选择文件' },
                ],
              })(
                <FileUpload {...FileUploadprops} />
              )}
            </FormItem>
          </Modal>
        </Form>
        <Modal
          title="升级"
          visible={SGvisible}
          onCancel={this.onClose}
          width="50%"
          footer={[
            <Button
              onClick={this.upgrade}
              disabled={!disabled}
            >
              升级
            </Button>,
            <Button onClick={this.onClose}>关闭</Button>,
          ]}
        >
          <Button onClick={this.onAllChange} style={{ margin: '5px' }}>{allTxt}</Button>
          <Button
            onClick={this.ReverseChange}
            style={{ margin: '5px' }}
            disabled={!disabled}
          >
            反选
          </Button>
          <span>
            当前一共
            <span className="allNumLight">
              {Detailedresultlist ? Detailedresultlist.length : 0}
            </span>
            个服务器,选择了
            <span className="allNumLight">
              {selectedRowKeys.length}
            </span>
            个服务器
          </span>
          <Table {...tableprops} />
        </Modal>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
            <List {...listprops} />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps({ octVersionUpload, common, loading }) {
  return ({
    octVersionUpload,
    common,
    loading: loading.models.octVersionUpload,
  });
}
export default connect(mapStateToProps)(Form.create()(versionUpload));
