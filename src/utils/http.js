import axios from "axios"
import qs from "qs"
import { errorAlert } from './alert'
import Vue from 'vue'
import store from '../store'
import router from '../router'
//开发环境使用 8080
let baseUrl = "/api"
Vue.prototype.$ImgUrl = "http://localhost:3000"

//生产环境使用 打包时候打开
// let baseUrl=""
// Vue.prototype.$ImgUrl=""

// 请求拦截
axios.interceptors.request.use(req => {
    if (req.url != baseUrl + "/api/userlogin") {
        req.headers.authorization = store.state.userInfo.token;
    }
    return req
})
//响应拦截
axios.interceptors.response.use(res => {
    console.log("本次请求地址是：" + res.config.url);
    console.log(res);
    if (res.data.code !== 200) {
        errorAlert(res.data.msg)
    }
    if (res.data.msg === '登录已过期或访问权限受限') {
        store.dispatch('changeUser', {})
        errorAlert('登录已过期,请重修登录')
        router.push('/login')
    }
    return res
})


//菜单管理增删改查=======================
//.添加
export const reqMenuAdd = (form) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data: qs.stringify(form)
    })
}

//列表
export const reqMenuList = () => {
    return axios({
        url: baseUrl + "/api/menulist",
        method: "get",
        params: {
            istree: true
        }
    })
}

//删除
export const reqMenuDel = (id) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}

//获取一条数据
export const reqMenuDetail = (id) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: "get",
        params: {
            id: id
        }
    })
}
//修改
export const reqMenuUpdate = (form) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data: qs.stringify(form)
    })
}
//角色管理增删改查=======================
//添加
export const reqRoleAdd = (user) => {
    return axios({
        url: baseUrl + '/api/roleadd',
        method: 'POST',
        data: qs.stringify(user)
    })
}
//列表
export const reqRoleList = () => {
    return axios({
        url: baseUrl + "/api/rolelist",
        method: "get",
    })
}
//删除按钮
export const reqRoleDel = (id) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}
//获取一条
export const reqRoleDetail = (id) => {
    return axios({
        url: baseUrl + '/api/roleinfo',
        method: 'GET',
        params: {
            id: id
        }
    })
}
//修改mysql数据
export const reqRoleUpdata = (user) => {
    return axios({
        url: baseUrl + '/api/roleedit',
        method: "POST",
        data: qs.stringify(user)
    })
}
//管理员增删改查=======================
// 添加
export const reqUserAdd = (user) => {
    return axios({
        url: baseUrl + '/api/useradd',
        method: "POST",
        data: qs.stringify(user)
    })
}
// 列表p={page:1,size:10}
export const reqUserList = (p) => {
    return axios({
        url: baseUrl + '/api/userlist',
        method: 'GET',
        params: p
    })
}

//删除按钮
export const reqUserDel = (uid) => {
    return axios({
        url: baseUrl + "/api/userdelete",
        method: "post",
        data: qs.stringify({
            uid: uid
        })
    })
}
//详情
export const reqUserDetail = (uid) => {
    return axios({
        url: baseUrl + '/api/userinfo',
        method: 'GET',
        params: {
            uid: uid
        }
    })
}

//修改mysql数据
export const reqUserUpdata = (user) => {
    return axios({
        url: baseUrl + '/api/useredit',
        method: "POST",
        data: qs.stringify(user)
    })
}
// 总数用于计算分页
export const reqUserCount = () => {
    return axios({
        url: baseUrl + "/api/usercount",
        method: "get",
    })
}
//管理员登录接口
export const reqLogin = (user) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data: qs.stringify(user)
    })
}


//商品分类商品分类商品分类商品分类商品分类增删改查=======================

// 添加
export const reqCateAdd = (cate) => {

    let d = new FormData()

    for (let i in cate) {
        d.append(i, cate[i])
    }
    return axios({
        url: baseUrl + "/api/cateadd",
        method: "post",
        data: d
    })
}
// 列表p={istree:true}  p={pid:1}
export const reqCateList = (p) => {
    return axios({
        url: baseUrl + "/api/catelist",
        method: "get",
        params:p
    })
}

//商品分类获取（一条）
export const reqCateDetail = (id) => {
    return axios({
        url: baseUrl + "/api/cateinfo",
        method: "GET",
        params: {
            id: id
        }
    })
}

//商品分类修改
export const reqCateUpdate = (cate) => {
    let d = new FormData()
    for (let i in cate) {
        d.append(i, cate[i])
    }
    return axios({
        url: baseUrl + "/api/cateedit",
        method: "post",
        data: d
    })
}
//商品分类删除
export const reqCateDelete = (id) => {
    return axios({
        url: baseUrl + "/api/catedelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}



//商品规格商品规格商品规格商品规格商品规格商品规品规格商品规格商品规格增删改查=======================
// 商品规格添加** 
export const reqSpecsAdd = (user) => {
    return axios({
        url: baseUrl + "/api/specsadd",
        method: "post",
        data: qs.stringify(user)
    })
}

// 商品规格总数（用于计算分页）
export const reqSpecsCount = () => {
    return axios({
        url: baseUrl + "/api/specscount",
        method: "GET",
    })
}
// 商品规格列表（分页）

export const reqSpecsList = (p) => {
    return axios({
        url: baseUrl + "/api/specslist",
        method: "GET",
        params: p

    })
}
// 商品规格获取（一条）
export const reqSpecsDetai = (id) => {
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "GET",
        params: {
            id: id
        }
    })
}
// 商品规格修改
export const reqSpecsUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data: qs.stringify(user)
    })
}
// 商品规格删除
export const reqSpecsDel = (id) => {
    return axios({
        url: baseUrl + "/api/specsdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}












// 会员管理增删改查===================================
// **1.会员列表** 
export const reqVipList = () => {
    return axios({
        url: baseUrl + "/api/memberlist",
        method: "GET",
    })
}
// 2.会员获取（一条）
export const reqVipInfo = (uid) => {
    return axios({
        url: baseUrl + "/api/memberinfo",
        method: "GET",
        params: {
            uid: uid
        }
    })
}
// 3.会员修改
export const reqVipUpdate = (user) => {

    return axios({
        url: baseUrl + "/api/memberedit",
        method: "post",
        data: qs.stringify(user)
    })
}
// 轮播图增删改查===================================
//商品分类商品分类商品分类商品分类商品分类增删改查=======================

// 轮播图添加
export const reqbannerAdd = (banenr) => {

    let d = new FormData()

    for (let i in banenr) {
        d.append(i, banenr[i])
    }
    return axios({
        url: baseUrl + "/api/banneradd",
        method: "post",
        data: d
    })
}
// 轮播图列表
export const reqbannerList = () => {
    return axios({
        url: baseUrl + "/api/bannerlist",
        method: "get",
    })
}

//轮播图获取（一条）
export const reqbannerDetail = (id) => {
    return axios({
        url: baseUrl + "/api/bannerinfo",
        method: "GET",
        params: {
            id: id
        }
    })
}

//轮播图修改
export const reqbannerUpdate = (banenr) => {
    let d = new FormData()
    for (let i in banenr) {
        d.append(i, banenr[i])
    }
    return axios({
        url: baseUrl + "/api/banneredit",
        method: "post",
        data: d
    })
}
//轮播图删除
export const reqbannerDelete = (id) => {
    return axios({
        url: baseUrl + "/api/bannerdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}
//商品分类商品分类商品分类商品分类商品分类增删改查=======================
// 商品管理增删改查===================================
// 商品添加** 
export const reqgoodsAdd = (user) => {

    let d = new FormData()

    for (let i in user) {
        d.append(i, user[i])
    }
    return axios({
        url: baseUrl + "/api/goodsadd",
        method: "post",
        data: d
    })
}

// 商品总数** 
export const reqgoodsCount = () => {
    return axios({
        url: baseUrl + "/api/goodscount",
        method: "get",
    })
}
// 列表p={istree:true}  p={pid:1}
export const reqgoodsList = (p) => {
    return axios({
        url: baseUrl + "/api/goodslist",
        method: "get",
        params: p
    })
}

//商品分类获取（一条）
export const reqgoodsDetail = (id) => {
    return axios({
        url: baseUrl + "/api/goodsinfo",
        method: "GET",
        params: {
            id: id
        }
    })
}

//商品分类修改
export const reqgoodsUpdate = (user) => {
    let d = new FormData()
    for (let i in user) {
        d.append(i, user[i])
    }
    return axios({
        url: baseUrl + "/api/goodsedit",
        method: "post",
        data: d
    })
}
//商品分类删除
export const reqgoodsDelete = (id) => {
    return axios({
        url: baseUrl + "/api/goodsdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}
// 秒杀增删改查===================================
// 秒杀添加
export const reqseckAdd = (user) => {
    return axios({
        url: baseUrl + "/api/seckadd",
        method: "post",
        data: qs.stringify(user)
    })
}
// 秒杀列表
export const reqseckList = () => {
    return axios({
        url: baseUrl + "/api/secklist",
        method: "get",
    })
}

//秒杀获取（一条）
export const reqseckrDetail = (id) => {
    return axios({
        url: baseUrl + "/api/seckinfo",
        method: "GET",
        params: {
            id: id
        }
    })
}

//秒杀修改
export const reqseckUpdate = (user) => {
    return axios({
        url: baseUrl + "/api/seckedit",
        method: "post",
        data: qs.stringify(user)
    })
}
//秒杀删除
export const reqseckDelete = (id) => {
    return axios({
        url: baseUrl + "/api/seckdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}