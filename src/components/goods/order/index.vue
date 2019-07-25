<template>
  <div >

           <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
 <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <template>
              {{scope.row.is_send}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template >
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="show"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showbox" ></el-button>
          </template>
        </el-table-column>
      </el-table>

        <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
  title="修改地址"
  :visible.sync="updateDialogVisible"
  width="50%"
  >
  <!-- 表单 以及表单验证 -->
  <el-form :model="updateForm" @close="updateFormClose" :rules="updateFormRules" ref="updateFormRef" label-width="100px" >
   <el-form-item label="省市区/县" prop="name">
        <el-cascader
          v-model="updateForm.updateForm1"
          :options="cityData"
          :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="updateForm2">
      <el-input v-model="updateForm.updateForm2"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="updateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  <!-- 展示地址信息 -->
  <el-dialog
  title="提示"
  :visible.sync="dzdialogVisible"
  width="50%"
  >
<el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dzdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dzdialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
      data() {
        return {
          queryInfo: {
            query: '',
            pagenum: 1,
            pagesize: 8
          },
          // 获取到的订单列表数据
          orderlist: [],
          // 总共多少条
          total: 0,
          // 修改地址对话框额显示与隐藏
          updateDialogVisible: false,
          // 物流信息
          dzdialogVisible: false,
          // 修改地址验证表单
          updateForm: {
              updateForm1: [],
              updateForm2: ''
          },
          updateFormRules: {
            updateForm1: [
              { required: true, message: '请选择', trigger: 'blur' }
            ],
            updateForm2: [
              { required: true, message: '请选择', trigger: 'blur' }
            ]
          },
          // 数据源
          cityData,
          progressInfo: []
        }
      },
      created() {
          this.getOrderList()
      },
      methods: {
       async getOrderList() {
        const { data: { data, meta } } = await this.$http.get('orders', { params: this.queryInfo })
          if (meta.status !== 200) return this.$message.error(meta.msg)
          this.orderlist = data.goods
          this.total = data.total
          console.log(this.orderlist)
        },
        // 控制 每页显示多少条
        handleSizeChange(newSize) {
          this.queryInfo.pagesize = newSize
          this.getOrderList()
        },
        // 控制当前页码
        handleCurrentChange(newPage) {
          this.queryInfo.pagenum = newPage
          this.getOrderList()
        },
        // 显示修改地址对话框
        show() {
          this.updateDialogVisible = true
        },
        updateFormClose() {
          this.updateFormRef.resetFields()
        },
        // 物流信息的展开
       async showbox() {
          this.dzdialogVisible = true
           const { data: res } = await this.$http.get('/kuaidi/804909574412544580')

      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }

      this.progressInfo = res.data
      console.log(this.progressInfo)
        }
      }
}
</script>
<style lang="less" scope >
@import '../../../plugins/timeline/timeline.css';
@import '../../../plugins/timeline-item/timeline-item.css';
.el-cascader{
  width:100%;
}

</style>