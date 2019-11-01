<template>
  <el-dialog
    v-dialog-drag 
    wdith="800px"
    :title="!dataForm.id ? '数据列表' : '数据列表'"
    :close-on-click-modal="false"
    :append-to-body='true'
    :visible.sync="visible"
    class="dialog"
  >
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px" class="data_el_form">
      <div >
        <span class="span-a">拟制中</span><span class="span-b">已下发</span><span class="span-c">已受理</span><span class="span-d">已审核</span>
        <el-progress :text-inside="true"  :stroke-width="18" :show-text="true"  :percentage="progressNum" ></el-progress>
      </div>
      <div>
        <div style="border-left: 8px solid #8c939d; margin-top: 20px;">
          <el-form-item label="工单主题" prop="orderName">
            {{dataForm.orderName}}
          </el-form-item>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工单类型" prop="orderType">
                {{dataForm.orderTypeName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工单状态" prop="orderStatus">
                {{dataForm.orderStatusName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工单编号" prop="orderNumber">
                {{dataForm.orderNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属机构" prop="deptId">
                {{dataForm.deptName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="缺陷单主题" prop="orderName">
            {{dataForm.defectiveTheme}}
          </el-form-item>
          <el-row>
            <el-col :span="6">
              <el-form-item label="缺陷单编号" prop="defectiveNumber">
                {{dataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="归属设备" prop="defectiveDevice">
                {{dataForm.defectiveDevice}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺陷类型" prop="orderTypeName">
                {{dataForm.orderTypeName}}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺陷等级" prop="exceptionName">
                {{dataForm.exceptionName}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
      </div>
      <div >
      <p style="border-left: 8px solid #8c939d;padding-left: 12px;margin: 20px 0; font-weight: bold;">流程记录</p>
      <div v-for="item in recordList" :key="item.recordId" style="">
          <el-form-item :label="item.orderPeopleName" style="border-left: 8px solid #8c939d">
              {{item.orderPeople}}:{{item.orderOpinion}} <br>
             {{item.nowTime}}
          </el-form-item>
      </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        dataForm: {
          key: '',
          recordId: 0,
          orderNumber: '',
          defectiveId: '',
          defectiveNumber: '',
          defectiveTheme: '',
          orderName: '',
          deptId: '',
          deptName: '',
          orderTypeName: '',
          defectiveName: '',
          orderApplicant: '',
          orderApplicantId: '',
          orderApplicantOpinion: '',
          orderAcceptor: '',
          orderAcceptorId: '',
          orderAcceptorOpinion: '',
          orderConfirmer: '',
          orderConfirmerId: '',
          orderConfirmerOpinion: '',
          levelId: '',
          orderStatus: '',
          orderStatusName: '',
          exceptionName: '',
          defectiveDevice: ''
        },
        pageIndex: 1,
        pageSize: 50,
        limit: 2000,
        progressNum: 10,
        recordList: [
          {orderId: 0, orderPeopleName: '', orderPeople: '', orderOpinion: '', nowTime: ''}
        ],
        proName: '拟制中'
      }
    },
    methods: {
      init (id, orderNumber) {
        this.dataForm.recordId = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`/management/ordermanagement/info/${this.dataForm.recordId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.orderNumber = data.ordermanagement.orderNumber
              this.dataForm.defectiveId = data.ordermanagement.defectiveId
              this.dataForm.defectiveNumber = data.ordermanagement.defectiveNumber
              this.dataForm.defectiveTheme = data.ordermanagement.defectiveTheme
              this.dataForm.orderName = data.ordermanagement.orderName
              this.dataForm.deptId = data.ordermanagement.deptId
              this.dataForm.deptName = data.ordermanagement.deptName
              this.dataForm.orderTypeName = data.ordermanagement.orderTypeName
              this.dataForm.defectiveName = data.ordermanagement.defectiveName
              this.dataForm.orderApplicant = data.ordermanagement.orderApplicant
              this.dataForm.orderApplicantId = data.ordermanagement.orderApplicantId
              this.dataForm.orderApplicantOpinion = data.ordermanagement.orderApplicantOpinion
              this.dataForm.orderAcceptor = data.ordermanagement.orderAcceptor
              this.dataForm.orderAcceptorId = data.ordermanagement.orderAcceptorId
              this.dataForm.orderAcceptorOpinion = data.ordermanagement.orderAcceptorOpinion
              this.dataForm.orderConfirmer = data.ordermanagement.orderConfirmer
              this.dataForm.orderConfirmerId = data.ordermanagement.orderConfirmerId
              this.dataForm.orderConfirmerOpinion = data.ordermanagement.orderConfirmerOpinion
              this.dataForm.levelId = data.ordermanagement.levelId
              this.dataForm.orderStatus = data.ordermanagement.orderStatus
              this.dataForm.orderStatusName = data.ordermanagement.orderStatusName
              this.dataForm.exceptionName = data.ordermanagement.exceptionName
              this.dataForm.defectiveDevice = data.ordermanagement.defectiveDevice
              if (this.dataForm.orderStatus === 1 || this.dataForm.orderStatus === 6) { // 已下发待受理
                this.progressNum = 20
              } else if (this.dataForm.orderStatus === 2 || this.dataForm.orderStatus === 7) { // 已受理待上报
                this.progressNum = 40
              } else if (this.dataForm.orderStatus === 3 || this.dataForm.orderStatus === 8) { // 已上报待确认
                this.progressNum = 60
              } else if (this.dataForm.orderStatus === 4) { // 已确认待结算
                this.progressNum = 80
              } else if (this.dataForm.orderStatus === 5) { // 已结算
                this.progressNum = 100
              }
            }
          })
        })
        // 获取流程记录数据
        this.$http({
          url: this.$http.adornUrl('/management/orderrecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'orderNumber': orderNumber
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.recordList = data.page.list
          } else {
            this.recordList = []
          }
        })
      }
    }
  }
</script>
<style>
  .dialog .el-dialog{
    width:  810px !important;
  }
  .data_el_form .el-form-item__label{
    font-weight: bold;
  }
  .span-a{ float:left;}
  .span-b{ float:left;margin-left:15%;}
  .span-c{ float:left;margin-left:25%;}
  .span-d{ float:left;margin-left:25%;}
</style>
