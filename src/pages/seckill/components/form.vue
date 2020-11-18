<template>
  <div class="box">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed" @opened="opened">
      <el-form :model="user" :rules="rules">
        {{user}}}
        <el-form-item label="活动名称" label-width="120px" prop="title">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="活动期限" label-width="120px" prop="goodsname">
          <template>
            <div class="block">
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
              ></el-date-picker>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px" prop="first_cateid">
          <el-select v-model="user.first_cateid" placeholder="请选择一级分类" @change="changeFirst">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类" label-width="120px" prop="second_cateid">
          <el-select v-model="user.second_cateid" placeholder="请选择二级分类" @change="changeSecond">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品" label-width="120px">
          <el-select v-model="user.goodsid" placeholder="请选择商品" @change="changeSpace">
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title==='活动添加'">添 加</el-button>
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
  reqseckAdd,
  reqgoodsDetail,
  reqgoodsUpdate,
  reqCateList,
  reqspecsList
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      //初始化v-model里面需要的字段，跟后端需要的，写的一样
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },
      value1: "",
      value2: "",
      //二级分类list
      secondCateList: [],
      // 商品
      goodsName: [],
      // 图片临时1地址
      imgUrl: "",
      //规格属性list
      attrsList: [],
      // 验证
      check() {
        return new Promise((resolve, reject) => {
          //验证
          if (this.user.first_cateid === "") {
            errorAlert("一级分类不能为空");
            return;
          }
          if (this.user.second_cateid === "") {
            errorAlert("二级分类不能为空");
            return;
          }
          if (this.user.title === "") {
            errorAlert("活动名称为空");
            return;
          }
          resolve();
        });
      },
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "change" }
        ],
        first_cateid: [
          { required: true, message: "请输入一级分类", trigger: "change" }
        ],
        second_cateid: [
          { required: true, message: "请输入二级分类", trigger: "change" }
        ],

        specsid: [
          { required: true, message: "请输入商品规格", trigger: "change" }
        ],
        specsattr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个规格属性",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      // 从状态层取出规格列表
      specsList: "specs/list",
      goodsList: "goods/list"
    })
  },
  methods: {
    ...mapActions({
      reqcateList: "cate/reqList",
      reqspecsList: "specs/reqList",
      reqGoodsList: "goods/reqList",
      reqGoodsCount: "goods/reqCount"
    }),
    cancel() {
      this.info.isshow = false;
    },
    // 清空
    empty() {
      this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      };
      //二级分类list
      this.secondCateList = [];
      //规格属性list
      this.goods = [];
    },

    add() {
      console.log(this.user);
      this.check().then(() => {
        // // 发送ajax;
        reqseckAdd(this.user).then(res => {
          if (res.data.code === 200) {
            //弹窗成功
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //  刷新list
            this.empty();
            // this.reqGoodsList();
            // this.reqGoodsCount();
          }
        });
      });
    },
    getOne(id) {
      reqgoodsDetail(id).then(res => {
        this.user = res.data.list;
        //此刻是没有id的
        this.user.id = id;
        // 请二级list
        this.getSecondList();
        // 图片
        this.imgUrl = this.$ImgUrl + this.user.img;
        //属性
        this.user.specsattr = JSON.parse(this.user.specsattr);
        //计算规格属性的list
        this.getspecsAttrs();
        //给编辑器赋值
        if (this.editor) {
          this.editor.txt.html(this.user.description);
        }
      });
    },
    update() {
      this.check().then(() => {
        //  修改之前，也要将编辑器内容赋值给user.description
        this.editor.txt.html(this.user.description);
        // 拷贝而且不影响data里面的值
        let d = { ...this.user };
        //因为后端需要的是字符串数组
        d.specsattr = JSON.stringify(d.specsattr);
        reqgoodsUpdate(d).then(res => {
          if (res.data.code === 200) {
            //弹窗成功
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //  刷新list
            this.reqGoodsList();
            this.reqGoodsCount();
          }
        });
      });
    },
    closed() {
      if (this.info.title === "活动名称") {
        this.empty();
      }
    },
    //弹框打开，并且动画结束了
    opened() {},
    //获取二级分类列表
    getSecondList() {
      reqCateList({ pid: this.user.first_cateid }).then(res => {
        this.secondCateList = res.data.list;
      });
    },
    // 二级分类商品详情
    changeSecond() {
      reqspecsList().then(res => {});
    },

    //当一级分类id发生改变时获取二级分类
    changeFirst() {
      // 二级分类id重置
      this.user.second_cateid = "";
      this.getSecondList();
    },
    changeSpace() {
      this.user.specsattr = [];
      this.getspecsAttrs();
    },
    getspecsAttrs() {
      // 取出 specsList ,哪条数据的id和this.user.specsid是一样的
      let obj = this.specsList.find(item => item.id === this.user.specsid);
      //就将这条数据的attrs取出来，赋值给attrsList
      this.attrsList = obj.attrs;
    }
  },

  mounted() {
    // 一进来请求一级分类数据
    this.reqcateList();
    // 一进来就请求规格list,参数true，是为了取到所有的规格
    this.reqspecsList(true);
  }
};
</script>

<style scoped lang='stylus'>
.line {
  display: flex;
}

.line .el-input {
  flex: 1;
}

.line .el-button {
  width: auto;
}

.box >>> .el-upload {
  border: 1px dashed #ff29f2;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}

.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}

.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.myupload .img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>