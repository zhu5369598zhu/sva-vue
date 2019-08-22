 <template>

   <div class="mod-item"><!-- mod-pda-->
     <div class="show-data-content">
       <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
         <template slot="paneL" >
           <div class="show-left">
             <div class="org_title">
               <span v-if="this.isDrawBack===false" style="vertical-align: middle;">机构列表</span ><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
             </div>
             <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
           </div>
         </template>
         <template slot="paneR">
  <div class="show-data-table">
    <div class="show-data-up" id="data-up">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.orderNumber" placeholder="请输入工单编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.orderName" placeholder="请输入工单主题" clearable></el-input>
      </el-form-item>
      <el-form-item prop="orderStatus" >
        <el-select v-model="dataForm.orderStatus" placeholder="请选择工单状态"  clearable style="width: 140px;">
            <el-option
              v-for="item in orderStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="startTime">
        <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
      </el-form-item>
      <el-form-item  prop="endTime">
        <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:00:00" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
        <el-button v-if="isAuth('management:ordermanagement:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('management:ordermanagement:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="exportExcelHandle()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      v-loading="dataListLoading"
      highlight-current-row
      @selection-change="selectionChangeHandle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="40">
      </el-table-column>
      <el-table-column
        prop="orderId"
        header-align="center"
        align="center"
        width="80"
        label="序号">
        <template slot-scope="scope" >
          <span>{{scope.row.orderId}}</span> <a v-if="scope.row.orderStatus>0&&scope.row.orderStatus!='9'" href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/management.png" @click=orderRecordHandle(scope.row.orderId,scope.row.orderNumber)></a>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        header-align="center"
        align="center"
        label="工单编号"
        width="120"
        >
        <template slot-scope="scope">
          <a href="#" v-if="scope.row.orderStatus == 0 || scope.row.orderStatus === 6 " style="text-decoration: none;"><span  @click=clickRow(scope.row)>{{scope.row.orderNumber}}</span></a>
          <a href="#" style="text-decoration: none;"><span v-if="scope.row.orderStatus >0 && scope.row.orderStatus != 6 " style="color: blue" @click=clickRow(scope.row)>{{scope.row.orderNumber}}</span></a>
        </template>
      </el-table-column>
      <el-table-column
        prop="defectiveNumber"
        header-align="center"
        align="center"
        width="120"
        label="缺陷单编号">
        <template slot-scope="scope">
          <a href="#" v-if="scope.row.orderStatus === 9" style="text-decoration: none;"><span  @click=clickRow(scope.row)>{{scope.row.defectiveNumber}}</span></a>
          <span v-if="scope.row.orderStatus != 9">{{scope.row.defectiveNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderTypeName"
        header-align="center"
        align="center"
        width="100"
        label="工单类型">
      </el-table-column>
      <el-table-column
        prop="orderStatusName"
        header-align="center"
        align="center"
        width="100"
        label="工单状态">
      </el-table-column>
      <el-table-column
        prop="orderName"
        header-align="center"
        align="center"
        width="150"
        label="工单主题">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        width="100"
        label="所属机构">
      </el-table-column>
      <el-table-column
        prop="defectiveName"
        header-align="center"
        align="center"
        width="100"
        label="缺陷操作人">
      </el-table-column>
      <el-table-column
        prop="orderApplicant"
        header-align="center"
        align="center"
        width="100"
        label="工单操作人">
      </el-table-column>
      <el-table-column
        prop="orderAcceptor"
        header-align="center"
        align="center"
        width="100"
        label="工单受理人">
      </el-table-column>
      <el-table-column
        prop="orderConfirmer"
        header-align="center"
        align="center"
        width="100"
        label="工单审核人">
      </el-table-column>
      <el-table-column
        prop="confirmedTime"
        header-align="center"
        align="center"
        width="140"
        label="审核时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" :disabled="scope.row.orderStatus!='0'&&scope.row.orderStatus!='6'" @click="addOrUpdateHandle(scope.row.orderId,scope.row.orderStatus)">修改</el-button>
          <el-button type="text" size="small" :disabled="scope.row.orderStatus!='0'" @click="deleteHandle(scope.row.orderId,scope.row.orderStatus)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

      <!-- 拟制中状态的 dialog -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '工单详情页' : '工单详情页'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogzerovisible">
          <el-form :model="orderDataForm"  ref="dataForm"  label-width="120px">
            <el-row>
            <el-col :span="8">
            <el-form-item label="工单编号" prop="orderNumber">
              {{orderDataForm.orderNumber}}
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="工单类型" prop="orderTypeName">
              {{orderDataForm.orderTypeName}}
            </el-form-item>
            </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="工单状态" prop="orderStatus">
                  {{orderDataForm.orderStatusName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="要求完成时间" prop="requirementTime">
                  {{orderDataForm.requirementTime}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="所属机构" prop="deptName">
              {{orderDataForm.deptName}}
            </el-form-item>
            <el-row>
              <el-col span="8">
                <el-form-item label="工单操作人" prop="orderApplicant">
                  {{orderDataForm.orderApplicant}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工单受理人" prop="orderAcceptor">
                  {{orderDataForm.orderAcceptor}}
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="工单主题" prop="orderName">
              {{orderDataForm.orderName}}
            </el-form-item>
            <el-form-item label="工单内容" prop="orderContent">
              {{orderDataForm.orderContent}}
            </el-form-item>
            <el-form-item label="工单操作人意见" prop="orderApplicantOpinion">
              {{orderDataForm.orderApplicantOpinion}}
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
        <el-button @click="dialogzerovisible = false">取消</el-button>
        <el-button type="primary" @click="orderConfirm()" :disabled="orderDataForm.orderApplicantId != loginuserId || isHttp">确认并派单</el-button>
      </span>
      </el-dialog>
      <!-- 已派单待受理 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '工单详情页' : '工单详情页'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogonevisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-form-item label="工单编号" prop="orderNumber">
            <el-input v-model="orderDataForm.orderNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单状态" prop="orderStatusName">
            <el-input v-model="orderDataForm.orderStatusName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷单编号" prop="defectiveNumber">
            <el-input v-model="orderDataForm.defectiveNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="要求完成时间" prop="requirementTime">
            <el-input v-model="orderDataForm.requirementTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="deptName">
            <el-input v-model="orderDataForm.deptName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单类型" prop="orderTypeName">
            <el-input v-model="orderDataForm.orderTypeName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷单等级" prop="exceptionName">
            <el-input v-model="orderDataForm.exceptionName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷操作人" prop="defectiveName">
            <el-input v-model="orderDataForm.defectiveName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单操作人" prop="orderApplicant">
            <el-input v-model="orderDataForm.orderApplicant" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单受理人" prop="orderAcceptor">
            <el-input v-model="orderDataForm.orderAcceptor" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单主题" prop="orderName">
            <el-input v-model="orderDataForm.orderName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单内容" prop="orderContent">
            <el-input
              autosize
              type="textarea"
              v-model="orderDataForm.orderContent" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单操作人意见" prop="orderApplicantOpinion" label-width="100px">
            <el-input
              type="textarea"
              autosize
              v-model="orderDataForm.orderApplicantOpinion" readonly></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogonevisible = false">取消</el-button>
      </span>
      </el-dialog>
      <!-- 已受理待上报 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '工单详情页' : '工单详情页'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogtwovisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-form-item label="工单编号" prop="orderNumber">
            <el-input v-model="orderDataForm.orderNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单状态" prop="orderStatusName">
            <el-input v-model="orderDataForm.orderStatusName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷单编号" prop="defectiveNumber">
            <el-input v-model="orderDataForm.defectiveNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="下发时间" prop="createTime">
            <el-input v-model="orderDataForm.createTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="要求完成时间" prop="requirementTime">
            <el-input v-model="orderDataForm.requirementTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="deptName">
            <el-input v-model="orderDataForm.deptName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单类型" prop="orderTypeName">
            <el-input v-model="orderDataForm.orderTypeName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷等级" prop="exceptionName">
            <el-input v-model="orderDataForm.exceptionName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷操作人" prop="defectiveName">
            <el-input v-model="orderDataForm.defectiveName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单操作人" prop="orderApplicant">
            <el-input v-model="orderDataForm.orderApplicant" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单受理人" prop="orderAcceptor">
            <el-input v-model="orderDataForm.orderAcceptor" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单主题" prop="orderName">
            <el-input v-model="orderDataForm.orderName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单内容" prop="orderContent">
            <el-input
              autosize
              type="textarea"
              v-model="orderDataForm.orderContent" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单操作人意见" prop="orderApplicantOpinion" label-width="100px">
            <el-input
              type="textarea"
              autosize
              v-model="orderDataForm.orderApplicantOpinion" readonly></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogtwovisible = false">取消</el-button>
        <!--<el-button type="primary"  :disabled="isHttp">确定</el-button>-->
      </span>
      </el-dialog>
      <!-- 已上报待审核 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '工单详情页' : '工单详情页'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogthreevisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-form-item label="工单编号" prop="orderNumber" >
            <el-input v-model="orderDataForm.orderNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单状态" prop="orderStatusName">
            <el-input v-model="orderDataForm.orderStatusName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷单编号" prop="defectiveNumber">
            <el-input v-model="orderDataForm.defectiveNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="下发时间" prop="createTime">
            <el-input v-model="orderDataForm.createTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="要求完成时间" prop="requirementTime">
            <el-input v-model="orderDataForm.requirementTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="deptId">
            <el-input v-model="orderDataForm.deptName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单类型" prop="orderTypeName">
            <el-input v-model="orderDataForm.orderTypeName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷等级" prop="exceptionName">
            <el-input v-model="orderDataForm.exceptionName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷操作人" prop="defectiveName">
            <el-input v-model="orderDataForm.defectiveName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单操作人" prop="orderApplicant">
            <el-input v-model="orderDataForm.orderApplicant" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单受理人" prop="orderAcceptor">
            <el-input v-model="orderDataForm.orderAcceptor" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单主题" prop="orderName">
            <el-input v-model="orderDataForm.orderName" readonly></el-input>
          </el-form-item>
          <el-form-item label="处理结果" prop="processingResult">
            <el-input
              autosize
              type="textarea"
              v-model="orderDataForm.processingResult" readonly></el-input>
          </el-form-item>
          <el-form-item label="备件" prop="orderDevice" >
            <el-input v-model="orderDataForm.orderDevice"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogthreevisible = false">取消</el-button>
        <!--<el-button type="primary"  :disabled="isHttp">确定</el-button>-->
      </span>
      </el-dialog>
      <!-- 已上报待结单 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '工单详情页' : '工单详情页'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogfourvisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-form-item label="工单编号" prop="orderNumber">
            <el-input v-model="orderDataForm.orderNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单状态" prop="orderStatusName">
            <el-input v-model="orderDataForm.orderStatusName"></el-input>
            <!--<el-select v-model="orderDataForm.orderStatus" >
              <el-option
                v-for="item in orderStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="缺陷单编号" prop="defectiveNumber">
            <el-input v-model="orderDataForm.defectiveNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="下发时间" prop="createTime">
            <el-input v-model="orderDataForm.createTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="要求完成时间" prop="requirementTime">
            <el-input v-model="orderDataForm.requirementTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="deptName">
            <el-input v-model="orderDataForm.deptName"></el-input>
            <!--<el-select v-model="orderDataForm.deptId" placeholder="所属机构" clearable
            >
              <el-option
                v-for="item in deptList"
                :key="item.deptId"
                :label="item.name"
                :value="item.deptId"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="工单类型" prop="orderTypeName">
            <el-input v-model="orderDataForm.orderTypeName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷等级" prop="exceptionName">
            <el-input v-model="orderDataForm.exceptionName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷操作人" prop="defectiveName">
            <el-input v-model="orderDataForm.defectiveName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单受理人" prop="orderAcceptor">
            <el-input v-model="orderDataForm.orderAcceptor" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单主题" prop="orderName">
            <el-input v-model="orderDataForm.orderName" readonly></el-input>
          </el-form-item>
          <el-form-item label="处理结果" prop="processingResult">
            <el-input
              autosize
              type="textarea"
              v-model="orderDataForm.processingResult" readonly></el-input>
          </el-form-item>
          <el-form-item label="备件" prop="orderDevice" >
            <el-input v-model="orderDataForm.orderDevice" readonly></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogfourvisible = false">取消</el-button>
        <el-button type="primary"  :disabled="isHttp">确定</el-button>
      </span>
      </el-dialog>
      <!-- 已结单 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '工单详情页' : '工单详情页'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogfivevisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-form-item label="工单编号" prop="orderNumber">
            <el-input v-model="orderDataForm.orderNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷单编号" prop="defectiveNumber">
            <el-input v-model="orderDataForm.defectiveNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="下发时间" prop="createTime">
            <el-input v-model="orderDataForm.createTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单状态" prop="orderStatusName">
            <el-input v-model="orderDataForm.orderStatusName" readonly></el-input>
          </el-form-item>
          <el-form-item label="实际完成时间" prop="actualTime">
            <el-input v-model="orderDataForm.actualTime" readonly></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="deptName">
            <el-input v-model="orderDataForm.deptName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷操作人" prop="defectiveName">
            <el-input v-model="orderDataForm.defectiveName" readonly></el-input>
          </el-form-item>
          <el-form-item label="缺陷等级" prop="exceptionName">
            <el-input v-model="orderDataForm.exceptionName" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单操作人" prop="orderApplicant">
            <el-input v-model="orderDataForm.orderApplicant" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单受理人" prop="orderAcceptor">
            <el-input v-model="orderDataForm.orderAcceptor" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单审核人" prop="orderConfirmer">
            <el-input v-model="orderDataForm.orderConfirmer" readonly></el-input>
          </el-form-item>
          <el-form-item label="工单主题" prop="orderName">
            <el-input v-model="orderDataForm.orderName" readonly></el-input>
          </el-form-item>
          <el-form-item label="处理结果" prop="processingResult">
            <el-input
              autosize
              type="textarea"
              v-model="orderDataForm.processingResult" readonly></el-input>
          </el-form-item>
          <el-form-item label="备件" prop="orderDevice" >
            <el-input v-model="orderDataForm.orderDevice" readonly></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogfivevisible = false">取消</el-button>
      </span>
      </el-dialog>
      <!--已派单被拒绝 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '工单详情页' : '工单详情页'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogsixvisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单编号" prop="orderNumber">
                {{orderDataForm.orderNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单类型" prop="orderTypeName" label-width="120px">
                {{orderDataForm.orderTypeName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单状态" prop="orderStatus">
                {{orderDataForm.orderStatusName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="要求完成时间" prop="requirementTime" label-width="120px">
                {{orderDataForm.requirementTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="所属机构" prop="deptName">
            {{orderDataForm.deptName}}
          </el-form-item>
          <el-row>
            <el-col span="8">
              <el-form-item label="工单操作人" prop="orderApplicant">
                {{orderDataForm.orderApplicant}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单受理人" prop="orderAcceptor" label-width="120px">
                {{orderDataForm.orderAcceptor}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="工单主题" prop="orderName">
            {{orderDataForm.orderName}}
          </el-form-item>
          <el-form-item label="工单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="工单操作人意见" prop="orderApplicantOpinion" label-width="100px">
            {{orderDataForm.orderApplicantOpinion}}
          </el-form-item>
          <el-form-item label="受理人意见" prop="orderAcceptorOpinion">
            {{orderDataForm.orderAcceptorOpinion}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogsixvisible = false">取消</el-button>
        <el-button type="primary" @click="orderConfirm()" :disabled="orderDataForm.orderApplicantId != loginuserId || isHttp">确认并派单</el-button>
      </span>
      </el-dialog>
      <!--已转单待下发 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '已转单待下发' : '已转单待下发'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogNinevisible">
        <el-form :model="orderDataForm" :rules="dataRule" ref="dataForm"  label-width="110px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单编号" prop="orderNumber">
                {{orderDataForm.orderNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷单编号" prop="defectiveNumber">
                {{orderDataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
            <el-form-item label="工单状态" prop="orderStatus">
              {{orderDataForm.orderStatusName}}
            </el-form-item>
            </el-col>
            <el-col :span="8">
            <el-form-item label="工单类型" prop="orderTypeName">
              {{orderDataForm.orderTypeName}}
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属机构" prop="deptId">
                {{orderDataForm.deptName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷等级" prop="exceptionName">
                {{orderDataForm.exceptionName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷操作人" prop="defectiveName">
                {{orderDataForm.defectiveName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单操作人" prop="orderApplicant">
                {{orderDataForm.orderApplicant}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="工单主题" prop="orderName">
            {{orderDataForm.orderName}}
          </el-form-item>
          <el-form-item label="工单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="工单操作人意见" prop="orderApplicantOpinion">
            <el-input
              type="textarea"
              autosize
              v-model="orderDataForm.orderApplicantOpinion" ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="要求完成时间" prop="requirementTime">
                {{orderDataForm.requirementTime}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="受理人" prop="orderAcceptor">
                <el-input v-model="orderDataForm.orderAcceptor" :disabled="true">
                  <span slot="suffix">
                    <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle()" ></a>
                  </span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-dialog title="可选择用户列表" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :append-to-body='true'>
            <div style="display: flex;justify-content: space-around;align-items: center;">
              <div style="width:400px;height: 500px;">
                <el-form :model="deptFrom">
                  <el-row>
                    <el-col :span="13">
                      <el-form-item>
                        <el-input v-model="deptFrom.name" placeholder="机构名称" clearable style="width: 180px"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item>
                        <el-button @click="getDeptDataList()">查询</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table
                  :data="dataDeptList"
                  highlight-current-row
                  @current-change="depteHandle"
                  style="width: 100%;height: 440px;overflow: scroll;">
                  <el-table-column
                    type="index"
                    header-align="center"
                    align="center"
                    width="80">
                  </el-table-column>
                  <table-tree-column
                    style="width: auto"
                    prop="name"
                    header-align="center"
                    treeKey="deptId"
                    label="机构名称"
                  >
                  </table-tree-column>
                </el-table>
              </div>
              <div style="width:400px;height: 500px;">
                <el-form :inline="true" :model="datauserForm" >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item>
                        <el-input v-model="datauserForm.userName" placeholder="用户名称" clearable style="width: 100px;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item>
                        <el-button @click="usersearch">查询</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item>
                        <el-button  type="danger" @click="handle()" :disabled="dataListSelections.length <= 0">确定</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item>
                        <el-button @click="dialogFormVisible = false">取消</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table
                  :data="UserdataList"
                  style="width: 100%;height: 440px;overflow: scroll;"
                  @selection-change="selectionChangeHandle"
                >
                  <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    header-align="center"
                    align="center"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    header-align="center"
                    align="center"
                    label="用户名">
                  </el-table-column>
                  <el-table-column
                    prop="deptName"
                    header-align="center"
                    align="center"
                    label="机构名称">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-dialog>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogNinevisible = false">取消</el-button>
          <el-button type="warning" @click="disagreeLower()"  :disabled="orderDataForm.orderApplicantId != loginuserId">拒绝派单</el-button>
          <el-button type="primary" @click="orderConfirm()"  :disabled="orderDataForm.orderApplicantId != loginuserId || isHttp">确认并派单</el-button>
        </span>
      </el-dialog>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <order-record v-if="orderRecordVisible" ref="OrderRecord" ></order-record>
  </div>

  </div>

 </template>
 </split-pane>
 </div>
 </div>

</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate } from '@/utils'
  import { formatDate } from '@/utils'
  import AddOrUpdate from './ordermanagement-add-or-update'
  import depttree from '@/components/dept-tree'
  import splitPane from '@/components/split-pane'
  import OrderRecord from './orderrecord'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          deptId: '',
          orderNumber: '',
          orderName: '',
          orderStatus: '',
          startTime: null,
          endTime: null
        },
        value1: true,
        deptList: [],
        orderDataForm: {
          value1: true,
          orderId: 0,
          orderNumber: '',
          defectiveId: '',
          defectiveNumber: '',
          orderName: '',
          deptId: '',
          deptName: '',
          exceptionId: '',
          exceptionName: '',
          defectiveName: '',
          defectiveTheme: '',
          orderContent: '',
          orderApplicant: '',
          orderApplicantId: '',
          orderApplicantOpinion: '',
          orderAcceptor: '',
          orderAcceptorId: '',
          orderAcceptorOpinion: '',
          orderConfirmer: '',
          orderConfirmerId: '',
          orderConfirmerOpinion: '',
          createTime: '',
          requirementTime: '',
          confirmedTime: '',
          actualTime: '',
          delayTime: '',
          processingResult: '',
          orderStatus: '',
          orderStatusName: '',
          orderType: '',
          orderTypeName: '',
          levelId: '',
          orderDevice: '',
          disPlay: 0
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 12,
        orderStatusList: [
            {id: 0, name: '拟制中'},
            {id: 9, name: '已转单待确认'},
            {id: 1, name: '已下发待受理'},
            {id: 2, name: '已受理待上报'},
            {id: 3, name: '已上报待审核'},
            {id: 4, name: '已确认待完结'},
            {id: 5, name: '已完结'},
            {id: 6, name: '已下发被拒绝'},
            {id: 7, name: '已上报被拒绝'},
            {id: 8, name: '已确认被拒绝'}
        ],
        datauserForm: {
          userName: ''
        },
        deptFrom: {
          name: ''
        },
        limit: 2000,
        UserdataList: [],
        dataDeptList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        orderRecordVisible: false,
        startDatePicker: this.beginDate(),
        startDateDelayPicker: this.beginDelayDate(),
        isHttp: false,
        dialogzerovisible: false,
        dialogonevisible: false,
        dialogtwovisible: false,
        dialogthreevisible: false,
        dialogfourvisible: false,
        dialogfivevisible: false,
        dialogsixvisible: false,
        dialogNinevisible: false,
        dialogFormVisible: false,
        dataRule: {
          orderApplicantOpinion: [
            { required: true, message: '工单操作人意见不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      OrderRecord,
      AddOrUpdate,
      depttree,
      splitPane,
      TableTreeColumn
    },
    activated () {
      this.getDataList()
      this.getDeptList()
      this.getDeptDataList()
    },
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      loginuserId: {
        get () { return this.$store.state.user.id }
      },
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    methods: {
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      beginDelayDate () {
        return {
          disabledDate (time) {
            return time.getTime() < Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      // 查询
      search () {
        this.getDataList()
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
      clickRow (row) {
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagement/info/' + row.orderId),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderDataForm.orderId = data.ordermanagement.orderId
            this.orderDataForm.orderNumber = data.ordermanagement.orderNumber
            this.orderDataForm.defectiveId = data.ordermanagement.defectiveId
            this.orderDataForm.defectiveNumber = data.ordermanagement.defectiveNumber
            this.orderDataForm.defectiveTheme = data.ordermanagement.defectiveTheme
            this.orderDataForm.orderName = data.ordermanagement.orderName
            this.orderDataForm.deptId = data.ordermanagement.deptId
            this.orderDataForm.deptName = data.ordermanagement.deptName
            this.orderDataForm.exceptionId = data.ordermanagement.exceptionId
            this.orderDataForm.exceptionName = data.ordermanagement.exceptionName
            this.orderDataForm.defectiveName = data.ordermanagement.defectiveName
            this.orderDataForm.orderContent = data.ordermanagement.orderContent
            this.orderDataForm.orderApplicant = data.ordermanagement.orderApplicant
            this.orderDataForm.orderApplicantId = data.ordermanagement.orderApplicantId
            this.orderDataForm.orderApplicantOpinion = data.ordermanagement.orderApplicantOpinion
            this.orderDataForm.createTime = data.ordermanagement.createTime
            this.orderDataForm.orderAcceptor = data.ordermanagement.orderAcceptor
            this.orderDataForm.orderAcceptorId = data.ordermanagement.orderAcceptorId
            this.orderDataForm.orderAcceptorOpinion = data.ordermanagement.orderAcceptorOpinion
            this.orderDataForm.orderConfirmer = data.ordermanagement.orderConfirmer
            this.orderDataForm.orderConfirmerId = data.ordermanagement.orderConfirmerId
            this.orderDataForm.orderConfirmerOpinion = data.ordermanagement.orderConfirmerOpinion
            this.orderDataForm.requirementTime = data.ordermanagement.requirementTime
            this.orderDataForm.confirmedTime = data.ordermanagement.confirmedTime
            this.orderDataForm.actualTime = data.ordermanagement.actualTime
            this.orderDataForm.delayTime = data.ordermanagement.delayTime
            this.orderDataForm.processingResult = data.ordermanagement.processingResult
            this.orderDataForm.orderStatus = data.ordermanagement.orderStatus
            this.orderDataForm.orderStatusName = data.ordermanagement.orderStatusName
            this.orderDataForm.orderType = data.ordermanagement.orderType
            this.orderDataForm.orderTypeName = data.ordermanagement.orderTypeName
            this.orderDataForm.levelId = data.ordermanagement.levelId
            this.orderDataForm.orderDevice = data.ordermanagement.orderDevice
            this.orderDataForm.disPlay = data.ordermanagement.disPlay
          }
          if (this.orderDataForm.orderStatus === 0) {
            this.dialogzerovisible = true
          } else if (this.orderDataForm.orderStatus === 1) {
            this.dialogonevisible = true
          } else if (this.orderDataForm.orderStatus === 2 || this.orderDataForm.orderStatus === 7) {
            this.dialogtwovisible = true
          } else if (this.orderDataForm.orderStatus === 3) {
            this.dialogthreevisible = true
          } else if (this.orderDataForm.orderStatus === 4) {
            this.dialogfourvisible = true
          } else if (this.orderDataForm.orderStatus === 5) {
            this.dialogfivevisible = true
          } else if (this.orderDataForm.orderStatus === 6) {
            this.dialogsixvisible = true
          } else if (this.orderDataForm.orderStatus === 9) {
            this.dialogNinevisible = true
          } else if (this.orderDataForm.orderStatus === 14) {
            this.dialogtwovisible = true
          }
        })
      },
      clickTitle () {
        this.dialogFormVisible = true
      },
      getDeptList () {
        if (this.deptList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/tree'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList = data
          })
        }
      },
      // 查询部门
      getDeptDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({'name': this.deptFrom.name})
        }).then(({data}) => {
          this.dataDeptList = treeDataTranslate(data, 'deptId')
        })
      },
      // 选中部门 查询用户
      depteHandle (val) {
        this.currentRow = val
        var deptId = this.currentRow.deptId
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.limit,
            'username': '',
            'deptId': deptId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
        })
      },
      usersearch () {
        this.getUserDataList()
      },
      // 查询用户
      getUserDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.limit,
            'username': this.datauserForm.userName,
            'deptId': ''
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
        })
      },
      handle (username, userid) {
        var userNames = username ? [username] : this.dataListSelections.map(item => {
          return item.username
        })
        var userId = userid ? [userid] : this.dataListSelections.map(item => {
          return item.userId
        })
        if (this.dataListSelections.length >= 2) {
          this.$alert('受理人只能选择一个')
        } else {
          this.orderDataForm.orderAcceptor = userNames.toString()
          this.orderDataForm.orderAcceptorId = userId.toString()
          this.dialogFormVisible = false
        }
      },
      // 拟制中变 成 待受理 (确认并派单)
      orderConfirm () {
        if (this.orderDataForm.orderAcceptorId !== 0) {
          // 提交
          if (this.orderDataForm.orderApplicantId === this.loginuserId) {
            this.orderDataForm.orderStatus = 1
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/management/ordermanagement/orderupdate`),
              method: 'post',
              data: this.$http.adornData({
                'orderId': this.orderDataForm.orderId,
                'orderNumber': this.orderDataForm.orderNumber,
                'defectiveId': this.orderDataForm.defectiveId,
                'defectiveNumber': this.orderDataForm.defectiveNumber,
                'defectiveTheme': this.orderDataForm.defectiveTheme,
                'orderName': this.orderDataForm.orderName,
                'deptId': this.orderDataForm.deptId,
                'exceptionId': this.orderDataForm.exceptionId,
                'defectiveName': this.orderDataForm.defectiveName,
                'orderContent': this.orderDataForm.orderContent,
                'orderApplicant': this.orderDataForm.orderApplicant,
                'orderApplicantId': this.orderDataForm.orderApplicantId,
                'orderApplicantOpinion': this.orderDataForm.orderApplicantOpinion,
                'orderAcceptor': this.orderDataForm.orderAcceptor,
                'orderAcceptorId': this.orderDataForm.orderAcceptorId,
                'orderAcceptorOpinion': this.orderDataForm.orderAcceptorOpinion,
                'orderConfirmer': this.orderDataForm.orderConfirmer,
                'orderConfirmerId': this.orderDataForm.orderConfirmerId,
                'orderConfirmerOpinion': this.orderDataForm.orderConfirmerOpinion,
                'createTime': this.orderDataForm.createTime,
                'requirementTime': this.orderDataForm.requirementTime,
                'confirmedTime': this.orderDataForm.confirmedTime,
                'actualTime': this.orderDataForm.actualTime,
                'delayTime': this.orderDataForm.delayTime,
                'processingResult': this.orderDataForm.processingResult,
                'orderStatus': this.orderDataForm.orderStatus,
                'orderType': this.orderDataForm.orderType,
                'levelId': this.orderDataForm.levelId,
                'orderDevice': this.orderDataForm.orderDevice,
                'disPlay': this.orderDataForm.disPlay
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.dialogzerovisible = false
                    this.dialogsixvisible = false
                    this.dialogNinevisible = false
                    this.$emit('refreshDataList')
                    this.isHttp = false
                    this.search()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            this.$alert('必须由填报用户来确认派单')
          }
        } else {
          this.$alert('受理人不能为空')
        }
      },
      // 获取数据列表
      getDataList () {
        let startTime = new Date(this.dataForm.startTime)
        startTime = formatDate(startTime, 'yyyy-MM-dd hh:mm:ss')
        let endTime = new Date(this.dataForm.endTime)
        endTime = formatDate(endTime, 'yyyy-MM-dd hh:mm:ss')
        if (startTime === 'NaN-aN-aN aN:aN:aN' || startTime === '1970-01-01 08:00:00' || null) {
          startTime = ''
        }
        if (endTime === 'NaN-aN-aN aN:aN:aN' || endTime === '1970-01-01 08:00:00' || null) {
          endTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagement/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'deptId': this.dataForm.deptId,
            'orderNumber': this.dataForm.orderNumber,
            'orderName': this.dataForm.orderName,
            'orderStatus': this.dataForm.orderStatus,
            'startTime': startTime,
            'endTime': endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      exportToExcel (list) {
        this.dataListLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['序号', '工单编号', '缺陷单编号', '工单类型', '工单状态', '工单主题', '所属机构', '缺陷操作人', '工单操作人', '工单受理人', '工单审核人', '审核时间']
          const filterVal = ['orderId', 'orderNumber', 'defectiveNumber', 'orderTypeName', 'orderStatusName', 'orderName', 'deptName', 'defectiveName', 'orderApplicant', 'orderAcceptor', 'orderConfirmer', 'confirmedTime']
          const data = this.formatJson(filterVal, list)
          let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
          export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.dataListLoading = false
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 获取数据列表  导出
      exportExcelHandle () {
        this.dataListLoading = true
        let startTime = new Date(this.dataForm.startTime)
        startTime = formatDate(startTime, 'yyyy-MM-dd hh:mm:ss')
        let endTime = new Date(this.dataForm.endTime)
        endTime = formatDate(endTime, 'yyyy-MM-dd hh:mm:ss')
        if (startTime === 'NaN-aN-aN aN:aN:aN' || startTime === '1970-01-01 08:00:00' || null) {
          startTime = ''
        }
        if (endTime === 'NaN-aN-aN aN:aN:aN' || endTime === '1970-01-01 08:00:00' || null) {
          endTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagement/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'deptId': this.dataForm.deptId,
            'orderNumber': this.dataForm.orderNumber,
            'orderName': this.dataForm.orderName,
            'orderStatus': this.dataForm.orderStatus,
            'startTime': startTime,
            'endTime': endTime
          })
        }).then(({data}) => {
          console.log('1')
          if (data && data.code === 0) {
            this.exportToExcel(data.page.list)
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
      },
      handleStartTimeChange (val) {
        this.dataForm.startTime = val
      },
      handleEndTimeChange (val) {
        this.dataForm.endTime = val
      },
      handleDeptSelect (val) {
        this.dataForm.deptId = val
        this.getDataList()
      },
      rowStyle ({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id, orderStatus) {
        if (id > 0 && orderStatus !== 0 && orderStatus !== 6) {
          this.$alert('只能修改 拟制中和已下发被拒绝的工单')
        } else {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id)
          })
        }
      },
      // 删除
      deleteHandle (id, orderStatus) {
        console.log(id)
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.orderId
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/management/ordermanagement/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 拒绝下发派单
      disagreeLower () {
        if (this.orderDataForm.orderApplicantOpinion !== null) {
          this.$http({
            url: this.$http.adornUrl(`/management/ordermanagement/disagreelower`),
            method: 'post',
            data: this.$http.adornData({
              'orderId': this.orderDataForm.orderId,
              'orderNumber': this.orderDataForm.orderNumber,
              'defectiveId': this.orderDataForm.defectiveId,
              'defectiveNumber': this.orderDataForm.defectiveNumber,
              'orderName': this.orderDataForm.orderName,
              'deptId': this.orderDataForm.deptId,
              'defectiveName': this.orderDataForm.defectiveName,
              'orderContent': this.orderDataForm.orderContent,
              'orderApplicant': this.orderDataForm.orderApplicant,
              'orderApplicantId': this.orderDataForm.orderApplicantId,
              'orderApplicantOpinion': this.orderDataForm.orderApplicantOpinion,
              'orderAcceptor': this.orderDataForm.orderAcceptor,
              'orderAcceptorId': this.orderDataForm.orderAcceptorId,
              'orderAcceptorOpinion': this.orderDataForm.orderAcceptorOpinion,
              'orderConfirmer': this.orderDataForm.orderConfirmer,
              'orderConfirmerId': this.orderDataForm.orderConfirmerId,
              'orderConfirmerOpinion': this.orderDataForm.orderConfirmerOpinion,
              'requirementTime': this.orderDataForm.requirementTime,
              'confirmedTime': this.orderDataForm.confirmedTime,
              'actualTime': this.orderDataForm.actualTime,
              'delayTime': this.orderDataForm.delayTime,
              'orderStatus': this.orderDataForm.orderStatus,
              'orderType': this.orderDataForm.orderType,
              'levelId': this.orderDataForm.levelId,
              'orderDevice': this.orderDataForm.orderDevice
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dialogzerovisible = false
                  this.dialogNinevisible = false
                  this.$emit('refreshDataList')
                }
              })
              this.search()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$alert('请填写工单操作人意见')
        }
      },
      // 操作记录
      orderRecordHandle (id, orderNumber) {
        this.orderRecordVisible = true
        this.$nextTick(() => {
          this.$refs.OrderRecord.init(id, orderNumber)
        })
      }
    },
    watch: {
      'documentClientHeight': function (val) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20
      })
    }
  }
</script>

