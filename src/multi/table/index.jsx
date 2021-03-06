import React from 'react';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/index.css';
// import Checkbox from 'antd/lib/checkbox';
// import 'antd/lib/checkbox/style/index.css';
import Tooltip from '@beisen-phoenix/tooltip';
import Checkbox from '@beisen-phoenix/checkbox';
import { addResizeListener, removeResizeListener } from '@beisen/common-func';
import './index.scss';

export default class TableBox extends React.Component {
  constructor(props) {
    super();
    const { onCheck } = props;
    console.log(props)
    this.state = {
      tableWidth: 352,
      tableHeight: 288
    };
    this.thead = null;
    this.table = null;
    this.columns = [{
      title: '组织名称',
      dataIndex: 'departmentName',
      key: 'departmentName',
      className: 'department-table-name',
      render: (value, node) => {
        const { departmentStatus } = node;
        value += departmentStatus ? '' : '(已停用)';
        return (
          <Tooltip
            title={value}
            showOverflowTooltip={true}
          >
            <span className="department-table-text">{value}</span>
          </Tooltip>
        );
      }
    }, {
      title: '上级组织',
      dataIndex: 'parentDepartmentName',
      key: 'parentDepartmentName',
      className: 'department-table-parent',
      render: (value, node) => {
        return (
          <Tooltip
            title={value}
            showOverflowTooltip={true}
          >
            <span className="department-table-text">{value}</span>
          </Tooltip>
        );
      }
    }, {
      title: '包含下级',
      dataIndex: 'withSub',
      key: 'withSub',
      className: 'department-table-withsub',
      render: (value, node) => {
        const { withSubEnable } = node;
        const isDisabled = !withSubEnable && !value;
        const tipText = isDisabled ? '您没有此组织设置包含全部下级的权限' : '包含全部下级';
        return  (
          <span
            className="department-table-check"
            onDoubleClick={e => e.stopPropagation()}
            onClick={
              e => {
                e.stopPropagation();
              }
            }
          >
            <Tooltip
              title={tipText}
            >
              <Checkbox
                disabled={isDisabled}
                checked={!!value}
                onChange={e => {
                  props.onCheck(node, !value)
                }}
              />
            </Tooltip>
          </span>
        );
      }
    }];
  }
  componentDidMount() {
    this.thead = document.querySelector('.department-table .ant-table-header');
    this.table = document.querySelector('.department-table .ant-table-body');
    const tableWrap = document.querySelector('.department-table');
    addResizeListener(this.table, this.onTableResize);
    const { offsetWidth, offsetHeight } = tableWrap;
    // const table = document.querySelector('.department-table .ant-table-body table');
    // table.style.width = offsetWidth + 'px';
    this.setState({
      tableWidth: offsetWidth - 10,
      tableHeight: offsetHeight - 40
    });
  }
  componentWillUnmount() {
    removeResizeListener(this.table, this.onTableResize)
  }
  onTableResize = () => {
    const tr = this.table.querySelector('table');
    const trWidth = tr && tr.clientWidth;
    const { offsetWidth, clientHeight, scrollHeight } = this.table;
    if (clientHeight < scrollHeight) {
      this.thead.style.paddingRight = (offsetWidth - trWidth) + 'px';
    } else {
      this.thead.style.paddingRight = 0;
    }
  }
  onRow = node => {
    const { onSelect, onDoubleClick } = this.props;
    return {
      onClick: e => {
        onSelect(node, !node.selectedInTable, 'table');
      },
      onDoubleClick: e => {
        // e.target.addEventListener('DOMNodeRemoved', () => console.log('onDoubleClick'));
        onDoubleClick(node, 'table');
      }
    };
  };
  rowClassName = (node, index) => {
    const { selectedInTable } = node;
    return !!selectedInTable ? 'department-table-item-selected' : 'department-table-item';
  };
  
  render() {
    const { tableHeight } = this.state;
    const { data, columns } = this.props;
    let tableColumn = typeof columns === 'array' && columns.length > 0 ? columns : this.columns;

    return (
      <div className="department-table">
        <div className="department-table-bd">
          <Table
            rowKey="departmentId"
            className="department-table-wrap"
            columns={tableColumn}
            dataSource={data}
            rowClassName={this.rowClassName}
            pagination={false}
            onRow={this.onRow}
            size="small"
            scroll={{ y: tableHeight }}
            locale={{
              emptyText: '请从左侧选择'
            }}
          />
        </div>
      </div>
    );
  }
};