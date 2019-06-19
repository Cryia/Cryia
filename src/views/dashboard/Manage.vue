<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'大屏名称'" v-model="listQuery.title" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-select v-model="listQuery.status" :placeholder="'发布状态'" clearable class="filter-item" style="width: 130px">
        <el-option v-for="(key, value) in publishTypeOptions" :key="key" :label="key" :value="value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ '搜索' }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ '新建' }}</el-button>

      <div class='view-type'>
        <svg-icon :class="{active: viewType === 'box'}" icon-class="grid" @click="viewType = 'box'"/>
        <svg-icon :class="{active: viewType === 'list'}" icon-class="list" @click="viewType = 'list'"/>
      </div>
    </div>

    <div class="box-list-container" v-loading="listLoading" v-show="viewType == 'box'">
      <div class="item-box" v-for="item in list" :key="item.hash">
        <div class="item-box-top">
          <div class="item-box-top-img">
            <el-image style="height:100%" :src="item.imgUrl | fullImgUrl">
              <div slot="placeholder" class="image-slot">
                <span class="dot">加载中...</span>
              </div>
            </el-image>
          </div>
          <div class="item-box-top-icon" v-show="true">
            <p>
              <el-button size="mini" type="primary" @click="handleDesign(item.hash)">{{ '编辑' }}</el-button>
              <el-dropdown trigger="click" placement="bottom" @command="handlePublish">
                <el-button size="mini" type="primary">{{ '发布' }}</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-tooltip effect="dark" :content="'删除已发布链接'" placement="left">
                    <el-dropdown-item
                      icon="el-icon-remove-outline"
                      v-show="item.publish.status === 'published'"
                      :command="{hash:item.hash, cmd:'unpublish'}">
                      {{ '停止发布' }}
                    </el-dropdown-item>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="'生成一个新的链接'" placement="left">
                    <el-dropdown-item
                      icon="el-icon-circle-plus-outline"
                      v-show="item.publish.status === 'unpublish'"
                      :command="{hash:item.hash, cmd:'published'}">
                      {{' 公开发布 '}}
                    </el-dropdown-item>
                  </el-tooltip>

                  <el-tooltip effect="dark" :content="'更新已发布链接的内容'" placement="left">
                    <el-dropdown-item
                      icon="el-icon-refresh"
                      v-show="item.publish.status === 'published' && item.config.timestamp > item.publish.timestamp"
                      :command="{hash:item.hash, cmd:'republish'}">
                      {{' 重新发布 '}}
                    </el-dropdown-item>
                  </el-tooltip>
                </el-dropdown-menu>
              </el-dropdown>
            </p>

            <el-tooltip :content="'预览'" placement="bottom">
              <i class="el-icon-view" @click="handlePreview(item.hash)"></i>
            </el-tooltip>

            <el-tooltip :content="'下载'" placement="bottom">
              <i class="el-icon-download" @click="handleDownload(item.publish.hash)"></i>
            </el-tooltip>

            <el-tooltip :content="'移动'" placement="bottom">
              <el-dropdown trigger="click" placement="bottom" @command="handleMove">
                <i class="el-icon-rank"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(project, key) in projects"
                    :key="key"
                    :command="{title:item.config.title, hash:item.hash, project: project, key:key}">
                    {{ project }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>

            <el-tooltip :content="'克隆'" placement="bottom">
              <i class="el-icon-copy-document" @click="handleClone(item.hash, item.config.title)"></i>
            </el-tooltip>

            <el-tooltip :content="'删除'" placement="bottom">
              <i class="el-icon-delete" @click="handleDelete(item)"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="item-box-bottom">
          <h4 class="template-item-title">{{item.config.title}}</h4>
          <p>
            <span>{{ item.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            <el-tooltip :disabled="item | needRepublish" :content="'内容已更新, 未重新发布'" placement="bottom">
                <!-- <span>{{ item.publish.status | statusFilter }}</span> -->
              <el-link type="info" style="float:right" :disabled="!item.publish.hash" :href="item.publish.hash | pubUrlFilter" target="_blank">
                <i class="el-icon-share el-icon--left" v-show="item.publish.hash"></i>
                {{ item.publish.status | statusFilter }}
              </el-link>
            </el-tooltip>
          </p>
        </div>
      </div>
    </div>

    <el-table
      v-show="viewType == 'list'"
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="'序号'" prop="id" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.sequenceNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'大屏名称'" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.config.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'分享链接'" min-width="250px">
        <template slot-scope="scope" >
          <div v-show="scope.row.publish.status === 'published'">
            <el-link type="primary" :href="scope.row.publish.hash | pubUrlFilter" target="_blank">{{ scope.row.publish.hash | pubUrlFilter }}</el-link>
            <el-tooltip effect="dark" :content="'复制'" placement="bottom">
              <el-button size="mini" type="success" icon="el-icon-document-copy" @click="handleCopy(scope.row.publish.hash, $event)" circle></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" :content="'下载'" placement="bottom">
              <el-button size="mini" type="primary" icon="el-icon-download" @click="handleDownload(scope.row.publish.hash)" circle></el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="'发布'" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tooltip :disabled="scope.row | needRepublish" :content="'内容已更新, 未重新发布'" placement="left">
            <el-badge is-dot style="margin-top: 3px;" :hidden="scope.row | needRepublish">
              <el-dropdown trigger="click" placement="bottom" @command="handlePublish">
                <el-button size="mini" type="primary" plain>{{ scope.row.publish.status | statusFilter }}</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-tooltip effect="dark" :content="'删除已发布链接'" placement="left">
                    <el-dropdown-item
                      icon="el-icon-remove-outline"
                      v-show="scope.row.publish.status === 'published'"
                      :command="{hash:scope.row.hash, cmd:'unpublish'}">
                      {{ '停止发布' }}
                    </el-dropdown-item>
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="'生成一个新的链接'" placement="left">
                    <el-dropdown-item
                      icon="el-icon-circle-plus-outline"
                      v-show="scope.row.publish.status === 'unpublish'"
                      :command="{hash:scope.row.hash, cmd:'published'}">
                      {{' 公开发布 '}}
                    </el-dropdown-item>
                  </el-tooltip>

                  <el-tooltip effect="dark" :content="'更新已发布链接的内容'" placement="left">
                    <el-dropdown-item
                      icon="el-icon-refresh"
                      v-show="scope.row.publish.status === 'published' && scope.row.config.timestamp > scope.row.publish.timestamp"
                      :command="{hash:scope.row.hash, cmd:'republish'}">
                      {{' 重新发布 '}}
                    </el-dropdown-item>
                  </el-tooltip>
                </el-dropdown-menu>
              </el-dropdown>
            </el-badge>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column :label="'操作'" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handlePreview(scope.row.hash)">{{ '预览' }}</el-button>
          <el-button size="mini" type="success" @click="handleDesign(scope.row.hash)">{{ '编辑' }}</el-button>
          <el-button size="mini" type="info" @click="handleClone(scope.row.hash, scope.row.config.title)">{{ '克隆' }}</el-button>
          <!-- 移动分组 -->
          <div style="display:inline-block; padding-left:10px">
            <el-dropdown trigger="click" placement="bottom" @command="handleMove">
              <el-button size="mini" type="warning">{{ '移动' }}</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(project, key) in projects"
                  :key="key"
                  :command="{title:scope.row.config.title, hash:scope.row.hash, project: project, key:key}">
                  {{ project }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ '删除' }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--新建大屏-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="createTable" label-position="top" label-width="70px">
        <el-form-item :label="'大屏名称'" :placeholder="'请输入大屏名称'" prop="title">
          <el-input v-model="createTable.name"/>
        </el-form-item>

        <el-form-item :label="'选择模板'" v-show="this.templateList">
          <template-list
            :templates="templateList"
            @onselect="onSelectTemplate">
          </template-list>
        </el-form-item>

        <el-form-item :label="'大屏简介'">
          <el-input type="textarea" :rows="3" :placeholder="'请填写关于大屏的描述信息'" v-model="createTable.about"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="createSubmit()">{{ '创建' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createDashboard, deleteDashboard, publishDashboard, downloadDashboard, moveDashboard } from '@/api/dashboard'
import { fetchTemplateList } from '@/api/template'

import waves from '@/directive/waves' // Waves directive
import TemplateList from '@/components/Dashboard/Template'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import clip from '@/scripts/clipboard'

const publishTypeOptions = {
  published: '已发布',
  unpublish: '未发布'
}

export default {
  name: 'ManageDashboard',
  components: { Pagination, TemplateList },
  directives: { waves },
  filters: {
    statusFilter (status) {
      return publishTypeOptions[status] || '未发布'
    },
    pubUrlFilter (hash) {
      return hash ? window.location.protocol + '//' + window.location.host + '/dashboard/' + hash : '#'
    },
    needRepublish (row) {
      return row.publish.status !== 'published' || row.config.timestamp <= row.publish.timestamp
    },
    fullImgUrl (url) {
      return process.env.BASE_API + url
    }
  },
  data () {
    return {
      delPopover: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        title: undefined,
        status: undefined,
        project: this.$route.name || 'all'
      },
      publishTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      createTable: {},
      templateList: null,
      dialogTitle: '',
      dialogFormVisible: false,
      downloadLoading: false,
      isRouterAlive: true,
      viewType: 'box'
    }
  },
  computed: {
    projects () {
      return this.$store.state.user.projects
    },
    group () {
      if (this.$route.name === 'all' || this.$route.name === 'ungrouped') {
        return ''
      } else {
        return this.$route.name
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        if (response.data.total > 0) {
          this.serialList(response.data.items)
        }
        this.list = response.data.items
        this.total = response.data.total || 0

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID (order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCopy (text, event) {
      const pubUrlFilter = this.$options.filters['pubUrlFilter']

      clip(pubUrlFilter(text), event)
    },
    resetTemp () {
      this.createTable = {
        name: '',
        timestamp: Number(new Date()),
        template: 'blank',
        about: '',
        mode: 'create',
        project: this.group
      }
    },
    handleCreate () {
      fetchTemplateList().then(response => {
        this.templateList = response.data.items
      })

      this.resetTemp()
      this.dialogTitle = '新建大屏'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleClone (hash, title) {
      this.resetTemp()
      this.templateList = null
      this.dialogTitle = '大屏克隆 - <' + title + '>'

      this.createTable.template = hash
      this.createTable.mode = 'clone'

      this.dialogFormVisible = true
    },
    createSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDashboard(this.createTable).then(response => {
            // 跳转到编辑页面
            this.handleDesign(response.hash)
          })
        }
      })
    },
    handleUpdate (row) {
      this.createTable = Object.assign({}, row) // copy obj
      this.createTable.timestamp = new Date(this.createTable.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete: function (row) {
      this.$confirm('确定要删除大屏"' + row.config.title + '"吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteDashboard(row.hash).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
          this.getList()
        })
      }).catch(() => {})
    },
    handleDownload (hash) {
      if (!hash) {
        this.$message.error('大屏未发布!')
        return
      }

      this.downloadLoading = true
      downloadDashboard(hash).then(response => {
        if (response.code === 0) {
          window.location = process.env.BASE_API + '/' + response.data
        }
      })
    },
    handlePublish (param) {
      publishDashboard(param.hash, param.cmd).then(response => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })

        this.getList()
      })
    },
    handleDesign (hash) {
      this.listLoading = true
      this.$router.push('/edit/dashboard/' + hash + '?from=' + (this.$route.name || 'all'))
    },
    handlePreview (hash) {
      const routeUrl = this.$router.resolve({
        path: '/preview/' + hash
      })

      window.open(routeUrl.href, '_blank')
    },
    handleMove (param) {
      this.$confirm('确定将大屏"' + param.title + '"移动到 ' + param.project + ' 分组吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        moveDashboard(param.hash, param.key).then(response => {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {})
    },
    serialList (list) {
      for (let i = 0; i < list.length; i++) {
        list[i]['sequenceNumber'] = i + 1
      }
    },
    onSelectTemplate: function (data) {
      this.createTable.template = data.hash
    }
  }
}
</script>

<style scoped>
  @import '../../styles/view-box.css';

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .view-type {
    float: right;
    padding-right: 20px;
    height: 100%;
    line-height: 50px;
    font-size: 20px;
    cursor: pointer;
    color: #f4f4f5;
  }
  .view-type .active {
    color: #299eff;
  }

</style>
