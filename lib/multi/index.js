import "core-js/modules/es6.regexp.search";
import "core-js/modules/es6.object.assign";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import React from 'react';
import Search from '@beisen-phoenix/search';
import Button from '@beisen-phoenix/button';
import Tree from '../common/tree';
import List from '../common/list';
import Check from '../common/check';
import Arrow from './arrow';
import Table from './table';
import Count from './count';
import './index.css';

var Multi =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Multi, _React$Component);

  function Multi(props) {
    var _this;

    _classCallCheck(this, Multi);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Multi).call(this));

    _this.onShowDisableChange = function (props, e) {
      _this.props.onShowDisabledData(e.target.checked);
    };

    _this.onIncludSubChange = function (props, e) {
      _this.setState({
        withSub: e.target.checked
      });
    };

    _this.onSelect = function (department) {
      var withSub = _this.state.withSub;

      _this.props.onSelect(Object.assign({}, department, {
        withSub: withSub
      }));
    };

    var showDisableCheck = typeof props.showDisableCheck === 'boolean' ? props.showDisableCheck : true;
    _this.state = {
      showDisableCheck: showDisableCheck,
      withSub: true
    };
    return _this;
  }

  _createClass(Multi, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          withSub = _this$state.withSub,
          showDisableCheck = _this$state.showDisableCheck;
      var _this$props = this.props,
          treeData = _this$props.treeData,
          searchValue = _this$props.searchValue,
          searchData = _this$props.searchData,
          showDisable = _this$props.showDisable,
          tableData = _this$props.tableData,
          selectedData = _this$props.selectedData,
          treeLoading = _this$props.treeLoading,
          searchLoading = _this$props.searchLoading,
          leftTitle = _this$props.leftTitle,
          rightTitle = _this$props.rightTitle,
          maxCount = _this$props.maxCount,
          columns = _this$props.columns,
          onExpand = _this$props.onExpand,
          onSelect = _this$props.onSelect,
          onSelectSibling = _this$props.onSelectSibling,
          onDoubleClick = _this$props.onDoubleClick,
          onSearchChange = _this$props.onSearchChange,
          onMove = _this$props.onMove,
          onCheck = _this$props.onCheck,
          onCancel = _this$props.onCancel,
          onSubmit = _this$props.onSubmit;
      var showSearchList = !!searchValue;
      return React.createElement("div", {
        className: "department-multi"
      }, React.createElement("div", {
        className: "department-multi-top"
      }, React.createElement("div", {
        className: "department-multi-left"
      }, React.createElement("div", {
        className: "department-multi-check"
      }, React.createElement(Check, {
        title: leftTitle || '可选组织',
        label: "显示停用",
        checked: showDisable,
        onChange: this.onShowDisableChange
      })), React.createElement("div", {
        className: "department-multi-search"
      }, React.createElement(Search, {
        prefix: "Search",
        placeholder: "\u641C\u7D22",
        value: searchValue,
        onChange: onSearchChange
      })), React.createElement("div", {
        className: "department-multi-wrap"
      }, React.createElement("div", {
        className: "department-multi-tree"
      }, React.createElement(Tree, {
        multi: true,
        treeData: treeData,
        loading: treeLoading,
        showDisable: showDisable,
        onSelect: onSelect,
        onExpand: onExpand,
        onSelectSibling: onSelectSibling,
        onDoubleClick: onDoubleClick
      })), // 搜索关键字不为空时显示列表
      showSearchList && React.createElement("div", {
        className: "department-multi-list"
      }, React.createElement(List, {
        multi: true,
        searchValue: searchValue,
        searchData: searchData,
        loading: searchLoading,
        showDisable: showDisable,
        onSelect: onSelect
      })))), React.createElement("div", {
        className: "department-multi-center"
      }, React.createElement(Arrow, {
        showList: showSearchList,
        treeSelected: !!selectedData.tree.length,
        searchSelected: !!selectedData.search.length,
        tableSelected: !!selectedData.table.length,
        onMove: onMove
      })), React.createElement("div", {
        className: "department-multi-right"
      }, React.createElement(Count, {
        title: rightTitle || '已选组织',
        selectedCount: tableData.length,
        maxCount: maxCount
      }), React.createElement(Table, {
        data: tableData,
        columns: columns,
        onSelect: onSelect,
        onCheck: onCheck,
        onDoubleClick: onDoubleClick
      }))), React.createElement("div", {
        className: "department-multi-bottom"
      }, React.createElement(Button, {
        size: "small",
        type: "normal",
        margin: "0 8px 0 0",
        onClick: onCancel
      }, "\u53D6\u6D88"), React.createElement(Button, {
        size: "small",
        onClick: onSubmit
      }, "\u786E\u5B9A")));
    }
  }]);

  return Multi;
}(React.Component);

export { Multi as default };