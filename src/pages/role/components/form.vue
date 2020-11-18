<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="角色名称" label-width="120px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色权限" label-width="120px">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[5, 4]"
            :default-checked-keys="[0]"
            :props="{childred:'childred',label:'title'}"
            ref="tree"
          ></el-tree>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title==='添加角色'">添 加</el-button>
        <el-button type="primary" @click="update()" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// 一进来，先获取菜单列表数据
import {
  reqMenuList,
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdata
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";

export default {
  props: ["info"],
  data() {
    return {
      //初始化v-model里面需要的字段，跟后端需要的，写的一样
      user: {
        rolename: "",
        menus: "",
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
        rolename: "",
        menus: "",
        status: 1
      };
      //把树形结构上的值清空需要调用框架上面的方法
      this.$refs.tree.setCheckedKeys([]);
    },
    //点击添加将树形控件的数据取出，变成字符串数组，赋值给user.menus
    add() {
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      //发送ajax
      reqRoleAdd(this.user).then(res => {
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
    getOne(id) {
      reqRoleDetail(id).then(res => {
        this.user = res.data.list;
        this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));
        //此刻是没有id的
        this.user.id = id;
        console.log(res.data.list);
      });
    },
    update() {
      this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleUpdata(this.user).then(res => {
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