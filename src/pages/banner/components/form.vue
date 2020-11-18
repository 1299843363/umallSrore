<template>
  <div class="box">
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px" v-if="user.pid!==0">
          <!-- <div class="myupload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt />
            <input v-if="info.isshow" type="file" class="ipt" @change="changeFile" />
          </div>-->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title==='轮播图添加'">添 加</el-button>
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
  reqCateAdd,
  reqCateDetail,
  reqCateUpdate,
  reqbannerAdd,
  reqbannerDetail,
  reqbannerUpdate
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";

export default {
  props: ["info"],
  data() {
    return {
      //初始化v-model里面需要的字段，跟后端需要的，写的一样
      user: {
        title: "",
        img: null,
        status: 1
      },
      //   初始化图片路径
      imgUrl: ""
    };
  },
  computed: {
    ...mapGetters({
      cateList: "banner/list"
    })
  },
  methods: {
    ...mapActions({
      reqList: "banner/reqList"
    }),
    // 原生文件上传
    // changeFile(ev) {
    //   let file = ev.target.files[0];
    //   //判断文件大小 file.size B ，1M=1024KB 1KB=1024B
    //   if (file.size > 2 * 1014 * 1024) {
    //     errorAlert("文件大小不能超过2M");
    //     return;
    //   }
    //   //判断文件类型
    //   let extname = path.extname(file.name); //'.jpg'
    //   let arr = [".jpg", ".jpeg", ".png", ".gif"];
    //   if (!arr.includes(extname)) {
    //     errorAlert("请上传正确的图片格式！");
    //     return;
    //   }
    //   this.imgUrl = URL.createObjectURL(file);
    //   this.user.img = file;
    // },
    // 框架
    changeFile2(ev) {
      let file = ev.raw;

      //判断文件大小 file.size B ，1M=1024KB 1KB=1024B

      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件大小不能超过2M");
        return;
      }

      //判断文件类型
      let extname = path.extname(file.name);
      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确文件格式");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      this.user.img = file;
    },
    cancel() {
      this.info.isshow = false;
    },
    //.清空数据
    empty() {
      this.user = {
        title: "",
        img: null,
        status: 1
      };
      this.imgUrl = "";
    },
    add() {
      //发送ajax
      reqbannerAdd(this.user).then(res => {
        console.log(this.user);
        if (res.data.code === 200) {
          //弹窗成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //  刷新list
          this.reqList();
        }
      });
    },
    getOne(id) {
      reqbannerDetail(id).then(res => {
        this.user = res.data.list;
        //此刻是没有id的
        this.user.id = id;
        this.imgUrl = this.$ImgUrl + this.user.img;
      });
    },
    update() {
      reqbannerUpdate(this.user).then(res => {
        if (res.data.code === 200) {
          //弹窗成功
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //  刷新list
          this.reqList();
        }
      });
    },
    closed() {
      if (this.info.title === "轮播图添加") {
        this.empty();
      }
    }
  },
  mounted() {}
};
</script>

<style scoped lang='stylus'>
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