<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="所属角色" label-width="120px">
          <el-select placeholder="请选择角色" v-model="user.roleid">
            <!-- //循环遍历reqRoleList里面的值 -->
            <el-option
              :value="item.id"
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="user.username" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="add" v-if="info.title==='添加管理员'">添 加</el-button>
        <el-button type="primary" @click="update()" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// 一进来，先获取菜单列表数据
import {
  reqRoleList,
  reqUserAdd,
  reqUserDetail,
  reqUserUpdata
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";

export default {
  props: ["info"],
  data() {
    return {
      //初始化v-model里面需要的字段，跟后端需要的，写的一样
      user: {
        roleid: "",
        username: "",
        password: "",
        status: 1
      },
      // 角色列表
      roleList: []
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
        roleid: "",
        username: "",
        password: "",
        status: 1
      };
    },
    //点击添加将树形控件的数据取出，变成字符串数组，赋值给user.menus
    add() {
      //发送ajax
      reqUserAdd(this.user).then(res => {
        if (res.data.code === 200) {
          //弹窗成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //通知父组件刷新
          this.$emit("init");
        }
      });
    },
    getOne(uid) {
      reqUserDetail(uid).then(res => {
        this.user = res.data.list;
        //处理密码
        this.user.password = "";
      });
    },
    update() {
      reqUserUpdata(this.user).then(res => {
        console.log(this.user);
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
      if (this.info.title === "添加管理员") {
        this.empty();
      }
    }
  },
  mounted() {
    // 一进来，先获取菜单列表数据
    reqRoleList().then(res => {
      if (res.data.code === 200) {
        this.roleList = res.data.list;
      }
    });
  }
};
</script>

<style>
</style>