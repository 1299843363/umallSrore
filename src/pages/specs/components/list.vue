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
      <el-table-column prop="id" label="规格编号" sortable></el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable></el-table-column>
      <el-table-column label="规格属性" sortable>
        <template slot-scope="scope">
          <el-tag type="warning" v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { reqSpecsDel } from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  computed: {
    ...mapGetters({
      list: "specs/list",
      total: "specs/total",
      size: "specs/size"
    })
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqCount: "specs/reqCount",
      changePage: "specs/changePage"
    }),

    //获取一条也就是编辑
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      console.log(id)
      reqSpecsDel(id).then(res => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.reqList();
          this.reqCount();
        }
      });
    }
  },
  mounted() {
    this.reqList();
    this.reqCount();
  }
};
</script>

<style>
.img {
  width: 80px;
  height: 80px;
}
</style>