import React from 'react';
import classNames from 'classnames';
import { Left, Right } from '@beisen-phoenix/icon';
import './index.css';

var Arrow = function Arrow(props) {
  var onMove = props.onMove,
      showList = props.showList,
      treeSelected = props.treeSelected,
      searchSelected = props.searchSelected,
      tableSelected = props.tableSelected;
  var rightSelected = tableSelected;
  var leftSelected = showList ? searchSelected : treeSelected;
  var leftClass = rightSelected ? '' : ' disable';
  var rightClass = leftSelected ? '' : ' disable';
  return React.createElement("div", {
    className: "department-arrow"
  }, React.createElement("div", {
    className: 'department-arrow-btn' + leftClass,
    onClick: function onClick() {
      return onMove('remove');
    }
  }, React.createElement(Left, {
    width: "14",
    height: "14",
    color: "white"
  })), React.createElement("div", {
    className: 'department-arrow-btn' + rightClass,
    onClick: function onClick() {
      return onMove('add');
    }
  }, React.createElement(Right, {
    width: "14",
    height: "14",
    color: "white"
  })));
};

export default Arrow;