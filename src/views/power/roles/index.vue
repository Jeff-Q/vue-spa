<template>
   <div>
     <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
       <el-row>
           <el-col>
               <el-button type="primary">添加角色</el-button>
           </el-col>
       </el-row>
       <!-- 角色列表区域 -->
        <el-table :data="rolselist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template  slot-scope="scope">
              <el-row :class="['bdbottom','vcenter',{ bdtop:index === 0}]"  v-for="(item1, index) in scope.row.children" :key='item1.id'>
                <el-col :span="5">
                  <el-tag closable @close='removeRightById(scope.row,item1.id)' >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19" >
                  <el-row :class="['vcenter',{ bdtop:index2 != 0}]" v-for="(item2, index2) in item1.children" :key='item2.id'>
                <el-col :span="5">
                  <el-tag closable @close='removeRightById(scope.row,item2.id)' >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19" >
                  <el-tag closable @close='removeRightById(scope.row,item3.id)'  v-for="item3 in item2.children" :key="item3.id">{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
                </el-col>
              </el-row>
            </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)"  >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="showSetRightDialogVisible"
  width="50%"
  @close='setRightDialogClosed'
  >
          <!-- 树形控件 -->
    <el-tree :data="rightslist" :props="treeProps" show-checkbox   node-key="id"  default-expand-all :default-checked-keys='defkeys' ref="treeRef" ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showSetRightDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="alltRights">确定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
data() {
          return {
            rolselist: [],
            // 控制显示分配权限对话框
            showSetRightDialogVisible: false,
            // 所有权限的数据
            rightslist: [],
            // 树形控件的属性绑定
            treeProps: {
                  label: 'authName',
                  children: 'children'
            },
            // 默认选中的节点id
            defkeys: [],
            // 当前即将分配角色的ID
            roleID: ''
          }
        },
        created() {
          this.getrolse()
        },
        methods: {
        async getrolse() {
         const { data: { data, meta } } = await this.$http.get('roles')
                if (meta.status !== 200) return this.$message.error('获取失败')
                this.rolselist = data
                console.log(this.rolselist)
          },
          // 根据ID删除对应的权限
         async removeRightById(role, rightId) {
            // 弹窗提示用户是否要删除
          const confirmResult = await this.$confirm('此操作将永久删除该文件，是否继续？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
                const { data: { data, meta } } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                  if (meta.status !== 200) return this.$message.error('删除失败')
                     role.children = data
          },
          // 展示分配权限的对话框
         async showSetRightDialog(role, arr) {
                this.roleID = role.id
             const { data: { data, meta } } = await this.$http.get('rights/tree')
             if (meta.status !== 200) return this.$message.error(meta.msg)
                    // console.log(data);
                    this.rightslist = data
                      this.getLeafkeys(role, this.defkeys)
                      this.showSetRightDialogVisible = true
          },
          // 通过递归的方式 获取角色下所有三级权限的id 并且保存到defkeys 数组中
          getLeafkeys(node, arr) {
                  // 如果当前node 节点不包含 children 属性 则是三级 节点
                  if (!node.children) return arr.push(node.id)
               node.children.forEach(item => this.getLeafkeys(item, arr))
          },
          // 监听对权限对话框的关闭事件
          setRightDialogClosed() {
            this.defkeys = []
          },
          // 点击为角色分配权限
         async alltRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // console.log(keys);

            const idStr = keys.join(',')
            // console.log(idStr);
         const { data: { meta } } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: idStr })
                    if (meta.status !== 200) return this.$message.error('分配权限失败')
                    this.$message.success('分配权限成功')
                    // 刷新页面
                    this.getrolse()
                    this.showSetRightDialogVisible = false
          }
        }
}

</script>
<style>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>