<template>
  <div class="mod-inspection-line">
    <div class="show-data-content">
    <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
      <template slot="paneL" >
        <div class="show-left">
        <div class="org_title">
          <span v-if="this.isDrawBack===false">机构列表</span style="vertical-align: middle;"><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
        </div>
        <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
        </div>
      </template>
   <template slot="paneR">
    <div class="show-data-table">
      <div class="show-data-up">
          <el-form :inline="true" :model="lineForm" @keyup.enter.native="search()">
            <el-form-item>
              <el-input v-model="lineForm.name" placeholder="线路名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="search()">查询</el-button>
              <el-button v-if="isAuth('inspection:inspectionline:save')" @click="lineAddOrUpdateHandle()">新增</el-button>
              <el-button v-if="isAuth('inspection:inspectionline:publish')" @click="linePublish()" :icon="publishIcon">{{publishName}}</el-button>
            </el-form-item>
          </el-form>
          <el-table
            height="210"
            :data="lineList"
            border
            v-loading="lineListLoading"
            highlight-current-row
            @current-change="lineSelectionChangeHandle"
            :cell-style="cellStyle"
            :row-style="rowStyle"
            style="width: 100%;">
            <el-table-column
              fixed
              type="index"
              header-align="center"
              align="center">
            </el-table-column>
            <el-table-column
              fixed
              prop="name"
              header-align="center"
              align="center"
              label="线路名称">
            </el-table-column>
            <el-table-column
              prop="deptName"
              header-align="center"
              align="center"
              label="所属机构">
            </el-table-column>
            <el-table-column
              prop="typeName"
              header-align="center"
              align="center"
              width="80"
              label="巡检类型">
            </el-table-column>
            <el-table-column
              prop="periodTypeName"
              header-align="center"
              align="center"
              width="80"
              label="巡检周期">
            </el-table-column>
            <el-table-column
              prop="isPublish"
              header-align="center"
              align="center"
              width="80"
              label="发布">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="未发布" placement="top-start">
                  <span class="el-icon-edit-outline" v-if="scope.row.isPublish === 0" style="font-size:16px;"></span>
                </el-tooltip>
                <el-tooltip effect="light" content="已发布" placement="top-start">
                  <span class="el-icon-check" v-if="scope.row.isPublish === 1" style="color:darkgreen;font-size:16px;"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="downloadStatus"
              header-align="center"
              align="center"
              width="80"
              label="下载状态">
            </el-table-column>
            <el-table-column
              prop="updateTime"
              header-align="center"
              align="center"
              label="修改时间">
            </el-table-column>
            <el-table-column
              prop="orderNum"
              header-align="center"
              align="center"
              width="60"
              label="排序">
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope" sytle="z-index=1;">
                <el-button v-if="isAuth('inspection:inspectionline:save') && scope.row.isPublish===0" type="text" size="small" @click="lineAddOrUpdateHandle(scope.row.id)">修改</el-button>
                <el-button v-if="isAuth('inspection:inspectionline:delete') && scope.row.isPublish===0" type="text" size="small" @click="lineDeleteHandle(scope.row.id)">删除</el-button>
                <el-button v-if="scope.row.isPublish===1" type="text" size="small" @click="viewPublish(scope.row.id)">下载详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="lineSizeChangeHandle"
            @current-change="lineCurrentChangeHandle"
            :current-page="linePageIndex"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="linePageSize"
            :total="lineTotalPage"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
          <!-- 弹窗, 新增 / 修改 -->
          <LineAddOrUpdate v-if="lineAddOrUpdateVisible" ref="lineAddOrUpdate" @refreshDataList="getLineList(lineForm.deptId)"></LineAddOrUpdate>
          <viewPublish v-if="viewPublishVisible" ref="viewPublish"></viewPublish>
      </div>
      <div class="show-data-down">
      <el-tabs type="border-card" v-model="activeTab" @tab-click="tabSelectChangeHandle">
      <el-tab-pane label="班组" name="class">
          <div class="mod-class-group">
            <el-form :inline="true">
              <el-form-item>
                <el-button v-if="isAuth('inspection:classgroup:save') && isPublish===0"  @click="classGroupAddOrUpdateHandle()" :disabled="lineForm.lineId <= 0">新增</el-button>
                <el-button v-if="isAuth('inspection:classgroup:delete') && isPublish===0" type="warning" @click="classGroupDeleteHandle()" :disabled="classGroupListSelections.length <= 0">批量删除</el-button>
              </el-form-item>
            </el-form>
            <el-table height="210"
              :data="classGroupList"
              border
              v-loading="classGroupListLoading"
              @selection-change="classGroupSelectionChangeHandle"
              :cell-style="cellStyle"
              :row-style="rowStyle"
              style="width: 100%;">
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="workerNames"
                header-align="center"
                align="center"
                label="用户">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('inspection:classgroup:save') && isPublish===0" type="text" size="small" @click="classGroupAddOrUpdateHandle(scope.row.id)">修改</el-button>
                  <el-button v-if="isAuth('inspection:classgroup:delete') && isPublish===0" type="text" size="small" @click="classGroupDeleteHandle(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="classGroupSizeChangeHandle"
              @current-change="classGroupCurrentChangeHandle"
              :current-page="classGroupPageIndex"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="classGroupPageSize"
              :total="classGroupTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <!-- 弹窗, 新增 / 修改 -->
            <ClassGroupAddOrUpdate v-if="classGroupAddOrUpdateVisible" ref="classGroupAddOrUpdate" @refreshDataList="getClassGroupList"></ClassGroupAddOrUpdate>
          </div>
        </el-tab-pane>
        <el-tab-pane label="轮次" name="turn">
         <div class="mod-turn">
            <el-form :inline="true">
              <el-form-item>
                <el-button v-if="isAuth('inspection:turn:save') && isPublish===0" @click="turnAddOrUpdateHandle()" :disabled="lineForm.lineId <= 0">新增</el-button>
                <el-button v-if="isAuth('inspection:turn:delete') && isPublish===0" type="warning" @click="turnDeleteHandle()" :disabled="turnListSelections.length <= 0">批量删除</el-button>
              </el-form-item>
            </el-form>
            <el-table height="210"
              :data="turnList"
              border
              v-loading="turnListLoading"
              @selection-change="turnSelectionChangeHandle"
              :cell-style="cellStyle"
              :row-style="rowStyle"
              style="width: 100%;">
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="classGroupNames"
                header-align="center"
                align="center"
                label="班组集合">
              </el-table-column>
              <el-table-column
                prop="startTime"
                header-align="center"
                align="center"
                label="开始时间">
              </el-table-column>
              <el-table-column
                prop="endTime"
                header-align="center"
                align="center"
                label="结束时间">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('inspection:turn:save') && isPublish===0" type="text" size="small" @click="turnAddOrUpdateHandle(scope.row.id)">修改</el-button>
                  <el-button v-if="isAuth('inspection:turn:delete') && isPublish===0" type="text" size="small" @click="turnDeleteHandle(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="turnSizeChangeHandle"
              @current-change="turnCurrentChangeHandle"
              :current-page="turnPageIndex"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="turnPageSize"
              :total="turnTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <!-- 弹窗, 新增 / 修改 -->
            <TurnAddOrUpdate v-if="turnAddOrUpdateVisible" ref="turnAddOrUpdate" @refreshDataList="getTurnList"></TurnAddOrUpdate>
          </div>
        </el-tab-pane>
        <el-tab-pane label="周期" name="period">
          <div class="mod-period">
            <el-form :inline="true">
              <el-form-item>
                <el-button v-if="isAuth('inspection:inspectionperiod:save') && isPublish===0" @click="periodAddOrUpdateHandle()" :disabled="lineForm.lineId <= 0">新增</el-button>
                <el-button v-if="isAuth('inspection:inspectionperiod:delete') && isPublish===0" type="warning" @click="periodDeleteHandle()" :disabled="periodListSelections.length <= 0">批量删除</el-button>
              </el-form-item>
            </el-form>
            <div class="data-period">
            <el-scrollbar wrap-class="data-period">
            <el-table height="210"
              :data="periodList"
              border
              v-loading="periodListLoading"
              @selection-change="periodSelectionChangeHandle"
              :cell-style="cellStyle"
              :rowStyle="rowStyle"
              style="width: 100%;">
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="name"
                header-align="center"
                align="center"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="basePoint"
                header-align="center"
                align="center"
                label="开始时间">
              </el-table-column>
              <el-table-column
                prop="frequency"
                header-align="center"
                align="center"
                width="50"
                label="频度">
              </el-table-column>
              <el-table-column
                prop="startPoint"
                header-align="center"
                align="center"
                label="跨度起点">
              </el-table-column>
              <el-table-column
                prop="span"
                header-align="center"
                align="center"
                width="50"
                label="跨度">
              </el-table-column>
              <el-table-column
                prop="turnFinishModName"
                header-align="center"
                align="center"
                label="完成模式">
              </el-table-column>
              <el-table-column
                prop="turnNames"
                header-align="center"
                align="center"
                label="轮次集合">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="110"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('inspection:inspectionperiod:save') && isPublish===0" type="text" size="small" @click="periodAddOrUpdateHandle(scope.row.id)">修改</el-button>
                  <el-button v-if="isAuth('inspection:inspectionperiod:delete') && isPublish===0" type="text" size="small" @click="periodDeleteHandle(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            </el-scrollbar>
            </div>
            <el-pagination
              @size-change="periodSizeChangeHandle"
              @current-change="periodCurrentChangeHandle"
              :current-page="periodPageIndex"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="periodPageSize"
              :total="periodTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <!-- 弹窗, 新增 / 修改 -->
            <PeriodAddOrUpdate v-if="periodAddOrUpdateVisible" ref="periodAddOrUpdate" @refreshDataList="getPeriodList"></PeriodAddOrUpdate>
          </div>
        </el-tab-pane>
        <el-tab-pane label="巡区" name="zone">
          <div class="mod-line-zone">
            <el-form :inline="true">
              <el-form-item>
                <el-button v-if="isAuth('inspection:linezone:save') && isPublish===0" @click="zoneBindAddOrUpdateHandle()" :disabled="lineForm.lineId <= 0">绑定</el-button>
                <el-button v-if="isAuth('inspection:linezone:delete') && isPublish===0" type="warning" @click="lineZoneDeleteHandle()" :disabled="lineZoneListSelections.length <= 0">批量删除</el-button>
              </el-form-item>
            </el-form>
            <el-scrollbar>
            <el-table height="210"
              :data="lineZoneList"
              border
              v-loading="lineZoneListLoading"
              @selection-change="lineZoneSelectionChangeHandle"
              :cell-style="cellStyle"
              :row-style="rowStyle"
              style="width: 100%;">
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="zoneName"
                header-align="center"
                align="center"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="zoneCode"
                header-align="center"
                align="center"
                label="编码">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('inspection:linezone:delete') && isPublish===0" type="text" size="small" @click="lineZoneDeleteHandle(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            </el-scrollbar>
            <el-pagination
              @size-change="lineZoneSizeChangeHandle"
              @current-change="lineZoneCurrentChangeHandle"
              :current-page="lineZonePageIndex"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="lineZonePageSize"
              :total="lineZoneTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <!-- 弹窗, 新增 / 修改 -->
            <ZoneBindAddOrUpdate v-if="lineZoneAddOrUpdateVisible" ref="zoneBindAddOrUpdate" @refreshDataList="getLineZoneList" @ZoneBindEvent="zoneBindEvent"></ZoneBindAddOrUpdate>
          </div>
        </el-tab-pane>
        <el-tab-pane label="PDA" name="pda">
          <div class="mod-line-pda">
            <el-form :inline="true">
              <el-form-item>
                <el-button v-if="isAuth('inspection:inspectionlinepublish:save') && isPublish===0" @click="pdaBindAddOrUpdateHandle()" :disabled="lineForm.lineId <= 0">绑定</el-button>
                <el-button v-if="isAuth('inspection:inspectionlinepublish:delete') && isPublish===0" type="warning" @click="pdaDeleteHandle()" :disabled="linePdaListSelections.length <= 0">批量删除</el-button>
              </el-form-item>
            </el-form>
            <el-scrollbar>
            <el-table height="210"
              :data="linePdaList"
              border
              v-loading="linePdaListLoading"
              @selection-change="linePdaSelectionChangeHandle"
              :cell-style="cellStyle"
              :row-style="rowStyle"
              style="width: 100%;">
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                type="index"
                header-align="center"
                align="center">
              </el-table-column>
              <el-table-column
                prop="pdaName"
                header-align="center"
                align="center"
                label="Pda名称">
              </el-table-column>
              <el-table-column
                prop="pdaMac"
                header-align="center"
                align="center"
                label="pda地址">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="isAuth('inspection:inspectionlinepublish:delete') && isPublish===0" type="text" size="small" @click="pdaDeleteHandle(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            </el-scrollbar>
            <el-pagination
              @size-change="linePdaSizeChangeHandle"
              @current-change="linePdaCurrentChangeHandle"
              :current-page="linePdaPageIndex"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="linePdaPageSize"
              :total="linePdaTotalPage"
              layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
            <!-- 弹窗, 新增 / 修改 -->
            <PdaAddOrUpdate v-if="linePdaAddOrUpdateVisible" ref="pdaBindAddOrUpdate" @refreshDataList="getLinePdaList" @PdaBindEvent="pdaBindEvent"></PdaAddOrUpdate>
          </div>
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
  </template>
  </split-pane>
  </div>
  </div>
</template>

<script>
  import depttree from '@/components/dept-tree'
  import PdaAddOrUpdate from './publish-pda'
  import LineAddOrUpdate from './inspectionline-add-or-update'
  import TurnAddOrUpdate from './turn-add-or-update'
  import ClassGroupAddOrUpdate from './classgroup-add-or-update'
  import PeriodAddOrUpdate from './inspectionperiod-add-or-update'
  import ZoneBindAddOrUpdate from './zonebind-add-or-update'
  import ViewPublish from './inspectionlinepublish'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        lineForm: {
          lineId: null,
          deptId: null,
          periodType: 0,
          name: null
        },
        isPublish: 0,
        publishIcon: 'el-icon-circle-check-outline',
        publishName: '发布计划',
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 16,
        oldPercent: 16,
        lineList: [],
        turnList: [],
        classGroupList: [],
        periodList: [],
        lineZoneList: [],
        linePdaList: [],
        linePageIndex: 1,
        linePageSize: 5,
        lineTotalPage: 0,
        turnPageIndex: 1,
        turnPageSize: 5,
        turnTotalPage: 0,
        classGroupPageIndex: 1,
        classGroupPageSize: 5,
        classGroupTotalPage: 0,
        periodPageIndex: 1,
        periodPageSize: 5,
        periodTotalPage: 0,
        lineZonePageIndex: 1,
        lineZonePageSize: 5,
        lineZoneTotalPage: 0,
        linePdaPageIndex: 1,
        linePdaPageSize: 5,
        linePdaTotalPage: 0,
        lineListLoading: false,
        turnListLoading: false,
        classGroupListLoading: false,
        periodListLoading: false,
        lineZoneListLoading: false,
        linePdaListLoading: false,
        lineListSelections: [],
        turnListSelections: [],
        classGroupListSelections: [],
        periodListSelections: [],
        lineZoneListSelections: [],
        linePdaListSelections: [],
        lineAddOrUpdateVisible: false,
        turnAddOrUpdateVisible: false,
        viewPublishVisible: false,
        classGroupAddOrUpdateVisible: false,
        periodAddOrUpdateVisible: false,
        lineZoneAddOrUpdateVisible: false,
        linePdaAddOrUpdateVisible: false,
        activeTab: 'class'
      }
    },
    components: {
      depttree,
      PdaAddOrUpdate,
      LineAddOrUpdate,
      TurnAddOrUpdate,
      ClassGroupAddOrUpdate,
      PeriodAddOrUpdate,
      ZoneBindAddOrUpdate,
      ViewPublish,
      splitPane
    },
    activated () {
      this.getLineList()
    },
    methods: {
      search () {
        this.lineForm.deptId = null
        this.getLineList(null)
      },
      onDrawBack () {
        this.isDrawBack = !this.isDrawBack
        if (this.isDrawBack) {
          this.oldPercent = this.curPercent
          this.curPercent = 2.5
          this.drawBackClass = 'el-icon-d-arrow-right'
        } else {
          this.drawBackClass = 'el-icon-d-arrow-left'
          this.curPercent = this.oldPercent
        }
        this.$refs.splitPane.setPercent(this.curPercent)
      },
      resize (val) {
        this.curPercent = val
      },
      // 获取数据列表
      getLineList (deptId) {
        this.lineListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionline/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.linePageIndex,
            'limit': this.linePageSize,
            'deptId': deptId,
            'name': this.lineForm.name
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.lineList = data.page.list
            this.lineTotalPage = data.page.totalCount
          } else {
            this.lineList = []
            this.lineTotalPage = 0
          }
          this.lineListLoading = false
        })
      },
      getTurnList () {
        this.turnListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/turn/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.turnPageIndex,
            'limit': this.turnPageSize,
            'inspectionLineId': this.lineForm.lineId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.turnList = data.page.list
            this.turnTotalPage = data.page.totalCount
          } else {
            this.turnList = []
            this.turnTotalPage = 0
          }
          this.turnListLoading = false
        })
      },
      getClassGroupList () {
        this.classGroupListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/classgroup/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.classGroupPageIndex,
            'limit': this.classGroupPageSize,
            'inspectionLineId': this.lineForm.lineId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.classGroupList = data.page.list
            this.classGroupTotalPage = data.page.totalCount
          } else {
            this.classGroupList = []
            this.classGroupTotalPage = 0
          }
          this.classGroupListLoading = false
        })
      },
      getPeriodList () {
        this.periodListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionperiod/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.periodPageIndex,
            'limit': this.periodPageSize,
            'lineId': this.lineForm.lineId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.periodList = data.page.list
            this.periodTotalPage = data.page.totalCount
          } else {
            this.periodList = []
            this.periodTotalPage = 0
          }
          this.periodListLoading = false
        })
      },
      getLineZoneList () {
        this.lineZoneListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/linezone/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.lineZonePageIndex,
            'limit': this.lineZonePageSize,
            'lineId': this.lineForm.lineId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.lineZoneList = data.page.list
            this.lineZoneTotalPage = data.page.totalCount
          } else {
            this.lineZoneList = []
            this.lineZoneTotalPage = 0
          }
          this.lineZoneListLoading = false
        })
      },
      getLinePdaList () {
        this.linePdaListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionlinepublish/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.linePdaPageIndex,
            'limit': this.linePdaPageSize,
            'lineId': this.lineForm.lineId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.linePdaList = data.page.list
            this.linePdaTotalPage = data.page.totalCount
          } else {
            this.linePdaList = []
            this.linePdaTotalPage = 0
          }
          this.linePdaListLoading = false
        })
      },
      // 每页数
      lineSizeChangeHandle (val) {
        this.linePageSize = val
        this.linePageIndex = 1
        this.getLineList(this.lineForm.deptId)
      },
      // 每页数
      turnSizeChangeHandle (val) {
        this.turnPageSize = val
        this.turnPageIndex = 1
        this.getTurnList()
      },
      // 每页数
      classGroupSizeChangeHandle (val) {
        this.classGroupPageSize = val
        this.classGroupPageIndex = 1
        this.getClassGroupList()
      },
      // 每页数
      periodSizeChangeHandle (val) {
        this.periodPageSize = val
        this.periodPageIndex = 1
        this.getPeriodList()
      },
      // 每页数
      lineZoneSizeChangeHandle (val) {
        this.lineZonePageSize = val
        this.lineZonePageIndex = 1
        this.getLineZoneList()
      },
      // 每页数
      linePdaSizeChangeHandle (val) {
        this.linePdaPageSize = val
        this.linePdaPageIndex = 1
        this.getLinePdaList()
      },
      // 当前页
      lineCurrentChangeHandle (val) {
        this.linePageIndex = val
        this.getLineList(this.lineForm.deptId)
      },
      // 当前页
      turnCurrentChangeHandle (val) {
        this.turnPageIndex = val
        this.getTurnList()
      },
      // 当前页
      classGroupCurrentChangeHandle (val) {
        this.classGroupPageIndex = val
        this.getClassGroupList()
      },
      // 当前页
      periodCurrentChangeHandle (val) {
        this.periodPageIndex = val
        this.getPeriodList()
      },
      // 当前页
      lineZoneCurrentChangeHandle (val) {
        this.lineZonePageIndex = val
        this.getLineZoneList()
      },
      // 当前页
      linePdaCurrentChangeHandle (val) {
        this.linePdaPageIndex = val
        this.getLinePdaList()
      },
      // 选择线路
      lineSelectionChangeHandle (val) {
        if (val != null) {
          this.isPublish = val.isPublish
          if (val.isPublish === 0) {
            this.publishIcon = 'el-icon-circle-check-outline'
            this.publishName = '发布计划'
          } else {
            this.publishIcon = 'el-icon-edit-outline'
            this.publishName = '修改计划'
          }

          this.lineForm.lineId = val.id
          this.lineForm.periodType = val.periodType
          this.getDataList()
        } else {
          this.lineForm.lineId = 0
          this.lineForm.periodType = 0
        }
      },
      // 多选
      turnSelectionChangeHandle (val) {
        this.turnListSelections = val
      },
      // 多选
      classGroupSelectionChangeHandle (val) {
        this.classGroupListSelections = val
      },
      // 多选
      periodSelectionChangeHandle (val) {
        this.periodListSelections = val
      },
      // 多选
      lineZoneSelectionChangeHandle (val) {
        this.lineZoneListSelections = val
      },
      // 多选
      linePdaSelectionChangeHandle (val) {
        this.linePdaListSelections = val
      },
      // 新增 / 修改
      lineAddOrUpdateHandle (id) {
        this.lineAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.lineAddOrUpdate.getDeptList()
          this.$refs.lineAddOrUpdate.init(id)
        })
      },
      // 新增 / 修改
      turnAddOrUpdateHandle (id) {
        this.turnAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.turnAddOrUpdate.dataForm.inspectionLineId = this.lineForm.lineId
          this.$refs.turnAddOrUpdate.getClassGroupList()
          this.$refs.turnAddOrUpdate.init(id)
        })
      },
      viewPublish (lineId) {
        this.viewPublishVisible = true
        this.$nextTick(() => {
          this.$refs.viewPublish
          this.$refs.viewPublish.getDataList(lineId)
        })
      },
      classGroupAddOrUpdateHandle (id) {
        this.classGroupAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.classGroupAddOrUpdate.dataForm.inspectionLineId = this.lineForm.lineId
          this.$refs.classGroupAddOrUpdate.getUserList()
          this.$refs.classGroupAddOrUpdate.init(id, this.lineForm.deptId)
        })
      },
      periodAddOrUpdateHandle (id) {
        this.periodAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.periodAddOrUpdate.periodType = this.lineForm.periodType
          this.$refs.periodAddOrUpdate.dataForm.inspectionLineId = this.lineForm.lineId
          this.$refs.periodAddOrUpdate.getTurnList()
          this.$refs.periodAddOrUpdate.init(id)
        })
      },
      zoneBindAddOrUpdateHandle (id) {
        this.lineZoneAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.zoneBindAddOrUpdate.dataForm.inspectionLineId = this.lineForm.lineId
          this.$refs.zoneBindAddOrUpdate.init(this.lineForm.deptId)
        })
      },
      pdaBindAddOrUpdateHandle (id) {
        this.linePdaAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.pdaBindAddOrUpdate.dataForm.inspectionLineId = this.lineForm.lineId
          this.$refs.pdaBindAddOrUpdate.init(this.lineForm.deptId)
        })
      },
      handleDeptSelect (val) {
        this.lineList = []
        this.turnList = []
        this.classGroupList = []
        this.periodList = []
        this.lineForm.lineId = 0
        this.lineForm.deptId = val
        this.linePageIndex = 1
        this.getLineList(this.lineForm.deptId)
      },
      tabSelectChangeHandle (val) {
        this.classGroupPageIndex = 1
        this.periodPageIndex = 1
        this.turnPageIndex = 1
        this.lineZonePageIndex = 1
        this.linePdaPageIndex = 1
        this.getDataList()
      },
      rowStyle ({row, rowIndex}) {
        return 'height:25px'
      },
      cellStyle () {
        return 'padding:0'
      },
      getDataList () {
        if (this.activeTab === 'turn') {
          this.getTurnList()
        }
        if (this.activeTab === 'class') {
          this.getClassGroupList()
        }
        if (this.activeTab === 'period') {
          this.getPeriodList()
        }
        if (this.activeTab === 'zone') {
          this.getLineZoneList()
        }
        if (this.activeTab === 'pda') {
          this.getLinePdaList()
        }
      },
      // 删除
      periodDeleteHandle (id) {
        var ids = id ? [id] : this.periodListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/inspectionperiod/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getPeriodList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 删除
      lineZoneDeleteHandle (id) {
        var ids = id ? [id] : this.lineZoneListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/linezone/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getLineZoneList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 删除
      lineDeleteHandle (id) {
        var ids = id ? [id] : this.lineListSelections.map(item => {
          return item.id
        })
       this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/inspectionline/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getLineList(this.lineForm.deptId)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 删除
      turnDeleteHandle (id) {
        var ids = id ? [id] : this.turnListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/turn/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getTurnList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 删除
      classGroupDeleteHandle (id) {
        var ids = id ? [id] : this.classGroupListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/classgroup/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getClassGroupList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 删除
      pdaDeleteHandle (id) {
        var ids = id ? [id] : this.pdaListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/inspectionlinepublish/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getLinePdaList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      zoneBindEvent (val) {
        var zoneIds = val.map(item => {
          return item.zoneId
        })
        if (zoneIds.length > 0) {
          this.$http({
            url: this.$http.adornUrl('/inspection/linezone/bind'),
            method: 'post',
            params: this.$http.adornParams({
              'lineId': this.lineForm.lineId
            }),
            data: this.$http.adornData(zoneIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getLineZoneList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      pdaBindEvent (val) {
        var pdaIds = val.map(item => {
          return item.pdaId
        })
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionlinepublish/bind'),
          method: 'post',
          params: this.$http.adornParams({
            'lineId': this.lineForm.lineId
          }),
          data: this.$http.adornData(pdaIds, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getLinePdaList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      linePublish () {
        if (this.lineForm.lineId === 0) {
          return
        }
        if (this.publishName === '修改计划') {
          this.$confirm(`确定将线路由已发布状态改为编操状态作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/inspection/inspectionline/update'),
              method: 'post',
              data: this.$http.adornData({
                'id': this.lineForm.lineId,
                'isPublish': 0
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getLineList(this.lineForm.deptId)
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          })
        }

        if (this.publishName === '发布计划') {
          this.$http({
            url: this.$http.adornUrl(`/inspection/inspectionline/publish/${this.lineForm.lineId}`),
            method: 'post'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getLineList(this.lineForm.deptId)
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    }
  }
</script>