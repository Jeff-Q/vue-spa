<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getusers"
          >
            <el-button @click="getusers" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 使用作用域插槽的方式传递数据给父组件 然后可以通过父组件控制子组件的状态 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(row.mg_state)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="173px">
          <!--为什么这里使用作用于插槽 子组件只做布局上的渲染 所有的数据操作都由父组件控制 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"

            ></el-button>
            <el-button
              type="dender"
              icon="el-icon-delete"
              size="mini"
              @click="removeEditDialog(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" placement="top" enterable="false" content="分配角色">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showEditDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 7]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="提示" :visible.sync="addialog" width="50%" @close="addDialogClosed">
      <!-- 表单验证 -->
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addialog=false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户信息 -->
    <el-dialog title="提示" :visible.sync="editialog" width="50%" @close="editDialogClosed" >
      <!-- 表单验证 -->
      <el-form
      :model="editForm"
        :rules="editrules"
        ref="editruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editialog=false">取 消</el-button>
        <el-button type="primary" @click="editusers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addialog: false,
      // 修改信息
      editialog: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 添加表单的验证规则对象
      addrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getusers();
  },
  methods: {
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addruleFormRef.resetFields();
    },
    async getusers() {
      const {
        data: { data, meta }
      } = await this.$http.get("users", { params: this.queryInfo });
      if (meta.status !== 200) return this.$message.error("获取失败");
      this.$message.success("获取成功");
      this.userlist = data.users;
      this.total = data.total;
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize;
      this.getusers();
    },
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getusers();
    },
    async userStateChanged(userinfo) {
      const {
        data: { meta }
      } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error(meta.msg);
      }
      this.$message.success(meta.msg);
    },
    // 提交添加表单信息预效验
    addUser() {
      this.$refs.addruleFormRef.validate(async valid => {
        if (!valid) return;
        // 效验成功 发送添加请求
        const {
          data: { meta }
        } = await this.$http.post("users", this.addForm);
        if (meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加成功");
        // 隐藏卡片框
        this.addialog = false;
      })
    },
    // 显示编辑对话框
   async showEditDialog(id) {
      this.editialog = true
       const { data: { data, meta } } = await this.$http.get('users/' + id)
       if (meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = data
    },
    // 重置编辑用户表单
    editDialogClosed() {
        this.$refs.editruleFormRef.resetFields()
    },
    // 提交编辑好的用户信息表单
    editusers() {
       this.$refs.editruleFormRef.validate(async valid => {
        if (!valid) return;
        // 效验成功 发送添加请求
        const {
          data: { meta }
        } = await this.$http.put("users/" + this.editForm.id, this.editForm);
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg);
        // 隐藏卡片框
        this.editialog = false;
        this.getusers();
      })
    },
    // 通过id删除
   async removeEditDialog(id) {
     // 弹框询问用户是否删除数据
    const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }

      ).catch(err => err)
       // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
            if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
          const {
          data: { meta }
        } = await this.$http.delete("users/" + id);
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.$message.success(meta.msg);
        // 隐藏卡片框
        this.editialog = false;
        this.getusers();
    }
  }
};
</script>
<style  lang="less" scoped >
</style>