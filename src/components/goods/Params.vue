<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="selectedCateKeys" @change="handleChange"  >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
  <el-tabs v-model="activeName" @tab-click="handleTanClick" >
    <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button  type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible= true"  >添加动态参数</el-button>

      <!-- 动态参数表格 -->
       <el-table
      :data="manyTableDate"
      style="width: 100%" border stripe>
      <!-- 展开行 -->
      <el-table-column
      type="expand">
      <template slot-scope="scope">
            <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="attrValsClose(scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
      </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
        prop="attr_name"
        label="参数名称"
       >
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 操作按钮 -->
        <template slot-scope="scope" >
            <el-button type="primary" size="mini" icon="el-icon-edit" @click='showEditDialog(scope.row.attr_id)' >编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-tab-pane>
    <!-- 添加静态属性的面板 -->
    <el-tab-pane label="静态参数" name="only">
       <el-button type="primary"  size="mini" :disabled="isBtnDisabled" @click="addDialogVisible= true" >添加静态参数
       </el-button>
        <!-- 静态数据列表 -->
          <el-table
      :data="onlyTableDate"
      style="width: 100%" border stripe>
      <!-- 展开行 -->
       <!-- 展开行 -->
      <el-table-column
      type="expand">
      <template slot-scope="scope">
            <!-- 循环渲染Tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable @close="attrValsClose(i,scope.row)">{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
      </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column
      type="index">
      </el-table-column>
      <el-table-column
        prop="attr_name"
        label="参数名称"
       >
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 操作按钮 -->
        <template slot-scope="scope" >
            <el-button type="primary" size="mini" icon="el-icon-edit" @click='showEditDialog(scope.row.attr_id)'>编辑</el-button>
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-tab-pane>
  </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
  :title="'添加' + titleText"
  :visible.sync="addDialogVisible"
  width="50%"
  @close="addDialogClosed"
  >
  <!-- 验证规则表单 -->
   <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
      <el-form-item :label='titleText' prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
  <!-- 修改参数对话框 -->
    <el-dialog
  :title="'修改' + titleText"
  :visible.sync="editDialogVisible"
  width="50%"
  @close="editDialogClosed"
  >
  <!-- 验证规则表单 -->
   <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
      <el-form-item :label='titleText' prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
        catelist: [],
        // 级联选择框的配置对象
        cateProps: {
          value: 'cat_id',
          label: "cat_name",
          children: 'children'
        },
        // 级联选择框双向绑定到的数组
        selectedCateKeys: [],
        // 被激活的页签的名称
        activeName: 'many',
      // 动态表格参数
      manyTableDate: [],
      // 静态表格参数
      onlyTableDate: [],
      // 控制添加对话框的显示隐藏
      addDialogVisible: false,
      // 控制修改对话框的显示 与隐藏
      editDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
            attr_name: ''
      },
      // 修改的表单数据对象
      editForm: {},
      // 添加表单的验证规则对象
      addFormRules: {
         attr_name: [
           {
             required: true, message: '请输入参数名称', trigger: 'blur'
           }
         ]
      },
      // 修改的表单的验证规则对象
      editFormRules: {
        attr_name: [
           {
             required: true, message: '请输入参数名称', trigger: 'blur'
           }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 监听添加对话框的关闭事件
    addDialogClosed() {
     this.$refs.addFormRef.resetFields()
    },
    // 监听修改对话框的关闭事件 重置
    editDialogClosed() {
this.$refs.editFormRef.resetFields()
    },
     async getCateList() {
       const { data: { data, meta } } = await this.$http.get('categories')
              if (meta.status !== 200) return this.$message.error('获取失败')
              this.catelist = data
              console.log(this.catelist)
     },
    //  级联选择框选中项变化，会触发这个函数
        handleChange() {
        // 获取分类的表格参数
        this.getParamsData()
     },
    //  tab页签点击事件的处理函数
    handleTanClick() {
        // 获取分类的表格参数
        this.getParamsData()
      console.log(this.activeName);
    },
   async getParamsData() {
     //  证明选中的不是三级分类
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = []
          this.manyTableDate = []
          this.onlyTableDate = []
          return
        }
 const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
 if (meta.status !== 200) return this.$message.error('获取失败')
          // 遍历把字符串分割成数组
           data.forEach(item => {
         item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
              // 控制文本框显示与隐藏
              item.inputVisible = false
              // 文本框中输入的值
              item.inputValue = ''
             })
              if (this.activeName === 'many') {
                this.manyTableDate = data
              } else {
                this.onlyTableDate = data
              }
    },
    // 点击按钮 添加参数
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: { meta } } = await this.$http.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name, attr_sel: this.activeName
            })
            if (meta.status !== 201) return this.$message.error('添加失败')
            this.$message.success('添加成功')
            this.addDialogVisible = false
            this.getParamsData()
         })
    },
    // 点击按钮 暂时修改的对话框
   async showEditDialog(id) {
    const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
    if (meta.status !== 200) return this.$message.error('获取参数信息失败')
    this.editForm = data
      this.editDialogVisible = true
    },
    // 点击按钮修改参数
    editParams() {
          this.$refs.editFormRef.validate(async valid => {
              if (!valid) return
           const { data: { meta } } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
           if (meta.status !== 200) return this.$message.error('修改失败')
           this.$message.success('修改成功')
            this.getParamsData()
           this.editDialogVisible = false
          })
    },
    // 根据ID 删除
  async removeParams(id) {
     const confirmResult = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')

       const { data: { meta } } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            if (meta.status !== 200) return this.$message.error('删除参数失败')
            this.$message.success('删除成功')
            this.getParamsData()
    },
    // 文本失去焦点 或者按下了enter 都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrVals(row)
      }
    },
     async saveAttrVals(row) {
       const { data: { meta } } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join('')
        })
      if (meta.status !== 200) return this.$message.error('修改参数项目失败')
      this.$message.success('修改项目成功！')
    },
    // 点击按钮展示文本输入框
    showInput(row) {
        row.inputVisible = true
        // 让文本框自动获取焦点
        // 方法的作用 就是当页面上元素被重新渲染之后 才会定制回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
    },
    attrValsClose(i, row) {
          row.attr_vals.splice(i, 1)
          this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮需要被禁用返回true 否则 反回 false
    isBtnDisabled() {
    if (this.selectedCateKeys.length !== 3) {
      return true
    }
       return false
    },
    // 当前选中的三级分类的ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
         return this.selectedCateKeys[2]
      }
      return null
    },
    // 动态计算标题的文本
    titleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
