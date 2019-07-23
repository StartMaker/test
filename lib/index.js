import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import "core-js/modules/es6.array.find-index";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import React from 'react';
import Search from './common/search';
import Single from './single';
import Multi from './multi';

var Department =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Department, _React$Component);

  function Department(props) {
    var _this$state5;

    var _this;

    _classCallCheck(this, Department);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Department).call(this));

    _this.onExpand = function (department, expand) {
      department.expand = expand;

      if (expand && (!department.Children || !department.Children.length)) {
        //异步获取数据
        var departmentId = department.departmentId,
            departmentName = department.departmentName,
            departmentStatus = department.departmentStatus,
            withSubEnable = department.withSubEnable;
        var onExpand = _this.props.onExpand;
        department.loading = true;

        _this.refreshShowData('tree');

        onExpand({
          departmentId: departmentId,
          departmentName: departmentName,
          departmentStatus: departmentStatus,
          withSubEnable: withSubEnable
        }).then(function (subDepartment) {
          _this.setTreeDataParam(subDepartment, department);

          department.Children = subDepartment;
          department.allChildrenSelected = false;
          department.loading = false;

          _this.refreshShowData('tree');
        }).catch(function () {});
      } else {
        _this.refreshShowData('tree');
      }
    };

    _this.onSelect = function (department, selected, from) {
      var _this$state = _this.state,
          multi = _this$state.multi,
          selectedData = _this$state.selectedData,
          showDisable = _this$state.showDisable;

      if (!multi) {
        var departmentId = department.departmentId,
            departmentName = department.departmentName,
            withSub = department.withSub;

        _this.props.onSubmit({
          departmentId: departmentId,
          departmentName: departmentName,
          withSub: withSub
        });
      } else {
        var targetSelectedData = selectedData[from];

        if (from == 'table') {
          department.selectedInTable = selected;
        } else {
          department.selected = selected;

          if (from == 'tree') {
            if (selected) {
              _this.checkAllChildrenSelected(department.parent, showDisable);
            } else {
              department.parent.allChildrenSelected = false;
            }
          }
        }

        if (selected) {
          targetSelectedData.push(department);
        } else {
          var index = targetSelectedData.indexOf(department);
          index >= 0 && targetSelectedData.splice(index, 1);
        }

        _this.setState({
          selectedData: selectedData
        });

        _this.refreshShowData(from);
      }
    };

    _this.onSelectSibling = function (parent) {
      var showDisable = _this.state.showDisable;
      var allChildrenSelected = parent.allChildrenSelected,
          Children = parent.Children;
      parent.allChildrenSelected = !allChildrenSelected;
      Children.forEach(function (child) {
        if (showDisable || child.departmentStatus) {
          child.selected = !allChildrenSelected;
        }
      });

      _this.refreshShowData('tree');
    };

    _this.checkAllChildrenSelected = function (department, showDisable) {
      var _department$Children = department.Children,
          Children = _department$Children === void 0 ? [] : _department$Children;
      var hasUnSelected = Children.some(function (child) {
        if (!showDisable) {
          return child.departmentStatus && !child.selected;
        } else {
          return !child.selected;
        }
      });
      department.allChildrenSelected = Children.length > 0 ? !hasUnSelected : false;

      _this.refreshShowData('tree');
    };

    _this.onDoubleClick = function (department, from) {
      var _this$state2 = _this.state,
          selectedData = _this$state2.selectedData,
          tableData = _this$state2.tableData;
      var index = tableData.findIndex(function (item) {
        return item.departmentId == department.departmentId;
      });
      index != -1 && tableData.splice(index, 1);

      if (from != 'table') {
        selectedData['table'].forEach(function (node) {
          node.selectedInTable = false;
        }); // department.selected = false;

        department.withSub = false;
        department.selectedInTable = true;
        tableData.unshift(department);
        _this.tbody.scrollTop = 0;
      }

      _this.refreshShowData('table');
    };

    _this.onShowDisabledData = function (checked) {
      _this.traverseTreeData([_this.virtualRoot], function (department) {
        if (checked && !department.departmentStatus) {
          department.selected = false;
        }

        _this.checkAllChildrenSelected(department, checked);
      });

      _this.setState({
        showDisable: checked
      }, _this.refreshShowData.bind(_assertThisInitialized(_this), 'tree'));
    };

    _this.onSearchChange = function (value) {
      var onSearchChange = _this.props.onSearchChange;

      _this.setState({
        searchValue: value,
        searchLoading: true
      });

      onSearchChange(value).then(function (searchData) {
        _this.setState({
          searchData: searchData,
          searchLoading: false
        });
      }).catch(function () {});
    };

    _this.onMove = function (type) {
      var _this$state3 = _this.state,
          searchValue = _this$state3.searchValue,
          selectedData = _this$state3.selectedData,
          tableData = _this$state3.tableData;
      var from = '';
      var _tableData = [];

      if (type == 'remove') {
        from = 'table';
      } else {
        if (searchValue) {
          from = 'search';
        } else {
          from = 'tree';
        }

        selectedData['table'].forEach(function (node) {
          node.selectedInTable = false;
        });
      } // 清除选中状态


      selectedData[from].forEach(function (node) {
        var index = tableData.findIndex(function (item) {
          return item.departmentId == node.departmentId;
        });
        index != -1 && tableData.splice(index, 1);

        if (from == 'table') {
          node.selectedInTable = false;
        } else {
          node.withSub = false;
          node.selected = false;
          node.selectedInTable = true;
          node.parent && (node.parent.allChildrenSelected = false);

          _tableData.push(node);
        }
      }); // this.setState({
      //   tableData: tableData.unshift(..._tableData)
      // });

      tableData.unshift.apply(tableData, _tableData);

      if (from != 'table') {
        _this.refreshShowData('table');

        _this.tbody.scrollTop = 0;
      }

      _this.refreshShowData(from);
    };

    _this.onCheck = function (department, checked) {
      department.withSub = checked;

      _this.refreshShowData('table');
    };

    _this.dealRootData = function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var map = {},
          tree = [],
          length = data.length;
      data.forEach(function (node) {
        if (node.hasChildrenEnable || node.hasChildrenDisabled) {
          node.Children = [];
        }

        map[node.departmentId] = node;
      });

      for (var i = 0; i < length; i++) {
        var node = data[i];
        var parent = map[node.parentDepartmentId];

        if (parent) {
          node.parent = parent;

          if (parent.Children) {
            parent.Children.push(node);
          } else {
            parent.Children = [node];
            console.info("".concat(node.departmentId, "\u7684\u7236\u7EA7\u4E3A").concat(parent.departmentId, "\uFF0C\u7236\u7EA7\u7684HasChildrenEnable\u548CHasChildrenDisabled\u5747\u4E3Afalse"));
          }
        } else {
          tree.push(node);
        }
      }

      _this.setTreeDataParam(tree, _this.virtualRoot);

      return tree;
    };

    _this.setTreeDataParam = function () {
      var tree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var parent = arguments.length > 1 ? arguments[1] : undefined;
      var _parent$level = parent.level,
          level = _parent$level === void 0 ? -1 : _parent$level;
      level += 1;

      for (var i = 0, l = tree.length; i < l; i++) {
        var node = tree[i];
        node.level = level; // 默认未选中状态

        node.selected = false;
        node.allChildrenSelected = false;
        node.parent = parent;

        if (level == 0) {
          // 一级节点默认展开
          node.expand = true;
          node.parentDepartmentName = '';
        } else {
          node.parentDepartmentName = parent.departmentName;
        }

        if (node.hasChildrenEnable || node.hasChildrenDisabled) {
          node.Children = node.Children || [];
        }

        if (node.Children && node.Children.length) {
          _this.setTreeDataParam(node.Children, node);
        }
      }
    };

    _this.findDepartmentById = function (id) {
      var departments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.mainTreeData;

      for (var i = 0; i < departments.length; i++) {
        var dep = departments[i];

        if (dep.departmentId == id) {
          return dep;
        } else if (dep.Children && dep.Children.length) {
          var targetDep = _this.findDepartmentById(id, dep.Children);

          if (targetDep) return targetDep;
        }
      }

      return false;
    };

    _this.traverseTreeData = function (data, fn) {
      for (var i = 0; i < data.length; i++) {
        var department = data[i];
        fn(department);
        department.Children && department.Children.length && _this.traverseTreeData(department.Children, fn);
      }
    };

    _this.getTreeData = function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.mainTreeData;
      var treeData = [];
      var selectedTree = [];
      var showDisable = _this.state.showDisable;

      for (var i = 0; i < data.length; i++) {
        var department = data[i];
        department.selected && selectedTree.push(department);

        if (showDisable || department.departmentStatus) {
          treeData.push(department);

          if (department.expand && department.Children && department.Children.length) {
            var _this$getTreeData = _this.getTreeData(department.Children),
                _this$getTreeData2 = _slicedToArray(_this$getTreeData, 2),
                _treeData = _this$getTreeData2[0],
                _selectedTree = _this$getTreeData2[1];

            treeData.push.apply(treeData, _toConsumableArray(_treeData));
            selectedTree.push.apply(selectedTree, _toConsumableArray(_selectedTree));
          }
        }
      }

      return [treeData, selectedTree];
    };

    _this.refreshShowData = function (from) {
      var _this$state4 = _this.state,
          selectedData = _this$state4.selectedData,
          searchData = _this$state4.searchData,
          tableData = _this$state4.tableData; // const { searchValue } = this.props;

      if (from == 'tree') {
        var _this$getTreeData3 = _this.getTreeData(),
            _this$getTreeData4 = _slicedToArray(_this$getTreeData3, 2),
            treeData = _this$getTreeData4[0],
            _selectedTree = _this$getTreeData4[1];

        selectedData[from] = _selectedTree;

        _this.setState({
          treeData: treeData,
          selectedData: selectedData
        });
      } else if (from == 'search') {
        var _selectedSearch = searchData.filter(function (node) {
          return !!node.selected;
        });

        selectedData[from] = _selectedSearch;

        _this.setState({
          searchData: searchData,
          selectedData: selectedData // showSearchList: !!searchValue

        });
      } else {
        var _selectedTable = tableData.filter(function (node) {
          return !!node.selectedInTable;
        });

        selectedData[from] = _selectedTable;

        _this.setState({
          tableData: tableData,
          selectedData: selectedData
        });
      }
    };

    _this.onCancel = function (e) {
      var onCancel = _this.props.onCancel;
      onCancel && onCancel(e);
    };

    _this.onSubmit = function (e) {
      var tableData = _this.state.tableData;
      var onSubmit = _this.props.onSubmit;
      var data = tableData.map(function (department) {
        var departmentId = department.departmentId,
            departmentName = department.departmentName,
            withSub = department.withSub;
        return {
          departmentId: departmentId,
          departmentName: departmentName,
          withSub: withSub
        };
      });
      onSubmit && onSubmit(data);
    };

    _this.state = (_this$state5 = {
      multi: !!props.multi,
      treeData: [],
      searchValue: '',
      searchData: [],
      tableData: [],
      searchLoading: false
    }, _defineProperty(_this$state5, "searchLoading", false), _defineProperty(_this$state5, "showDisable", false), _defineProperty(_this$state5, "selectedData", {
      tree: [],
      search: [],
      table: []
    }), _this$state5);
    _this.virtualRoot = {};
    _this.mouId = props.pageData && props.pageData.PObjectDataID;
    _this.mainTreeData = [];
    _this.mainSearchData = [];
    _this.mainTableData = [];
    _this.tbody = null;
    return _this;
  }

  _createClass(Department, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var currentTableData = this.state.tableData;
      var treeData = nextProps.treeData,
          tableData = nextProps.tableData;

      if (this.mainTreeData.length == 0) {
        this.mainTreeData = this.dealRootData(treeData);
        this.virtualRoot.Children = this.mainTreeData;
        this.refreshShowData('tree');
      }

      if (currentTableData.length == 0) {
        this.setState({
          tableData: tableData
        }, function () {
          return _this2.refreshShowData('table');
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // this.getRootData();
      this.tbody = document.querySelector('.department-multi .ant-table-tbody');
    }
    /**
     * @desc 点击展开时获取子节点
     * @param node[Object] 当前展开的节点
     * @param expand[Boolean] 是否展开
     */

  }, {
    key: "render",
    value: function render() {
      var _this$state6 = this.state,
          multi = _this$state6.multi,
          treeData = _this$state6.treeData,
          searchData = _this$state6.searchData,
          tableData = _this$state6.tableData,
          searchLoading = _this$state6.searchLoading,
          showDisable = _this$state6.showDisable,
          selectedData = _this$state6.selectedData,
          searchValue = _this$state6.searchValue;
      var _this$props = this.props,
          leftTitle = _this$props.leftTitle,
          rightTitle = _this$props.rightTitle,
          maxCount = _this$props.maxCount,
          columns = _this$props.columns;
      return multi ? React.createElement(Multi, {
        multi: multi,
        treeData: treeData,
        searchValue: searchValue,
        searchData: searchData,
        tableData: tableData,
        searchLoading: searchLoading,
        showDisable: showDisable,
        selectedData: selectedData,
        leftTitle: leftTitle,
        rightTitle: rightTitle,
        maxCount: maxCount,
        columns: columns,
        onExpand: this.onExpand,
        onSelectSibling: this.onSelectSibling,
        onDoubleClick: this.onDoubleClick,
        onSearchChange: this.onSearchChange,
        onSelect: this.onSelect,
        onMove: this.onMove,
        onCheck: this.onCheck,
        onShowDisabledData: this.onShowDisabledData,
        onCancel: this.onCancel,
        onSubmit: this.onSubmit
      }) : React.createElement(Single, {
        multi: multi,
        treeData: treeData,
        searchValue: searchValue,
        searchData: searchData,
        searchLoading: searchLoading,
        showDisable: showDisable,
        selectedData: selectedData,
        onExpand: this.onExpand,
        onSelectSibling: this.onSelectSibling,
        onSearchChange: this.onSearchChange,
        onSelect: this.onSelect,
        onShowDisabledData: this.onShowDisabledData
      });
    }
  }]);

  return Department;
}(React.Component);

export { Department as default };