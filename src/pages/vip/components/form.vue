<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="昵称" label-width="120px">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// 一进来，先获取菜单列表数据
import { reqVipInfo, reqVipUpdate, reqMenuList } from "../../../utils/http";
import { successAlert } from "../../../utils/alert";

export default {
  props: ["info"],
  data() {
    return {
      //初始化v-model里面需要的字段，跟后端需要的，写的一样
      user: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      },
      //   初始化树形控件
      menuList: []
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    cancel() {
      this.info.isshow = false;
    },
    //.清空数据
    empty() {
      this.user = {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1
      };
    },
    getOne(uid) {
      reqVipInfo(uid).then(res => {
        this.user = res.data.list;
        //处理密码
        this.user.password=""
      });
    },
    update() {
      reqVipUpdate(this.user).then(res => {
        if (res.data.code === 200) {
          //弹窗成功
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //通知父组件刷新
          this.$emit("init");
        }
      });
    },
    closed() {
      if (this.info.title === "编辑角色") {
        this.empty();
      }
    }
  },
  mounted() {
    // 一进来，先获取菜单列表数据
    reqMenuList().then(res => {
      if (res.data.code === 200) {
        this.menuList = res.data.list;
      }
    });
  }
};
</script>

<style>
</style>