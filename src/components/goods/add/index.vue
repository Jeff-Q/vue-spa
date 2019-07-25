<template>
  <div>
           <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
 <el-card>
        <el-alert title="添加商品信息" type="info" center show-icon :closable=false ></el-alert>
     <el-steps :active="activeIndex - 0" align-center finish-status="success" :space="200" >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
     </el-steps>
      <!-- tab栏区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addruleFormRef" label-width="100px" label-position='top' >
    <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave='beforeTebLive' @tab-click='tabClick'>
        <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
                 <el-input v-model="addForm.goods_name"></el-input>
             </el-form-item>
             <el-form-item label="商品价格" prop="goods_price">
                 <el-input v-model="addForm.goods_price"></el-input>
             </el-form-item>
             <el-form-item label="商品重量" prop="goods_weight">
                 <el-input v-model="addForm.goods_weight"></el-input>
             </el-form-item>
             <el-form-item label="商品数量" prop="goods_number">
                 <el-input v-model="addForm.goods_number"></el-input>
             </el-form-item>
             <el-form-item label="商品分类"  prop="goods_cat">
                 <el-cascader expand-trigger="hover"
                 :options="catelist" :props="cateprops"
                 v-model="addForm.goods_cat" @change="handleChange"
                  ></el-cascader>
             </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                <!-- 复选框组 -->
            <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb"  v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
            </el-form-item>

        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyTableData"  :key="i">
                <el-input v-model="item.attr_vals" ></el-input>
            </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <el-upload :action="uploadURL" :on-success="handleSuccess" :headers="headerObj" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
            <!-- 富文本bianji组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>

            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add" >添加按钮</el-button>
        </el-tab-pane>
    </el-tabs>
    </el-form>
 </el-card>
 <!-- 图片预览 -->
 <el-dialog
  title="图片预览"
  :visible.sync="picDialogVisible"
  width="50%">
    <img :src="previewPath" alt="">
</el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
    data() {
        return {
            activeIndex: '0',
            // 添加商品的表单数据对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属的分类数组
                goods_cat: [],
                // 图片的数组
                pics: [],
                goods_introduce: '',
            attrs: []

            },
            addFormRules: {
                goods_name: [
                    {
                        required: true, message: '请输入商品名称', trigger: 'blur'
                    }
                ],
                goods_price: [
                    {
                        required: true, message: '请输入商品价格', trigger: 'blur'
                    }
                ],
                goods_weight: [
                    {
                        required: true, message: '请输入商品重量', trigger: 'blur'
                    }
                ],
                goods_number: [
                    {
                        required: true, message: '请输入商品数量', trigger: 'blur'
                    }
                ],
                goods_cat: [
                    {
                        required: true, message: '请选择商品分类', trigger: 'blur'
                    }
                ]
            },
            // 获取的商品分类数据
            catelist: [],
            // 级联的配置对象
            cateprops: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            // 动态参数列表数据
            manyTableData: [],
            // 静态参数列表数据
            onlyTableData: [],
            // 上传文件的路径
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传组件headers请求头对象
            headerObj: {
                Authorization:
                window.sessionStorage.getItem('token')
            },
            // 获取的图片完整url
            previewPath: '',
            // 控制图片预览的显示与隐藏
            picDialogVisible: false,
            // 商品的详情描述
            goods_introduce: ''

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有商品分类数据
       async getCateList() {
              const { data: { data, meta } } = await this.$http.get('categories')
              if (meta.status !== 200) this.$message.error('获取数据失败')
              this.catelist = data
      },
         handleChange() {
             if (this.addForm.goods_cat.length !== 3) {
                     this.addForm.goods_cat = []
             }
         },
         beforeTebLive(activeName, oldActiveName) {
             if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                 this.$message.error('请先选择商品分类')
                 return false
             }
         },
        async tabClick() {
             if (this.activeIndex === '1') {
                  const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
                        if (meta.status !== 200) return this.$message.error('获取动态参数列表失败')
                                console.log(data);
              data.forEach(async item => {
                 item.attr_vals = item.attr_vals.length === 0 ? [ ] : item.attr_vals.split(',')
                 console.log(item.attr_vals)
             })
                 this.manyTableData = data
                                // console.log(data);
           } else if (this.activeIndex === '2') {
            const { data: { data, meta } } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
            if (meta.status !== 200) this.$message.error('获取静态参数失败')
                // console.log(data);
                 this.onlyTableData = data
           }
         },
        //  处理图片预览效果
        handlePreview(file) {
            this.previewPath = file.response.data.url
            this.picDialogVisible = true
        },
        // 处理移除图片的操作
        handleRemove(file) {
            // 获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            // 从pics 数组中 找到这个图片对应的索引
           const i = this.addForm.pics.findIndex(x => x.pic === filePath)
            this.addForm.pics.splice(i, 1)
        },
        // 监听图片上传成功事件
        handleSuccess(response) {
                // 1 拼接得到一个图片信息对象
                // 2 将图片信息对象 push 到 pics
                const picsInfo = { pics: response.data.tmp_path }
                    this.addForm.pics.push(picsInfo)
        },
        // 添加商品
        add() {
            this.$refs.addruleFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写必要的表单项！')
                // 执行添加的业务逻辑
                // lodash clonDeep(obj)
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                    // 处理动态参数
                    this.manyTableData.forEach(item => {
                      const newInfo = { attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ') }
                        this.addForm.attrs.push(newInfo)
                    })
                    // 处理静态属性
                    this.onlyTableData.forEach(item => {
                        const newInfo = { attr_id: item.attr_id,
                        attr_value: item.attr_vals }
                        this.addForm.attrs.push(newInfo)
                    })
                    form.attrs = this.addForm.attrs
                   const { data: { meta } } = await this.$http.post('goods', form)
                   if (meta.status !== 201) return this.$message.error(meta.msg)
                   this.$message.success('添加商品成功')
                   this.$router.push('/goods')
            })
        }
    },
    // 获取级联选择器 第三级的ID
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
 }
</script>
<style lang="less" scope >

.el-dialog img{
    width: 100%;
    height: 100%;
}

.btnAdd {
    margin-top:15px;
}
</style>