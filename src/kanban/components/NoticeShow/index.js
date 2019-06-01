import React from 'react';
import { Table } from 'antd';

import styles from './index.less';

export default ({ tongzhiData, rowClickCallback }) => {
  const tontzhiColumns = [{
    title: '标题',
    dataIndex: 'notice_title',
    key: 'title',
    className: 'tablefield',
    width: '50%',
  }, {
    title: '时间',
    dataIndex: 'pubtime',
    key: 'pubtime',
    className: 'tablefield',
    width: '30%',
  }];
  function rowClick(record, index) {
    rowClickCallback(record);
  }
  return (
    <div className={styles.component}>
      <Table
        pagination={false}
        columns={tontzhiColumns}
        dataSource={tongzhiData}
        size="small"
        rowClassName={(record, index) => {
          return '';
        }}
        className="listTable"
        rowKey={record => record.id}
        // onRow ={(record,index)=>rowClick(record,index)}
        onRowDoubleClick={record => rowClick(record)}
      />
    </div>
  );
};
