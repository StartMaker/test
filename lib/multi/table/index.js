import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import React from 'react';
import Table from 'antd/lib/table';
import 'antd/lib/table/style/index.css'; // import Checkbox from 'antd/lib/checkbox';
// import 'antd/lib/checkbox/style/index.css';

import Tooltip from '@beisen-phoenix/tooltip';
import Checkbox from '@beisen-phoenix/checkbox';
import { addResizeListener, removeResizeListener } from '@beisen/common-func';
import './index.css';

var TableBox =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TableBox, _React$Component);

  function TableBox(props) {
    var _this;

    _classCallCheck(this, TableBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TableBox).call(this));

    _this.onTableResize = function () {
      var tr = _this.table.querySelector('table');

      var trWidth = tr && tr.clientWidth;
      var _this$table = _this.table,
          offsetWidth = _this$table.offsetWidth,
          clientHeight = _this$table.clientHeight,
          scrollHeight = _this$table.scrollHeight;

      if (clientHeight < scrollHeight) {
        _this.thead.style.paddingRight = offsetWidth - trWidth + 'px';
      } else {
        _this.thead.style.paddingRight = 0;
      }
    };

    _this.onRow = function (node) {
      var _this$props = _this.props,
          onSelect = _this$props.onSelect,
          _onDoubleClick = _this$props.onDoubleClick;
      return {
        onClick: function onClick(e) {
          onSelect(node, !node.selectedInTable, 'table');
        },
        onDoubleClick: function onDoubleClick(e) {
          // e.target.addEventListener('DOMNodeRemoved', () => console.log('onDoubleClick'));
          _onDoubleClick(node, 'table');
        }
      };
    };

    _this.rowClassName = function (node, index) {
      var selectedInTable = node.selectedInTable;
      return !!selectedInTable ? 'department-table-item-selected' : 'department-table-item';
    };

    var onCheck = props.onCheck;
    console.log(props);
    _this.state = {
      tableWidth: 352,
      tableHeight: 288
    };
    _this.thead = null;
    _this.table = null;
    _this.columns = [{
      title: '组织名称',
      dataIndex: 'departmentName',
      key: 'departmentName',
      className: 'department-table-name',
      render: function render(value, node) {
        var departmentStatus = node.departmentStatus;
        value += departmentStatus ? '' : '(已停用)';
        return React.createElement(Tooltip, {
          title: value,
          showOverflowTooltip: true
        }, React.createElement("span", {
          className: "department-table-text"
        }, value));
      }
    }, {
      title: '上级组织',
      dataIndex: 'parentDepartmentName',
      key: 'parentDepartmentName',
      className: 'department-table-parent',
      render: function render(value, node) {
        return React.createElement(Tooltip, {
          title: value,
          showOverflowTooltip: true
        }, React.createElement("span", {
          className: "department-table-text"
        }, value));
      }
    }, {
      title: '包含下级',
      dataIndex: 'withSub',
      key: 'withSub',
      className: 'department-table-withsub',
      render: function render(value, node) {
        var withSubEnable = node.withSubEnable;
        var isDisabled = !withSubEnable && !value;
        var tipText = isDisabled ? '您没有此组织设置包含全部下级的权限' : '包含全部下级';
        return React.createElement("span", {
          className: "department-table-check",
          onDoubleClick: function onDoubleClick(e) {
            return e.stopPropagation();
          },
          onClick: function onClick(e) {
            e.stopPropagation();
          }
        }, React.createElement(Tooltip, {
          title: tipText
        }, React.createElement(Checkbox, {
          disabled: isDisabled,
          checked: !!value,
          onChange: function onChange(e) {
            props.onCheck(node, !value);
          }
        })));
      }
    }];
    return _this;
  }

  _createClass(TableBox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.thead = document.querySelector('.department-table .ant-table-header');
      this.table = document.querySelector('.department-table .ant-table-body');
      var tableWrap = document.querySelector('.department-table');
      addResizeListener(this.table, this.onTableResize);
      var offsetWidth = tableWrap.offsetWidth,
          offsetHeight = tableWrap.offsetHeight; // const table = document.querySelector('.department-table .ant-table-body table');
      // table.style.width = offsetWidth + 'px';

      this.setState({
        tableWidth: offsetWidth - 10,
        tableHeight: offsetHeight - 40
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      removeResizeListener(this.table, this.onTableResize);
    }
  }, {
    key: "render",
    value: function render() {
      var tableHeight = this.state.tableHeight;
      var _this$props2 = this.props,
          data = _this$props2.data,
          columns = _this$props2.columns;
      var tableColumn = typeof columns === 'array' && columns.length > 0 ? columns : this.columns;
      return React.createElement("div", {
        className: "department-table"
      }, React.createElement("div", {
        className: "department-table-bd"
      }, React.createElement(Table, {
        rowKey: "departmentId",
        className: "department-table-wrap",
        columns: tableColumn,
        dataSource: data,
        rowClassName: this.rowClassName,
        pagination: false,
        onRow: this.onRow,
        size: "small",
        scroll: {
          y: tableHeight
        },
        locale: {
          emptyText: '请从左侧选择'
        }
      })));
    }
  }]);

  return TableBox;
}(React.Component);

export { TableBox as default };
;