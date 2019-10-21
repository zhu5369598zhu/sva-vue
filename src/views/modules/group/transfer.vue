<template>
  <el-dialog
    v-dialog-drag
    :visible.sync="tranvisible"
    v-if="tranvisible"
    :append-to-body='true'
  >
    <div>
      <tree-transfer
          :title="title"
          ref="from-tree"
          :from_data='fromData'
          :to_data='toData'
          :defaultProps="{label:'label'}"
          @addBtn='add' @removeBtn='remove'
          :mode='mode'
          @change="changeMode"
          height='540px'
          filter openAll>
       </tree-transfer>

    </div>
    <span slot="footer" class="dialog-footer">
          <el-button @click="tranvisible = false">取消</el-button>
          <el-button type="primary" @click="datasave()"  :disabled="isHttp">保存</el-button>
        </span>
  </el-dialog>
</template>

<script>
  import treeTransfer from 'el-tree-transfer' // 引入
  export default {
    data () {
      return {
        tranvisible: false,
        isHttp: false,
        dataListSelections: [],
        clicktitle: '',
        title: ['部门人员', '关联人员'],
        mode: 'transfer', // transfer addressList
        fromData: [],
        toData: []
      }
    },
    methods: {
      init (title) {
        this.tranvisible = true
        this.toData = []
        this.dataListSelections = []
        // 当dom发生变化，更新后执行的回调。
        this.$nextTick(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/user/usertree`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.fromData = data.userTreeList
              this.clicktitle = title
            }
          })
        })
      },
      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
      changeMode () {
        if (this.mode === 'transfer') {
          this.mode = 'addressList'
        } else {
          this.mode = 'transfer'
        }
      },
      // 监听穿梭框组件添加
      add (fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log('fromData:', fromData)
        console.log('toData:', toData)
        console.log('obj:', obj)
        console.log('数据' + obj.nodes)
        const resultArray = obj.nodes.filter((item) =>
            item.type === 'user'
        )
        if (this.dataListSelections.length > 0) { // 之前有数据
          this.dataListSelections = this.dataListSelections.concat(resultArray)
          var map = {}
          const dest = []
          for (var i = 0; i < this.dataListSelections.length; i++) {
            var ai = this.dataListSelections[i]
            if (!map[ai.id]) {
              dest.push({
                pid: ai.pid,
                id: ai.id,
                label: ai.label,
                type: ai.type})
            }
            map[ai.id] = ai
          }
          this.dataListSelections = dest
        } else {
          this.dataListSelections = resultArray
        }
        console.log('处理之后的数据' + this.dataListSelections)
        this.$http({
          url: this.$http.adornUrl(`/sys/user/usertree`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.fromData = data.userTreeList
          }
        })
      },
      // 监听穿梭框组件移除
      remove (fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log('fromData:', fromData)
        console.log('toData:', toData)
        console.log('obj:', obj)
        const resultArray = obj.nodes.filter((item) =>
          item.type === 'user'
        )
        if (this.dataListSelections.length > 0) { // 之前有数据
          var map = {}
          const dest = []
          for (var j = 0; j < resultArray.length; j++) {
            var bi = resultArray[j]
            map[bi.id] = bi
          }
          for (var i = 0; i < this.dataListSelections.length; i++) {
            var ai = this.dataListSelections[i]
            if (!map[ai.id]) {
              dest.push({
                pid: ai.pid,
                id: ai.id,
                label: ai.label,
                type: ai.type})
            }
          }
          this.dataListSelections = dest
        } else {
          this.dataListSelections = resultArray
        }
        console.log('处理之后的数据' + this.dataListSelections)
        this.$http({
          url: this.$http.adornUrl(`/sys/user/usertree`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.fromData = data.userTreeList
          }
        })
      },
      // 保存
      datasave () {
        console.log()
        if (this.clicktitle === '接班人') {
          if (this.dataListSelections.length >= 2) {
            this.$alert('接班人只能选择一个')
          } else if (this.dataListSelections.length === 0) {
            this.$alert('请选择用户!')
          } else {
            this.tranvisible = false
            this.$emit('closeMain', this.dataListSelections)
          }
        }
        if (this.clicktitle === '实到人员') {
          if (this.dataListSelections.length > 0) {
            this.tranvisible = false
            this.$emit('closeMain', this.dataListSelections)
          } else {
            this.$alert('请选择用户!')
          }
        }
        if (this.clicktitle === '未到人员') {
          if (this.dataListSelections.length > 0) {
            this.tranvisible = false
            this.$emit('closeMain', this.dataListSelections)
          } else {
            this.$alert('请选择用户!')
          }
        }
        if (this.clicktitle === '顶班人员') {
          if (this.dataListSelections.length > 0) {
            this.tranvisible = false
            this.$emit('closeMain', this.dataListSelections)
          } else {
            this.$alert('请选择用户!')
          }
        }
        if (this.clicktitle === '班组成员') {
          if (this.dataListSelections.length > 0) {
            this.tranvisible = false
            this.$emit('closeMain', this.dataListSelections)
          } else {
            this.$alert('请选择用户!')
          }
        }
      }
    },
    components: { treeTransfer } // 注册
  }
</script>

<style>
  .dialog-footer {
    margin-right: 20px;
  }



</style>
