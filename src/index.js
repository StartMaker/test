import React from 'react';

import Search from './common/search';
import Single from './single';
import Multi from './multi';
import './style/index.scss';


export default class Department extends React.Component {
  constructor(props) {
    super();
    this.state = {
      multi: !!props.multi,
      expandLevel: props.expandLevel || 2,
      treeData: [],
      searchValue: '',
      searchData: [],
      tableData: [],
      searchLoading: false,
      searchLoading: false,
      showDisable: false,
      maxCount: props.maxCount || 200,
      // showSearchList: false,
      selectedData: {
        tree: [],
        search: [],
        table: []
      }
    };
    this.virtualRoot = {};
    this.mouId = props.pageData && props.pageData.PObjectDataID;
    this.mainTreeData = [];
    this.mainSearchData = [];
    this.mainTableData = [];
    this.tbody = null;
  }

  componentWillReceiveProps(nextProps) {
    const { tableData: currentTableData } = this.state;
    const { treeData, tableData } = nextProps;
    if (this.mainTreeData.length == 0) {
      this.mainTreeData = this.dealRootData(treeData);
      this.virtualRoot.Children = this.mainTreeData;
      this.refreshShowData('tree');
    }
    if (currentTableData.length == 0) {
      this.setState({
        tableData
      }, () => this.refreshShowData('table'));
    }
  }

  componentDidMount() {
    // this.getRootData();
    this.tbody = document.querySelector('.department-multi .ant-table-tbody');
  }

  /**
   * @desc 点击展开时获取子节点
   * @param node[Object] 当前展开的节点
   * @param expand[Boolean] 是否展开
   */
  onExpand = (department, expand) => {
    department.expand = expand;
    if (expand && (!department.Children || !department.Children.length)) {
      //异步获取数据
      const { departmentId, departmentName, departmentStatus, withSubEnable } = department;
      const { onExpand } = this.props;
      department.loading = true;
      this.refreshShowData('tree');
      onExpand({
        departmentId,
        departmentName,
        departmentStatus,
        withSubEnable
      }).then(subDepartment => {
        this.setTreeDataParam(subDepartment, department);
        department.Children = subDepartment;
        department.allChildrenSelected = false;
        department.loading = false;
        this.refreshShowData('tree');
      }).catch(() => {});
    } else {
      this.refreshShowData('tree');
    }
  }

  /**
   * @desc 用户点击选中操作
   * @param department 当前点击的部门
   * @param selected 是否选中
   * @param from 来源tree/search/table
   */
  onSelect = (department, selected, from) => {
    const { multi, selectedData, showDisable } = this.state;
    if (!multi) {
      const { departmentId, departmentName, withSub } = department;
      this.props.onSubmit({
        departmentId,
        departmentName,
        withSub
      });
    } else {
      const targetSelectedData = selectedData[from];
      if (from == 'table') {
        department.selectedInTable = selected;
      } else {
        department.selected = selected;
        if (from == 'tree') {
          if (selected) {
            this.checkAllChildrenSelected(department.parent, showDisable);
          } else {
            department.parent.allChildrenSelected = false;
          }
        }
      }
      if (selected) {
        targetSelectedData.push(department);
      } else {
        const index = targetSelectedData.indexOf(department);
        index >= 0 && targetSelectedData.splice(index, 1);
      }
      this.setState({
        selectedData
      });
      this.refreshShowData(from);
    }
  }

  /**
   * @desc 树形组件，选中同级和取消选中同级
   * @param parent 父级部门
   */
  onSelectSibling = parent => {
    const { showDisable } = this.state;
    const { allChildrenSelected, Children } = parent;
    parent.allChildrenSelected = !allChildrenSelected;
    Children.forEach(child => {
      if (showDisable || child.departmentStatus) {
        child.selected = !allChildrenSelected;
      }
    });
    this.refreshShowData('tree');
  }

  /**
   * @desc 检查目标部门的所有子部门是否都被选中
   * @param department 目标部门
   * @param showDisable 是否显示停用
   */
  checkAllChildrenSelected = (department, showDisable) => {
    const { Children = [] } = department;
    const hasUnSelected = Children.some(child => {
      if (!showDisable) {
        return child.departmentStatus && !child.selected;
      } else {
        return !child.selected;
      }
    });
    department.allChildrenSelected = Children.length > 0 ? !hasUnSelected : false;
    this.refreshShowData('tree');
  }

  /**
   * @desc 双击部门时直接移动
   * @param department 双击的部门
   * @param from 双击的区域 tree/search/table
   */
  onDoubleClick = (department, from) => {
    const { selectedData, tableData } = this.state;
    const index = tableData.findIndex(item => item.departmentId == department.departmentId);
    index != -1 && tableData.splice(index, 1);
    if (from != 'table') {
      selectedData['table'].forEach(node => {
        node.selectedInTable = false;
      });
      // department.selected = false;
      department.withSub = false;
      department.selectedInTable = true;
      tableData.unshift(department);
      this.tbody.scrollTop = 0;
    }
    this.refreshShowData('table');
  }

  /**
   * @desc 更改「仅显示生效组织」checkbox状态
   * @param checked 勾选状态
   */
  onShowDisabledData = checked => {
    this.traverseTreeData([this.virtualRoot], department => {
      if (checked && !department.departmentStatus) {
        department.selected = false;
      }
      this.checkAllChildrenSelected(department, checked);
    });
    this.setState({
      showDisable: checked
    }, this.refreshShowData.bind(this, 'tree'));
  }

  /**
   * @desc 搜索框值变化时的回调
   * @var value 变化后的值
   */
  onSearchChange = value => {
    const { onSearchChange } = this.props;
    this.setState({
      searchValue: value,
      searchLoading: true
    });
    onSearchChange(value).then(searchData => {
      this.setState({
        searchData,
        searchLoading: false
      });
    }).catch(() => {

    });
  }

  /**
   * @desc 数据左右移动事件，即添加到「已选组织」和从「已选组织」中移除
   * @param type 数据操作类型 add/remove
   */
  onMove = type => {
    const { /*showSearchList, */searchValue, selectedData, tableData, maxCount } = this.state;
    let from = '';

    const _tableData = [];
    if (type == 'remove') {
      from = 'table';
    } else {
      if (searchValue) {
        from = 'search';
      } else {
        from = 'tree';
      }
      selectedData['table'].forEach(node => {
        node.selectedInTable = false;
      });
    }
    const _selectedData = selectedData[from];
    // 清除选中状态
    for (let i = 0, l = _selectedData.length; i < l; i++) {
      const node = _selectedData[i];
      const index = tableData.findIndex(item => item.departmentId == node.departmentId);
      index != -1 && tableData.splice(index, 1);
      if (from == 'table') {
        node.selectedInTable = false;
      } else {
        node.withSub = false;
        node.selected = false;
        node.selectedInTable = true;
        node.parent && (node.parent.allChildrenSelected = false);
        if (tableData.length + _tableData.length < maxCount) {
          _tableData.push(node);
        } else {
          break;
        }
      }
    }
    
    // this.setState({
    //   tableData: tableData.unshift(..._tableData)
    // });
    tableData.unshift(..._tableData);
    if (from != 'table') {
      this.refreshShowData('table');
      this.tbody.scrollTop = 0;
    }
    this.refreshShowData(from);
  }

  /**
   * @desc 勾选「包含全部下级组织」
   * @param department 目标部门
   * @param checked 是否勾选
   */
  onCheck = (department, checked) => {
    department.withSub = checked;
    this.refreshShowData('table');
  }

  /**
   * @desc 处理初始数据，将两层扁平数据结构化
   * @param data[Array] 需要初始化的数据
   * @var tree[Array] 处理后的树形结构
   */
  dealRootData = (data = []) => {
    const map = {},
      tree = [],
      length = data.length;
    data.forEach(node => {
      if (node.hasChildrenEnable || node.hasChildrenDisabled) {
        node.Children = [];
      }
      map[node.departmentId] = node;
    });
    for (let i = 0; i < length; i++) {
      const node = data[i];
      const parent = map[node.parentDepartmentId];
      if (parent) {
        node.parent = parent;
        if (parent.Children) {
          parent.Children.push(node);
        } else {
          parent.Children = [node];
          console.info(`${node.departmentId}的父级为${parent.departmentId}，父级的HasChildrenEnable和HasChildrenDisabled均为false`)
        }
      } else {
        tree.push(node);
      }
    }
    this.setTreeDataParam(tree, this.virtualRoot);
    return tree;
  };

  /**
   * @desc 深度遍历，设置每个节点的属性
   * @param tree[Array] 需要遍历的树形数组
   * @level 需要设置的level值
   */
  setTreeDataParam = (tree = [], parent) => {
    const { expandLevel } = this.state;
    let { level = -1, departmentName = '' } = parent;
    level += 1;
    for (let i = 0, l = tree.length; i < l; i++) {
      const node = tree[i];
      node.level = level;
      // 默认未选中状态
      node.selected = false;
      node.allChildrenSelected = false;
      node.parent = parent;
      if (level < expandLevel && node.Children.length) {
        // 一级节点默认展开
        node.expand = true;
      }
      node.parentDepartmentName = departmentName;
      if (node.hasChildrenEnable || node.hasChildrenDisabled) {
        node.Children = node.Children || [];
      }
      if (node.Children && node.Children.length) {
        this.setTreeDataParam(node.Children, node);
      }
    }
  }

  /**
   * @desc 根据DepartmentId，查询对应的部门
   * @param id 目标部门的DepartmentId
   * @param departments 被查询的部门列表
   */
  findDepartmentById = (id, departments = this.mainTreeData) => {
    for (let i = 0; i < departments.length; i++) {
      const dep = departments[i];
      if (dep.departmentId == id) {
        return dep;
      } else if (dep.Children && dep.Children.length) {
        const targetDep = this.findDepartmentById(id, dep.Children);
        if (targetDep) return targetDep;
      }
    }
    return false;
  }

  /**
   * @desc 递归处理tree节点
   * @param data 要处理的数据数组
   * @param fn 处理函数
   */
  traverseTreeData = (data, fn) => {
    for (let i = 0; i < data.length; i++) {
      const department = data[i];
      fn(department);
      department.Children && department.Children.length && this.traverseTreeData(department.Children, fn);
    }
  }
  /**
   * @desc 递归选出所有要显示的数据，以扁平数组的格式传给tree
   * @param data 目标数组
   */
  getTreeData = (data = this.mainTreeData) => {
    const treeData = [];
    const selectedTree = [];
    const { showDisable } = this.state;
    for (let i = 0; i < data.length; i++) {
      const department = data[i];
      department.selected && selectedTree.push(department);
      if (showDisable || department.departmentStatus) {
        treeData.push(department);
        if (department.expand && department.Children && department.Children.length) {
          const [_treeData, _selectedTree] = this.getTreeData(department.Children);
          treeData.push(..._treeData);
          selectedTree.push(..._selectedTree);
        }
      }
    }
    return [treeData, selectedTree];
  }

  /**
   * @desc 重新赋值，强制刷新
   * @param from 需要刷新的目标 tree/search/table
   */
  refreshShowData = from => {
    const { selectedData, searchData, tableData } = this.state;
    // const { searchValue } = this.props;
    if (from == 'tree') {
      const [ treeData, _selectedTree ] = this.getTreeData();
      selectedData[from] = _selectedTree;
      this.setState({
        treeData,
        selectedData
      });
    } else if (from == 'search') {
      const _selectedSearch = searchData.filter(node => !!node.selected);
      selectedData[from] = _selectedSearch;
      this.setState({
        searchData,
        selectedData,
        // showSearchList: !!searchValue
      });
    } else {
      const _selectedTable = tableData.filter(node => !!node.selectedInTable);
      selectedData[from] = _selectedTable;
      this.setState({
        tableData,
        selectedData
      });
    }
  }

  onCancel = e => {
    const { onCancel } = this.props;
    onCancel && onCancel(e);
  }

  onSubmit = e => {
    const { tableData } = this.state;
    const { onSubmit } = this.props;
    const data = tableData.map(department => {
      const { departmentId, departmentName, withSub } = department;
      return {
        departmentId, departmentName, withSub
      }
    })
    onSubmit && onSubmit(data);
  }

  render() {
    const { 
      multi,
      treeData,
      searchData,
      tableData,
      searchLoading,
      showDisable,
      selectedData,
      searchValue,
      maxCount
    } = this.state;
    const { leftTitle, rightTitle, columns } = this.props;
    return (
        multi ?
        <Multi
          multi={multi}
          treeData={treeData}
          searchValue={searchValue}
          searchData={searchData}
          tableData={tableData}
          searchLoading={searchLoading}
          showDisable={showDisable}
          selectedData={selectedData}
          leftTitle={leftTitle}
          rightTitle={rightTitle}
          maxCount={maxCount}
          columns={columns}
          onExpand={this.onExpand}
          onSelectSibling={this.onSelectSibling}
          onDoubleClick={this.onDoubleClick}
          onSearchChange={this.onSearchChange}
          onSelect={this.onSelect}
          onMove={this.onMove}
          onCheck={this.onCheck}
          onShowDisabledData={this.onShowDisabledData}
          onCancel={this.onCancel}
          onSubmit={this.onSubmit}
        />
        :
        <Single
          multi={multi}
          treeData={treeData}
          searchValue={searchValue}
          searchData={searchData}
          searchLoading={searchLoading}
          showDisable={showDisable}
          selectedData={selectedData}
          onExpand={this.onExpand}
          onSelectSibling={this.onSelectSibling}
          onSearchChange={this.onSearchChange}
          onSelect={this.onSelect}
          onShowDisabledData={this.onShowDisabledData}
        />
    )
  }
}