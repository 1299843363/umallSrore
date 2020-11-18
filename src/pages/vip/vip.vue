<template>
  <div>
    <!-- 列表 -->
    <v-list :list="list" @init="init" @edit="edit"></v-list>

    <!-- //弹框 -->
    <v-form :info="info" @init="init" ref="forms"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vForm from "./components/form";
import vList from "./components/list";
import { reqRoleList,reqVipList } from "../../utils/http";
export default {
  //初始值点击添加改变子组件的isshow值
  data() {
    return {
      // 1.初始值 弹框数据
      info: {
        isshow: false,
        title: "会员修改"
      },
      // 列表数据初始值
      list: []
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
        title: "会员修改"
      };
      this.$refs.forms.getOne(id);
    },
    //请求列表数据拿到赋值给list
    init() {
      reqVipList().then(res => {

        this.list = res.data.list;
      });
    },
    edit(uid) {
      this.info = {
        isshow: true,
        title: "会员修改"
      };
      this.$refs.forms.getOne(uid);
    }
  },
  mounted() {
    //.一进来发请求
    this.init();
  }
};
</script>
<style scoped>
</style>