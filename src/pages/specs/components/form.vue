<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="规格名称" label-width="120px">
          <el-input v-model="user.specsname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="规格属性" label-width="120px" v-for="(item,index) in attrArr" :key="index">
          <div class="line">
            <el-input v-model="item.value" autocomplete="off"></el-input>
            <el-button type="primary" v-if="index===0" @click="addAttr">新增规格属性</el-button>
            <el-button type="danger" v-else @click="delAttr(index)">删 除</el-button>
          </div>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title==='添加规格'">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import path from "path";
// 一进来，先获取菜单列表数据
import {
  reqSpecsAdd,
  reqSpecsDetai,
  reqSpecsUpdate
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      //初始化v-model里面需要的字段，跟后端需要的，写的一样
      user: {
        specsname: "",
        attrs: "",
        status: 1
      },
      //   初始化
      attrArr: [
        {
          value: ""
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      cateList: "specs/list"
    })
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqCount: "specs/reqCount"
    }),
    cancel() {
      this.info.isshow = false;
    },
    //新增规格属性
    addAttr() {
      this.attrArr.push({
        value: ""
      });
    },
    // 清空
    empty() {
      this.user = {
        specsname: "",
        attrs: "",
        status: 1
      };
      //   初始化
      this.attrArr = [
        {
          value: ""
        }
      ];
    },
    //删除规格属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    add() {
      // this.user.attrs = this.attrArr.map(item => {
      //   return item.value;
      // });
      this.user.attrs = JSON.stringify(this.attrArr.map(item => item.value));
      // 发送ajax;
      reqSpecsAdd(this.user).then(res => {
        if (res.data.code === 200) {
          //弹窗成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //  刷新list
          this.reqList();
          this.reqCount()
        }
      });
    },
    getOne(id) {
      reqSpecsDetai(id).then(res => {
        this.user = res.data.list[0];
        //此刻是没有id的
        // this.user.id = id;
        this.attrArr = JSON.parse(this.user.attrs).map(item => ({
          value: item
        }));
      });
    },
    update() {
      this.user.attrs = JSON.stringify(this.attrArr.map(item => item.value));
      reqSpecsUpdate(this.user).then(res => {
        if (res.data.code === 200) {
          //弹窗成功
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //  刷新list
          this.reqList();
          this.reqCount()
        }
      });
    },
    closed() {
      if (this.info.title === "编辑角色") {
        this.empty();
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
.line {
  display: flex;
}
.line .el-input {
  flex: 1;
}

.line .el-button {
  width: auto;
}
</style>