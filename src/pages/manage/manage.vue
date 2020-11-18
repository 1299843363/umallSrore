<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 列表 -->
    <v-list :list="list" @init="NewInit" @edit="edit"></v-list>
    <!-- //分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePage"
    ></el-pagination>
    <!-- //当前页码发生改变 -->

    <!-- //弹框 -->
    <!-- //添加之后多数据 -->
    <v-form :info="info" @init="NewInit" ref="forms"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vForm from "./components/form";
import vList from "./components/list";
import { reqUserList, reqUserCount } from "../../utils/http";
export default {
  //初始值点击添加改变子组件的isshow值
  data() {
    return {
      // 1.初始值 弹框数据
      info: {
        isshow: false,
        title: "添加管理员"
      },
      // 列表数据初始值
      list: [],
      total: 0,
      size: 2,
      page: 1
    };
  },
  //注册组件
  components: {
    vForm,
    vList
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加管理员"
      };
      this.$refs.forms.getOne(id);
    },
    //请求列表数据拿到赋值给list
    init() {
      reqUserList({ page: this.page, size: this.size }).then(res => {
        //判断不能是null而是空数组
        let list = res.data.list ? res.data.list : [];

        // 如果取到的list是[],并且page>1,page自减，请列表
        if(list.length===0&&this.page>1){
           this.page--;
           this.init()
           return
        }
        this.list = list;
      });
    },
    getCount() {
      reqUserCount().then(res => {
        this.total = res.data.list[0].total;
      });
    },
    edit(uid) {
      this.info = {
        isshow: true,
        title: "编辑角色"
      };
      this.$refs.forms.getOne(uid);
    },
    changePage(page) {
      this.page = page;
      this.init();
    },
    //请列表，请总页
    NewInit() {
      this.init();
      this.getCount();
    }
  },
  mounted() {
    //.一进来发请求
    this.init();
    //请求总数
    this.getCount();
  }
};
</script>
<style scoped>
</style>