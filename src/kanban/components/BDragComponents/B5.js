/**
 * Created by Administrator on 2017/12/19 0019.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';

import moment from 'moment';
import { Card, notification, Table, Modal, Badge, Icon } from 'antd';
import AnnounceInfoModal from './AnnounceInfoModal';
import AnnounceListModal from './AnnounceListModal';
import Ellipsis from '../Ellipsis';
import { announceTypes } from '../../utils/utils';
import * as wbcService from '../../services/user';
import styles from './Card.less';

export class B5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      recordprops: {},
    };
  }

  componentWillMount() {
    // basiclayout 里面更新了
    /* dispatch({
      type: 'user/getNoticeList'',
      payload: {},
    }); */
  }

  onRowDoubleClick = record => {
    const { dispatch } = this.props;

    const queryobj = { noticeId: record.notice_id };
    dispatch({
      type: 'user/getNoticeInfo',
      payload: { queryobj: { ...queryobj } },
    });
    if (record.is_read == 0) {
      dispatch({
        type: 'user/updateNoticeReadStatus',
        payload: { queryobj: { noticeId: record.id } },
      });
    }

    this.setState({
      open: true,
      recordprops: record,
      recordNoticeType: record.notice_type,
    });
  };

  hideModelHandler = () => {
    const { dispatch } = this.props;
    const { recordprops, recordNoticeType } = this.state;

    this.setState({
      open: false,
    });

    dispatch({
      type: 'user/getNoticeList',
    });
    if (recordNoticeType == '1' && recordprops.is_signed == 0) {
      const noticeId = { ...{ noticeId: recordprops.notice_id } };
      wbcService
        .signIn({ queryobj: noticeId })
        .then(data => {
          if (data.returnCode == 0) {
            notification.success({
              message: '提示',
              description: '签收成功！',
            });
          } else {
            Modal.error({
              title: '提示',
              content: '签收失败',
            });
          }
        })
        .catch(e => {
          Modal.warning({ title: '提示信息', content: `请检查网络连接${e}` });
        });
    }
  };

  render() {
    const { bigStyle, noticeList = [], noticeInfo } = this.props;
    const { recordNoticeType, open, recordprops } = this.state;
    // notice_type：  0：阅读公告；1：签收公告；2：通知。
    let dataSource = noticeList.filter(element => {
      const arr = ['0', '1'];
      let cc = false;
      for (const i of arr) {
        if (element.notice_type == arr[i]) {
          cc = true;
          break;
        }
      }
      return cc;
    });
    if (!Array.isArray(dataSource)) {
      dataSource = [];
    }
    if (bigStyle == 'big') {
      dataSource = dataSource.filter((element, index) => {
        return index < 5;
      });
    } else {
      dataSource = dataSource.filter((element, index) => {
        return index < 2;
      });
    }
    const columns = [
      {
        title: '',
        dataIndex: 'icon',
        key: 'icon',
        className: 'tablefield',
        width: '8%',
        render: (text, record, index) => {
          return (
            <span>
              {record.is_read == '0' ? <Badge status="error" /> : <Icon type="message" />}
            </span>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'notice_type',
        key: 'type',
        className: 'tablefield',
        width: '20%',
        render: (text, record, index) => {
          return (
            <span
              style={{
                fontWeight: record.is_read != '0' ? 'normal' : 'bold',
                fontSize: bigStyle == 'big' ? '14px' : '12px',
              }}
            >
              {announceTypes(text)}
            </span>
          );
        },
      },
      {
        title: '标题',
        dataIndex: 'notice_title',
        key: 'title',
        className: 'tablefield',
        width: '35%',
        render: (text, record, index) => (
          <span
            style={{
              fontWeight: record.is_read != '0' ? 'normal' : 'bold',
              fontSize: bigStyle == 'big' ? '14px' : '12px',
            }}
          >
            <Ellipsis tooltip lines={1}>
              {text}
            </Ellipsis>
          </span>
        ),
      },
      {
        title: '时间',
        dataIndex: 'pubtime',
        key: 'time',
        className: 'tablefield',
        width: '30%',
        render: (text, record, index) => (
          <span
            style={{
              fontWeight: record.is_read != '0' ? 'normal' : 'bold',
              fontSize: bigStyle == 'big' ? '14px' : '12px',
            }}
          >
            {moment(text).format('YYYY-MM-DD')}
          </span>
        ),
      },
    ];

    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
    });
    return (
      <div>
        <Card
          bordered={false}
          className={bsytle}
          extra={
            <AnnounceListModal record={noticeList}>
              <u
                style={{
                  cursor: 'pointer',
                  fontSize: bigStyle == 'big' ? '14px' : '12px',
                  display: bigStyle == 'big' ? '' : 'none',
                }}
              >
                更多
              </u>
            </AnnounceListModal>
          }
          title={<span className={styles.title}>公告</span>}
        >
          <AnnounceInfoModal
            visible={open}
            record={noticeInfo}
            recordNoticeType={recordNoticeType}
            onCancel={this.hideModelHandler}
            currentSelectRecord={recordprops}
          />
          <div className={styles.b5}>
            <Table
              pagination={false}
              columns={columns}
              dataSource={dataSource}
              size="small"
              className="listTable"
              rowClassName={(record, index) => {
                return index % 2 === 0 ? styles.tableoddRow : styles.tableevenRow;
              }}
              onRow={(record, index) => ({
                index,
                onDoubleClick: this.onRowDoubleClick.bind(record),
              })}
            />
          </div>
        </Card>
      </div>
    );
  }
}
export default connect(({ user }) => ({
  noticeList: user.noticeList,
  noticeInfo: user.noticeInfo,
}))(B5);
