/**
 * Created by cherry on 2018/7/26.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Tabs, Tree, Select, Row, Col, Button, message, TreeSelect, Tooltip, Table, Collapse } from 'antd';
import { DEVICETYPE, AWARDEDAGENCIES } from '../../config/enums';
import styles from './RoleInfo.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { TreeNode } = Tree;
const { Option } = Select;
const { Panel } = Collapse;
const TreeNode2 = Tree.TreeNode;
const { Search } = Input;
class RoleInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authexpandedKeys: [],
      resourceexpandedKeys: [],
      autoExpandParent: true,
      areaValue: '-1',
      typeValue: '-1',
      funcValue: '-1',
      activeKeys: ['1'],
      searchText: '',
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        pageSize: 10,
        total: null,
        onShowSizeChange: (() => {
          setTimeout(() => {
            window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
          }, 1000);
        }),
      },
    };
    this.onauthExpand = this.onauthExpand.bind(this);
    this.onresourceExpand = this.onresourceExpand.bind(this);
    this.onAuthCheck = this.onAuthCheck.bind(this);
    this.onResourceCheck = this.onResourceCheck.bind(this);
    this.renderAuthTreeNodes = this.renderAuthTreeNodes.bind(this);
    this.renderResourceTreeNodes = this.renderResourceTreeNodes.bind(this);
    this.handleEnumOption = this.handleEnumOption.bind(this);
    this.onAreaChange = this.onAreaChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onFuncChange = this.onFuncChange.bind(this);
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form, roleinfo } = this.props;
    if (nextProps.roleinfo !== roleinfo) {
      form.resetFields();
    }
  }

  onauthExpand(expandedKeys) {
    this.setState({
      authexpandedKeys: expandedKeys,
      autoExpandParent: false,
    });
  }

  onresourceExpand(expandedKeys) {
    this.setState({
      resourceexpandedKeys: expandedKeys,
      autoExpandParent: false,
    });
  }

  onAuthCheck(checkedKeys) {
    const { changeAuthCheck, flag } = this.props;
    if (flag !== '2') {
      changeAuthCheck(checkedKeys);
    }
  }

  onResourceCheck(checkedKeys) {
    const { changeResourceCheck, flag } = this.props;
    if (flag !== '2') {
      changeResourceCheck(checkedKeys);
    }
  }

  // 确定保存
  onSaveHandle() {
    const { form, handleAddOrEdit, flag, roleinfo, authChecked, resourceChecked } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const operList = authChecked;
        const resList = resourceChecked;
        if (operList && operList.length > 0) {
          if (flag === '1') {
            handleAddOrEdit({ newRole: values, operList, resList });
          } else if (flag === '3') {
            handleAddOrEdit({ newRole: { ...values, roleid: roleinfo.roleid }, operList, resList });
          }
        } else {
          message.error('请进行功能授权');
        }
      }
    });
    this.setState({
      areaValue: '-1',
      typeValue: '-1',
      funcValue: '-1',
      authexpandedKeys: [],
      resourceexpandedKeys: [],
    });
  }

  onSaveHandleResource() {
    const { form, handleAddOrEdit, flag, roleinfo, authChecked, resourceChecked } = this.props;
  }

  // 取消按钮
  onCancelHandle() {
    const { form, onCancel, flag } = this.props;
    form.resetFields();
    onCancel();
    if (flag === '1') {
      this.setState({
        areaValue: '-1',
        typeValue: '-1',
        funcValue: '-1',
        authexpandedKeys: [],
        resourceexpandedKeys: [],
      });
    }
  }

  // 区域下拉框选择
  onAreaChange(value) {
    this.setState({
      areaValue: value,
      resourceexpandedKeys: [value],
    });
  }

  // 类型下拉框选择
  onTypeChange(value) {
    this.setState({
      typeValue: value,
    });
  }

  // 功能下拉框选择
  onFuncChange(value) {
    this.setState({
      funcValue: value,
      authexpandedKeys: [value],
    });
  }

  onChange = (value) => {
    console.log(value);
    this.setState({ luduanValue: value });
  }

  // 主tab切换
  tabChange = (activeKey) => {
    if (activeKey == 3) {
      this.setState({ activeKeys: [] });
    } else {
      // this.setState({ activeKeys: ['1'] });
    }
  }

  collapseCallback = (key) => {
    this.setState({ activeKeys: key });
  }

  searchChange = (e) => {
    this.setState({ searchText: e.target.value });
  }

  dosearch = (value) => {
    const { dosearch } = this.props;
    dosearch(value);
  }

  clearTreeSelect = () => {
    this.setState({ searchText: '', selKeys: [] });
  }

  // 全选
  selectAll(e) {
    const { devicelist, devicelistChange, resourceChecked, devicelistOld } = this.props;
    const selectArr = []; // 当前路段下的设备
    const arr = [];
    const selectStr = resourceChecked.join(','); // 选中的设备str
    // 把选中的设备编号读出来
    if (resourceChecked.length > 0) {
      for (let i = 0; i < resourceChecked.length; i += 1) {
        selectArr.push(resourceChecked[i]);
      }
    }
    if (devicelist.length > 0) {
      for (let j = 0; j < devicelist.length; j += 1) {
        arr.push(devicelist[j].deviceid);
      }
    }
    if (e.target.name == '全选') { // 全选
      if (selectStr.length > 0) {
        for (let i = 0; i < devicelist.length; i += 1) {
          if (selectStr.indexOf(devicelist[i].deviceid) == -1) {
            selectArr.push(devicelist[i].deviceid);
          }
        }
        devicelistChange(selectArr);
      } else { // 字段本身没有设备
        devicelistChange(arr);
      }
    } else { // 取消全选
      for (let i = 0; i < devicelist.length; i += 1) {
        for (let j = 0; j < selectArr.length; j += 1) {
          if (devicelist[i].deviceid == selectArr[j]) {
            selectArr.splice(j, 1);
          }
        }
      }
      devicelistChange(selectArr);
    }
  }

  DeviceTreeSelect(selectedKeysNode, e) {
    const { onNodeSelect } = this.props;
    onNodeSelect(e.node.props.dataRef.areaid);
    this.setState({ searchText: '', selKeys: selectedKeysNode });
  }

  // 获取枚举值
  handleEnumOption(enumsid) {
    const options = [];
    const { enumList } = this.props;
    options.push(<Option key="-1" value="-1">全部</Option>);
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid === (enumsid || '')) {
        options.push(<Option key={`enuma-${enumList[i].enumvalue}`} value={enumList[i].enumvalue}>{enumList[i].enumname}</Option>);
      }
    }
    return options;
  }

  // 获取功能下拉框选择项
  handleFuncOption() {
    const { authtree } = this.props;
    const options = [];
    options.push(<Option key="-1" value="-1">全部</Option>);
    for (let i = 0; i < authtree.length; i += 1) {
      const auth = authtree[i];
      options.push(<Option key={auth.key} value={auth.key}>{auth.title}</Option>);
    }
    return options;
  }

  // 构建授权树
  renderAuthTreeNodes(data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderAuthTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  // 构建资源树
  renderResourceTreeNodes(data) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderResourceTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  render() {
    const { form, roleinfo, flag, authtree, authChecked, resourcetree, resourceChecked, userlist,
      loading, paginationMem, onMemPageChange, menuList, onNodeSelect,
      devicelist, devicelistChange, loadingInfo, saveLoadingDevice, devicelistOld } = this.props;
    const {
      authexpandedKeys,
      resourceexpandedKeys,
      autoExpandParent,
      areaValue,
      funcValue,
      typeValue,
      luduanValue,
      activeKeys,
      searchText,
      selKeys,
      pagination,
    } = this.state;
    const All = () => {
      const arr = [];
      for (let k = 0; k < devicelist.length; k += 1) {
        arr.push(devicelist[k].deviceid);
      }
      const newarr = [];
      for (let i = 0; i < arr.length; i += 1) {
        for (let j = 0; j < resourceChecked.length; j += 1) {
          if (arr[i] == resourceChecked[j]) {
            newarr.push(arr[i]);
          }
        }
      }
      if ((arr.toString() == newarr.toString()) && arr.length > 0) {
        return '取消全选';
      } else {
        return '全选';
      }
    };
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      style: { height: '20px' },
    };
    const tableprops = {
      columns: [
        {
          title: '设备编号',
          width: '40%',
          dataIndex: 'deviceid',
          key: 'deviceid',
          align: 'center',
        },
        {
          title: '设备位置',
          width: '60%',
          dataIndex: 'deviceaddress',
          key: 'deviceaddress',
          align: 'center',
          render: (text) => {
            return (
              <div className={styles.textOverflow}>
                <Tooltip title={text}>
                  <span>{text}</span>
                </Tooltip>
              </div>
            );
          },
        },
      ],
      onChange: (page) => {
        this.setState({
          pagination: {
            current: page.current,
            pageSize: page.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            total: null,
            onShowSizeChange: (() => {
              setTimeout(() => {
                window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
              }, 1000);
            }),
          },
        });
      },
    };
    const rowSelection = {
      selectedRowKeys: resourceChecked,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys:', selectedRowKeys);
        devicelistChange(selectedRowKeys);
      },
      // getCheckboxProps: record => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    };
    const loop = data => data.map((item) => {
      if (item.lstSubGroup && item.lstSubGroup.length) {
        return (
          <TreeNode2 key={item.id} title={item.name} dataRef={item}>
            {loop(item.lstSubGroup)}
          </TreeNode2>
        );
      }
      return <TreeNode2 key={item.id} title={item.name} dataRef={item} />;
    });
    // 根据区域过滤资源树
    let resourcetreeData = [];
    if (areaValue !== '-1') {
      resourcetreeData = resourcetree.filter((x) => { return x.key === areaValue; });
    } else {
      resourcetreeData = resourcetree;
    }
    // 根据类型过滤资源树
    let resourcetreedatafilter = [];
    if (typeValue !== '-1') {
      for (let i = 0; i < resourcetreeData.length; i += 1) {
        const data = resourcetreeData[i];
        let trueChildren = [];
        if (data && data.children) {
          trueChildren = data.children.filter((x) => {
            return x && x.type && x.type.includes(typeValue);
          });
        }
        if (trueChildren.length !== 0) {
          resourcetreedatafilter.push({ ...data, children: trueChildren });
        }
      }
    } else {
      resourcetreedatafilter = resourcetreeData;
    }
    // 根据功能过滤授权树
    let authtreeData = [];
    if (funcValue !== '-1') {
      authtreeData = authtree.filter((x) => { return x.key === funcValue; });
    } else {
      authtreeData = authtree;
    }
    const className = `${styles.roleInfo} outline-out`;
    return (
      <div className={className}>
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Collapse bordered={false} defaultActiveKey={['1']} activeKey={activeKeys} onChange={this.collapseCallback}>
              <Panel header="角色详细信息" key="1">
                <Form>
                  <FormItem {...formItemLayout} label="角色名称">
                    {getFieldDecorator('rolename', {
                      initialValue: roleinfo.rolename,
                      rules: [{
                        required: true,
                        message: '请填写角色名称！',
                      }],
                    })(
                      <Input placeholder="" maxLength="32" disabled={flag === '2' || flag === '3'} />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="描述">
                    {getFieldDecorator('detail', {
                      initialValue: roleinfo.detail,
                    })(
                      <TextArea maxLength="200" disabled={flag === '2'} />
                    )}
                  </FormItem>
                </Form>
              </Panel>
            </Collapse>
          </div>
          <div className="outline-inner-padding">
            <Tabs type="card" onChange={(activeKey) => { this.tabChange(activeKey); }}>
              <TabPane tab="拥有该权限的人员" key="1">
                <div style={{ height: '600px', padding: '10px' }}><span>{userlist.join(',')}</span></div>
              </TabPane>
              <TabPane tab="功能授权" key="2">
                <div className="outline-inner-padding">
                  <Form>
                    <Row>
                      <Col span={12}>
                        <FormItem {...formItemLayout} label="">
                          {getFieldDecorator('functionSelect', {
                            initialValue: '-1',
                          })(
                            <Select onChange={this.onFuncChange}>
                              {this.handleFuncOption()}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={12} style={{ textAlign: 'right' }}>
                        <Button
                          type="primary"
                          style={{ margin: '0 5px', display: flag === '2' ? 'none' : 'inline-table' }}
                          onClick={() => { this.onSaveHandle(); }}
                        >保存功能授权
                        </Button>
                        <Button
                          type="primary"
                          style={{ margin: '0 3px', display: flag === '2' ? 'none' : 'inline-table' }}
                          onClick={() => { this.onCancelHandle(); }}
                        >取消
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                  <Tree
                    checkable
                    onExpand={this.onauthExpand}
                    expandedKeys={authexpandedKeys}
                    autoExpandParent={autoExpandParent}
                    checkedKeys={authChecked}
                    onCheck={this.onAuthCheck}
                  >
                    {this.renderAuthTreeNodes(authtreeData)}
                  </Tree>
                </div>
              </TabPane>
              <TabPane tab="资源授权" key="3">
                <div className="outline-inner-padding">
                  <Row>
                    <Col span={7}>
                      <Search
                        placeholder="请输入设备编号"
                        value={searchText}
                        onSearch={(value) => { this.dosearch(value); }}
                        onChange={this.searchChange}
                        style={{ width: 200 }}
                      />
                    </Col>
                    <Col span={9}>
                      <Button
                        type="primary"
                        style={{ margin: '0 5px' }}
                        onClick={(e) => { this.selectAll(e); }}
                        disabled={!(devicelist.length)}
                        name={All()}
                      >{All()}
                      </Button>
                      <span>共{devicelist.length}个,选择了{resourceChecked.length}个</span>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      <Button
                        type="primary"
                        style={{ margin: '0 5px', display: flag === '2' ? 'none' : 'inline-table' }}
                        loading={saveLoadingDevice}
                        onClick={() => { this.onSaveHandle(); }}
                      >保存资源授权
                      </Button>
                      <Button
                        type="primary"
                        style={{ margin: '0 3px', display: flag === '2' ? 'none' : 'inline-table' }}
                        onClick={() => { this.onCancelHandle(); }}
                      >取消
                      </Button>
                    </Col>
                  </Row>
                </div>
                <Row style={{ height: '620px' }}>
                  <Col span={10}>
                    <Tree
                      autoExpandParent
                      onSelect={
                        (selectedKeysNode, e) => {
                          this.DeviceTreeSelect(selectedKeysNode, e);
                        }}
                      loading={loadingInfo}
                      selectedKeys={selKeys}
                    >
                      {loop(menuList)}
                    </Tree>
                  </Col>
                  <Col span={14}>
                    <Table
                      rowClassName={
                        (record, index) => { return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow'; }}
                      dataSource={devicelist}
                      rowSelection={rowSelection}
                      locale={{ emptyText: '暂无数据' }}
                      rowKey="deviceid"
                      pagination={pagination}
                      loading={loadingInfo}
                      scroll={{ y: 500 }}
                      {...tableprops}
                    />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}
RoleInfo.prototypes = {
  loading: PropTypes.bool,
  flag: PropTypes.string,
  roleinfo: PropTypes.object,
  authtree: PropTypes.array,
  authChecked: PropTypes.array,
  resourcetree: PropTypes.array,
  resourceChecked: PropTypes.array,
  enumList: PropTypes.array,
};
export default Form.create()(RoleInfo);
