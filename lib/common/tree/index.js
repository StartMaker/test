import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { AddSquareS, ReduceSquares, Loading, NoData } from '@beisen-phoenix/icon';
import './index.css';

var Item = function Item(props) {
  var expandClass = 'department-tree-collapse';
  var multi = props.multi,
      department = props.department,
      showDisable = props.showDisable,
      onSelect = props.onSelect,
      onSelectSibling = props.onSelectSibling,
      onExpand = props.onExpand,
      _onDoubleClick = props.onDoubleClick;
  var departmentName = department.departmentName,
      departmentStatus = department.departmentStatus,
      loading = department.loading,
      hasChildrenEnable = department.hasChildrenEnable,
      hasChildrenDisabled = department.hasChildrenDisabled,
      Children = department.Children,
      level = department.level,
      expand = department.expand,
      selected = department.selected,
      parent = department.parent;
  var showExpand = expand && Children && Children.length > 0;
  var showSpace = !showDisable && !hasChildrenEnable || showDisable && !hasChildrenEnable && !hasChildrenDisabled;
  var selectedClass = ['department-tree-item'];
  selected && selectedClass.push('department-tree-item-selected');
  var ExpandIcon = AddSquareS;

  if (showExpand) {
    expandClass = 'department-tree-expand';
    ExpandIcon = ReduceSquares;
  }

  if (loading) {
    expandClass = 'department-tree-loading';
    ExpandIcon = Loading;
  }

  if (showSpace) {
    expandClass = 'department-tree-space';

    ExpandIcon = function ExpandIcon() {
      return null;
    };
  }

  var onExpandClick = function onExpandClick(e) {
    e.stopPropagation();
    if (showSpace) return;
    onExpand && onExpand(department, !showExpand);
  };

  var onClick = function onClick(e) {
    e.stopPropagation();
    onSelect && onSelect(department, !selected, 'tree');
  };

  var onSiblingBtnClick = function onSiblingBtnClick(e) {
    e.stopPropagation();
    onSelectSibling && onSelectSibling(parent);
  };

  var sibling = parent.Children,
      allChildrenSelected = parent.allChildrenSelected;
  var childrenList = sibling;

  if (!showDisable) {
    childrenList = sibling.filter(function (child) {
      return child.departmentStatus;
    });
  }

  var btnText = allChildrenSelected ? '取消选中同级' : '选中同级';
  return React.createElement("div", {
    className: selectedClass.join(' '),
    onDoubleClick: function onDoubleClick() {
      return _onDoubleClick && _onDoubleClick(department, 'tree');
    }
  }, React.createElement("div", {
    className: "department-tree-node",
    onClick: onClick
  }, React.createElement("span", {
    style: {
      paddingLeft: "".concat(20 * level, "px")
    }
  }), React.createElement("span", {
    className: expandClass,
    onClick: onExpandClick,
    onDoubleClick: function onDoubleClick(e) {
      return e.stopPropagation();
    }
  }, React.createElement(ExpandIcon, {
    width: "14",
    height: "14"
  })), React.createElement("span", {
    className: "department-tree-name"
  }, departmentName, !departmentStatus && React.createElement("span", {
    className: "department-tree-status"
  }, "(\u5DF2\u505C\u7528)")), multi && childrenList.length > 1 && React.createElement("span", {
    className: "department-tree-sibling"
  }, React.createElement("span", {
    className: "department-tree-btn",
    onClick: onSiblingBtnClick
  }, btnText))));
};

var Tree = function Tree(props) {
  var multi = props.multi,
      treeData = props.treeData,
      onExpand = props.onExpand,
      onSelect = props.onSelect,
      onSelectSibling = props.onSelectSibling,
      onDoubleClick = props.onDoubleClick,
      showDisable = props.showDisable;
  return React.createElement("div", {
    className: "department-tree"
  }, treeData.length > 0 ? React.createElement("div", {
    className: "department-tree-list"
  }, treeData.map(function (department) {
    return React.createElement(Item, _extends({
      key: department.departmentId,
      department: department
    }, props));
  })) : React.createElement("div", {
    className: "department-tree-void"
  }, React.createElement(NoData, null), React.createElement("div", {
    className: "department-tree-void-desc"
  }, "\u8FD9\u91CC\u4EC0\u4E48\u90FD\u6CA1\u6709...")));
};

export default Tree;