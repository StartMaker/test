import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import "core-js/modules/es6.regexp.search";
import "core-js/modules/es6.array.find-index";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import React from 'react';
import Single from './single';
import Multi from './multi';
import Message from '@beisen-phoenix/message';
import './style/index.css';

var Department =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Department, _React$Component);

  function Department(props) {
    var _this;

    _classCallCheck(this, Department);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Department).call(this));

    _this.onExpand = function (department, expand) {
      department.expand = expand;

      _this.setState({
        treeLoading: true
      });

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

          _this.setState({
            treeLoading: false
          });
        }).catch(function () {});
      } else {
        _this.refreshShowData('tree');

        _this.setState({
          treeLoading: false
        });
      }
    };

    _this.onSelect = function (department, selected, from) {
      var multi = _this.state.multi;

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
        if (from == 'tree') {
          _this.onTreeSelect(department, selected);
        } else if (from == 'search') {
          _this.onSearchSelect(department, selected);
        } else {
          _this.onTableSelect(department, selected);
        }
      }
    };

    _this.onTableSelect = function (department, selected) {
      department.selectedInTable = selected;

      _this.refreshShowData('table');
    };

    _this.onSearchSelect = function (department, selected) {
      var _this$state = _this.state,
          multi = _this$state.multi,
          selectedData = _this$state.selectedData,
          tableData = _this$state.tableData;

      if (!multi) {
        var departmentId = department.departmentId,
            departmentName = department.departmentName,
            withSub = department.withSub;

        _this.props.onSubmit({
          departmentId: departmentId,
          departmentName: departmentName,
          withSub: withSub
        });
      } else if (selected && _this.checkResidual('tree')) {
        return;
      } else {
        department.selected = selected;
        var diff = tableData.findIndex(function (item) {
          return item.departmentId == department.departmentId;
        }) < 0 ? 1 : 0;

        if (selected) {
          _this.residual.search -= diff;
        } else {
          _this.residual.search += diff;
        }

        _this.setState({
          selectedData: selectedData
        });

        _this.refreshShowData('search');
      }
    };

    _this.onTreeSelect = function (department, selected) {
      var _this$state2 = _this.state,
          multi = _this$state2.multi,
          selectedData = _this$state2.selectedData,
          tableData = _this$state2.tableData,
          showDisable = _this$state2.showDisable;

      if (!multi) {
        var departmentId = department.departmentId,
            departmentName = department.departmentName,
            withSub = department.withSub;

        _this.props.onSubmit({
          departmentId: departmentId,
          departmentName: departmentName,
          withSub: withSub
        });
      } else if (selected && _this.checkResidual('tree')) {
        return;
      } else {
        department.selected = selected;
        var diff = tableData.findIndex(function (item) {
          return item.departmentId == department.departmentId;
        }) < 0 ? 1 : 0;

        if (selected) {
          _this.checkAllChildrenSelected(department.parent, showDisable);

          _this.residual.tree -= diff;
        } else {
          department.parent.allChildrenSelected = false;
          _this.residual.tree += diff;
        }

        _this.setState({
          selectedData: selectedData
        });

        _this.refreshShowData('tree');
      }
    };

    _this.showMessage = function () {
      _this.setState({
        showMessage: true
      });
    };

    _this.hideMessage = function () {
      _this.setState({
        showMessage: false
      });
    };

    _this.onSelectSibling = function (parent) {
      var _this$state3 = _this.state,
          showDisable = _this$state3.showDisable,
          tableData = _this$state3.tableData;
      var allChildrenSelected = parent.allChildrenSelected,
          Children = parent.Children;
      var checkedStatus = !allChildrenSelected;
      var i = 0;

      var _loop = function _loop() {
        if (checkedStatus && _this.checkResidual('tree')) {
          return "break";
        }

        var child = Children[i];
        var index = tableData.findIndex(function (item) {
          return item.departmentId == child.departmentId;
        });

        if (showDisable || child.departmentStatus) {
          child.selected = checkedStatus;
          checkedStatus && index < 0 && _this.residual.tree--;
        }
      };

      for (; i < Children.length; i++) {
        var _ret = _loop();

        if (_ret === "break") break;
      }

      i == Children.length && (parent.allChildrenSelected = checkedStatus);

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

    _this.checkResidual = function (from) {
      if (_this.residual[from] <= 0) {
        _this.showMessage();

        return true;
      }

      return false;
    };

    _this.onDoubleClick = function (department, from) {
      from == 'table' ? _this.onTableDoubleClick(department) : _this.onTreeOrSearchDoubleClick(department, from);
    };

    _this.onTreeOrSearchDoubleClick = function (department, from) {
      var _this$state4 = _this.state,
          selectedData = _this$state4.selectedData,
          tableData = _this$state4.tableData,
          maxCount = _this$state4.maxCount;
      var index = tableData.findIndex(function (item) {
        return item.departmentId == department.departmentId;
      });
      index != -1 && tableData.splice(index, 1);

      if (tableData.length >= maxCount) {
        _this.showMessage();

        return;
      }

      selectedData['table'].forEach(function (node) {
        node.selectedInTable = false;
      }); // department.selected = false;

      department.withSub = false;
      department.selectedInTable = true;
      tableData.unshift(department);
      _this.tbody.scrollTop = 0;

      if (index == -1) {
        if (from == 'tree') {
          _this.residual.search--;
          !department.selected && _this.residual.tree--;
        } else {
          _this.residual.tree--;
          !department.selected && _this.residual.search--;
        }
      }

      _this.refreshShowData('table');
    };

    _this.onTableDoubleClick = function (department) {
      var tableData = _this.state.tableData;
      var index = tableData.findIndex(function (item) {
        return item.departmentId == department.departmentId;
      });
      index != -1 && tableData.splice(index, 1);
      _this.residual.tree++;
      _this.residual.search++;

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
      var _this$state5 = _this.state,
          searchValue = _this$state5.searchValue,
          selectedData = _this$state5.selectedData,
          tableData = _this$state5.tableData,
          maxCount = _this$state5.maxCount;
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
      }

      var _selectedData = selectedData[from]; // 清除选中状态

      var _loop2 = function _loop2(i, l) {
        var node = _selectedData[i];
        var index = tableData.findIndex(function (item) {
          return item.departmentId == node.departmentId;
        });
        var exist = index >= 0;
        exist && tableData.splice(index, 1);

        if (from == 'table') {
          node.selectedInTable = false;
          _this.residual.tree++;
          _this.residual.search++;
        } else {
          node.withSub = false;
          node.selected = false;
          node.selectedInTable = true;

          if (from == 'tree') {
            !exist && _this.residual.search--;
          } else {
            !exist && _this.residual.tree--;
          }

          node.parent && (node.parent.allChildrenSelected = false);

          if (tableData.length + _tableData.length < maxCount) {
            _tableData.push(node);
          } else {
            return "break";
          }
        }
      };

      for (var i = 0, l = _selectedData.length; i < l; i++) {
        var _ret2 = _loop2(i, l);

        if (_ret2 === "break") break;
      }

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
      var expandLevel = _this.state.expandLevel;
      var _parent$level = parent.level,
          level = _parent$level === void 0 ? -1 : _parent$level,
          _parent$departmentNam = parent.departmentName,
          departmentName = _parent$departmentNam === void 0 ? '' : _parent$departmentNam;
      level += 1;

      for (var i = 0, l = tree.length; i < l; i++) {
        var node = tree[i];
        node.level = level; // 默认未选中状态

        node.selected = false;
        node.allChildrenSelected = false;
        node.parent = parent;

        if (level < expandLevel && node.Children && node.Children.length) {
          // 一级节点默认展开
          node.expand = true;
        }

        node.parentDepartmentName = departmentName;

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
      var _this$state6 = _this.state,
          selectedData = _this$state6.selectedData,
          searchData = _this$state6.searchData,
          tableData = _this$state6.tableData,
          maxCount = _this$state6.maxCount; // const { searchValue } = this.props;

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

    var _multi = props.multi,
        _props$tableData = props.tableData,
        _tableData2 = _props$tableData === void 0 ? [] : _props$tableData,
        _props$treeData = props.treeData,
        _treeData2 = _props$treeData === void 0 ? [] : _props$treeData,
        _props$expandLevel = props.expandLevel,
        _expandLevel = _props$expandLevel === void 0 ? 2 : _props$expandLevel,
        _maxCount = props.maxCount,
        showDisableCheck = props.showDisableCheck;

    _this.state = {
      // 是否多选
      multi: _multi,
      // 默认展开层级
      expandLevel: _expandLevel,
      // 首次传入的树形数据
      treeData: _treeData2,
      // 搜索框值
      searchValue: '',
      // 搜索结果
      searchData: [],
      // 已选择的值
      tableData: _tableData2,
      // 搜索loading
      searchLoading: false,
      // 树形组件loading
      treeLoading: false,
      // 是否显示「显示停用」勾选框
      showDisableCheck: typeof showDisableCheck === 'boolean' ? showDisableCheck : true,
      // 「显示停用」勾选状态
      showDisable: false,
      // 默认值99，最大200
      maxCount: typeof _maxCount === 'number' ? _maxCount : 99999,
      // 显示警告提示
      showMessage: false,
      // 已选中的值
      selectedData: {
        tree: [],
        search: [],
        table: []
      }
    }; // 虚拟唯一根节点，实际存在多个根节点，该虚拟节点为实际根节点的父级

    _this.virtualRoot = {}; // 所有树形节点，为一维数组

    _this.mainTreeData = []; // 剩余可选数量

    _this.residualTreeCount = 0;
    _this.residualSearchCount = 0;
    _this.residual = {
      tree: 0,
      search: 0
    };
    _this.tbody = null;
    return _this;
  }

  _createClass(Department, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var _this$state7 = this.state,
          currentTableData = _this$state7.tableData,
          maxCount = _this$state7.maxCount;
      var treeData = nextProps.treeData,
          tableData = nextProps.tableData;

      if (this.mainTreeData.length == 0) {
        this.mainTreeData = this.dealRootData(treeData);
        this.virtualRoot.Children = this.mainTreeData;
        this.refreshShowData('tree');
      }

      if (currentTableData.length == 0) {
        this.residual.tree = this.residual.search = maxCount - tableData.length;
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
      this.tbody = document.querySelector('.department-multi .ant-table-body');
    }
    /**
     * @desc 点击展开时获取子节点
     * @param node[Object] 当前展开的节点
     * @param expand[Boolean] 是否展开
     */

  }, {
    key: "render",
    value: function render() {
      var _this$state8 = this.state,
          multi = _this$state8.multi,
          treeData = _this$state8.treeData,
          searchData = _this$state8.searchData,
          tableData = _this$state8.tableData,
          searchLoading = _this$state8.searchLoading,
          treeLoading = _this$state8.treeLoading,
          showDisableCheck = _this$state8.showDisableCheck,
          showDisable = _this$state8.showDisable,
          selectedData = _this$state8.selectedData,
          searchValue = _this$state8.searchValue,
          maxCount = _this$state8.maxCount,
          showMessage = _this$state8.showMessage;
      var _this$props = this.props,
          leftTitle = _this$props.leftTitle,
          rightTitle = _this$props.rightTitle,
          columns = _this$props.columns;
      return React.createElement("div", {
        className: "department"
      }, multi ? React.createElement(Multi, {
        multi: multi,
        treeData: treeData,
        searchValue: searchValue,
        searchData: searchData,
        tableData: tableData,
        searchLoading: searchLoading,
        treeLoading: treeLoading,
        showDisableCheck: showDisableCheck,
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
        treeLoading: treeLoading,
        showDisableCheck: showDisableCheck,
        showDisable: showDisable,
        selectedData: selectedData,
        onExpand: this.onExpand,
        onSelectSibling: this.onSelectSibling,
        onSearchChange: this.onSearchChange,
        onSelect: this.onSelect,
        onShowDisabledData: this.onShowDisabledData
      }), showMessage && React.createElement(Message, {
        type: "warning",
        message: "\u53EF\u9009\u6570\u91CF\u5DF2\u8FBE\u5230\u4E0A\u9650~",
        duration: 2e3,
        onClose: this.hideMessage,
        invisibleMask: true
      }));
    }
  }]);

  return Department;
}(React.Component);

export { Department as default };