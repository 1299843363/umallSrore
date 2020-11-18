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
      <el-table-column prop="id" label="商品编号" sortable></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" sortable></el-table-column>
      <el-table-column prop="price" label="商品价格" sortable></el-table-column>
      <el-table-column prop="market_price" label="市场价格" sortable></el-table-column>
      <el-table-column prop="img" label="图片" sortable>
        <!-- 图片展示字段 -->
        <template slot-scope="scope">
          <img :src="$ImgUrl+scope.row.img" class="img" />
        </template>
        <!-- catename -->
      </el-table-column>
      <el-table-column label="是否新品" sortable>
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isnew===1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否热买" sortable>
        <template slot-scope="scope">
             <el-button type="primary" v-if="scope.row.ishot===1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
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
import { reqgoodsDelete } from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  computed: {
    ...mapGetters({
      list: "goods/list",
      total: "goods/total",
      size: "goods/size"
    })
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqCount: "goods/reqCount",
      changePage: "goods/changePage"
    }),

    //获取一条也就是编辑
    edit(id) {
      this.$emit("edit", id);
    },
    del(id) {
      reqgoodsDelete(id).then(res => {
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