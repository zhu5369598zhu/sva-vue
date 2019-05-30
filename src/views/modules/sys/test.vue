<template>
  <depttree @deptSelectEvent="test"></depttree>
</template>

<script>
  import depttree from '@/components/dept-tree'
  export default {
    components: {
      depttree
    },
    methods: {
      test (val) {
      }
    }
  }
</script>
