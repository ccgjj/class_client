<template>
    <div class="login">
        <div class="center">
            <div class="header">
                <h3>英和教育</h3>
                <h6>YINGHEJIAOYU</h6>
            </div>
            <div class="form">
                <el-form :model="user_info" status-icon ref="login_form" :rules="rules" class="demo-ruleForm">
                    <el-form-item prop="username">
                        <el-input placeholder="账户" type="text" v-model="user_info.username" auto-complete="off">
                        <i slot="prefix" class="iconfont">&#xe624;</i>
                        </el-input>
                    </el-form-item>
                     <el-form-item class="password" prop="password">
                        <el-input placeholder="密码" type="password" v-model="user_info.password" auto-complete="off">
                        <i slot="prefix" class="iconfont">&#xe6d2;</i>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="radio_">
                      <el-radio v-model="user_info.type" :label='0'>横屏</el-radio>
                      <el-radio v-model="user_info.type" :label='1'>竖屏</el-radio>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" @click="login_" :loading="load">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      user_info: {
        username: "",
        password: "",
        type:0
      },
      load: false,
      rules: {
        username: [{ required: true, message: "请输入账户", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    login_() {
      //表单验证
      alert(1)
      var ths = this;
      ths.$refs.login_form.validate(valid => {
        if (valid) {
          ths.load = true;
          ths
            .$axios({
              method: "POST",
              url: `${ths.$global.api_}/v2/device/login`,
              data:{
               deviceId:`${ths.user_info.username}`,
               deviceSecret:`${ths.user_info.password}`
              }
            })
            .then(function(res) {
              console.log(res,'登录信息')
               var resData = res.data.result;
              if (resData&&(resData.deviceType==2||resData.deviceType==3)) {//1-教棒，2-班牌，3-校牌，4-售货机
                localStorage.setItem('user_info',JSON.stringify(ths.user_info));
                window.location.href = `${ths.$global.web_}/?username=${ths.user_info.username}&password=${ths.user_info.password}&type=${ths.user_info.type}`;
              } else {
                ths.load = false;
                ths.$message.error("账户或密码错误");
              }
            }).catch(function(error){
               ths.load = false;
               ths.$message.error("服务器错误");
            })
        } else {
          console.log("验证不通过");
        }
      });
    }
  },
  created() {
    var ths = this;
  }
};
</script>
<style scoped>
h3,
h6 {
  margin: 0;
}
.login {
  background: #a4ecc7;
  width: 1920px;
  height: 1080px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
  width: 400px;
  height: 400px;
  padding: 5px;
}
.header {
  text-align: center;
  font-weight: bold;
  font-size: 30px;
  margin-bottom: 20px;
}
.form {
  background: #fff;
  border-radius: 5px;
  width: 400px;
  height: 270px;
  padding: 50px 30px;
  box-sizing: border-box;
  box-shadow: 2px 2px 3px #aaa;
}
.el-form-item.password{
  margin-bottom: 10px !important;
}
.el-form-item.radio_{
  margin-bottom: 0px !important;
}
.el-button {
  width: 100%;
  font-size: 18px;
  font-weight: bold;
}
</style>
