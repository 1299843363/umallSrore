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
      <el-table-column prop="id" label="用户编号" sortable></el-table-column>
      <el-table-column prop="nickname" label="昵称" sortable></el-table-column>

      <el-table-column prop="phone" label="手机号" sortable>
 
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
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
    //获取一条也就是编辑
    edit(uid) {
      this.$emit("edit", uid);
    },

  },
  mounted() {

  }
};
</script>

<style>
</style>