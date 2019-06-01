/**
 * Created by cherry on 2018/7/2.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon } from 'antd';
import { keyCodeMap } from '../../config/enums';

class KeyCodeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { onEdit, loading, keycodelist } = this.props;
    // 列表
    const columns = [
      {
        title: '所属界面',
        width: '20%',
        dataIndex: 'pagename',
        key: 'pagename',
        align: 'center',
      }, {
        title: '页面元素',
        width: '35%',
        dataIndex: 'pageelement',
        key: 'pageelement',
        align: 'center',
      }, {
        title: '快捷键',
        width: '35%',
        dataIndex: 'hotkey',
        key: 'hotkey',
        align: 'center',
        render: (text) => {
          let hotkey = '';
          if (text.substring(0, 1) === 'A') {
            hotkey = 'Alt+';
            if (keyCodeMap[text.substring(1)]) {
              hotkey += keyCodeMap[text.substring(1)];
            } else {
              hotkey = '';
            }
          } else if (keyCodeMap[text]) {
            hotkey = keyCodeMap[text];
          }
          return (
            <span>
              {hotkey}
            </span>
          );
        },
      }, {
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
                onClick={() => {
                  onEdit(data);
                }}
                title="编辑"
              />
            </span>
          );
        },
      }];
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={6} style={{ textAlign: 'right' }} />
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => { return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow'; }}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  onEdit(record);
                }, // 双击行显示详情
              };
            }}
            loading={loading}
            dataSource={keycodelist}
            pagination={false}
            locale={{ emptyText: '暂无数据' }}
            rowKey="nid"
            size="big"
          />
        </div>
      </div>
    );
  }
}
KeyCodeList.prototypes = {
  loading: PropTypes.bool,
  keyCodeList: PropTypes.array,
};
export default Form.create()(KeyCodeList);
