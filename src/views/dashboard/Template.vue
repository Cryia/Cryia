<template>
  <div class="app-container">
    <div class="box-list-container">
      <div class="item-box" style="cursor: pointer" @click="handleCreate">
        <div class="item-box-top">
          <div class="item-box-top-img">
            <i class="el-icon-plus plus-icon"/>
          </div>
        </div>
        <div class="item-box-bottom">
          <h4>新建模板</h4>
          <p>添加一个新的模板</p>
        </div>
      </div>
      <div class="item-box" v-for="item in tplList" :key="item.hash">
        <div class="item-box-top">
          <div class="item-box-top-img">
            <img :src="item.imgUrl | fullImgUrl">
          </div>
          <div class="item-box-top-icon">
            <i class="el-icon-edit" @click="handleEdit(item.hash)"></i>
            <i class="el-icon-delete" @click="handleDelete(item.hash)"></i>
          </div>
        </div>
        <div class="item-box-bottom">
          <h4 class="template-item-title">{{item.config.title}}</h4>
          <p>{{ item.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }} <span class="link-type" >{{ item.config.width + 'X' + item.config.height }}</span></p>
        </div>
      </div>
    </div>

    <!--新建大屏-->
    <el-dialog :title="'新建模板'" :visible.sync="dialogFormVisible">
      <el-form ref="TplForm" :model="temp" :rules="createTplRules" label-position="top" label-width="70px" style="width: 500px; margin-left:50px;">

        <el-form-item :label="'模板名称'" prop="title">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="'模板级别'">
          <el-select v-model="temp.level" class="filter-item" placeholder="请选择一个级别">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.text" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="dialogStatus===createSubmit()">{{ '创建' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchTemplateList, createTemplate, deleteTemplate } from '@/api/template'
import waves from '@/directive/waves' // Waves directive
// import { parseTime } from '@/scripts'

const levelOptions = [
  { value: 0, text: '隐藏' },
  { value: 1, text: '公开' },
  { value: 2, text: '普通' },
  { value: 3, text: '中级' },
  { value: 4, text: '高级' }
]

const levelTypeKeyValue = levelOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.text
  return acc
}, {})

export default {
  name: 'TemplateManage',
  directives: { waves },
  filters: {
    levelFilter (v) {
      return levelTypeKeyValue[v]
    },
    fullImgUrl (url) {
      return process.env.BASE_API + url
    }
  },
  data () {
    const validateTplName = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('模板名称不能为空'))
      } else {
        callback()
      }
    }

    return {
      tableKey: 0,
      tplList: null,
      total: 0,
      tplListLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      levelOptions,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      createTplRules: {
        name: [{ required: true, trigger: 'blur', validator: validateTplName }]
      }
    }
  },
  created () {
    this.getTemplates()
  },
  methods: {
    getTemplates () {
      this.tplListLoading = true
      fetchTemplateList().then(response => {
        this.tplList = response.data.items
        this.total = response.data.total || 0
        this.tplListLoading = false

        setTimeout(() => {
          this.tplListLoading = false
        }, 1 * 1000)
      }).catch(() => {
        setTimeout(() => {
          this.tplListLoading = false
        }, 1 * 1000)
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getTemplates()
    },
    resetTemp () {
      this.temp = {
        name: '',
        isTemplate: true,
        about: '大屏模板'
      }
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = '新建模板'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['TplForm'].clearValidate()
      })
    },
    createSubmit () {
      this.$refs['TplForm'].validate((valid) => {
        if (valid) {
          createTemplate(this.temp).then(response => {
            // 跳转到编辑页面
            this.handleEdit(response.hash)
          })
        }
      })
    },
    handleDelete: function (hash) {
      deleteTemplate(hash).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        // <!-- const index = this.list.indexOf(row) -->
        // <!-- this.list.splice(index, 1) -->
        this.getTemplates()
      })
    },
    handleEdit (hash) {
      this.$router.push({
        path: '/edit/dashboard/' + hash,
        query: {
          redirect: 'template'
        }
      })
    }
  }
}
</script>

<style scoped>
  @import '../../styles/view-box.css';
</style>
