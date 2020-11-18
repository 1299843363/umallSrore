<template>
  <div>
    <!-- 21.展示list -->
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="角色编号" sortable></el-table-column>
      <el-table-column prop="rolename" label="用户编号" sortable></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="del(scope.row.id)">删除</del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reqRoleDel } from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  props: ["list"],
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    del(id) {
      reqRoleDel(id).then(res => {
        if (res.data.code === 200) {
          successAlert(res.data.msg);
          this.$emit('init')
        }
      });
    },
    //获取一条也就是编辑
    edit(id){
     this.$emit('edit',id)
    }
  },
  mounted() {}
};
</script>

<style>
</style>