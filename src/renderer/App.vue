<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const { remote } = require("electron");
export default {
  data() {
    return {};
  },
  beforeCreate() {
     var ths = this;
    //添加网络监听事件
    const alertOnlineStatus = () => {
      if (!navigator.onLine) {
        ths.$router.push("/error");
      } else {
        setTimeout(() => {
               ths.$electron.ipcRenderer.send("network");
        }, 3000);
      }
    };
    window.addEventListener("online", alertOnlineStatus);
    window.addEventListener("offline", alertOnlineStatus);
    if(!navigator.onLine){
         ths.$router.push("/error");
         return
    }
  },
  created() {
    var ths = this,user_info=null;
    ths.$electron.ipcRenderer.send("finish");//已跳转到本地页面
    ths.$electron.ipcRenderer.on('clear',(event,mes)=>{
        mes==1 ? localStorage.clear() : '';
      //判断本地有没有用户信息
    user_info = JSON.parse(localStorage.getItem("user_info"));
    if (user_info) {
      ths
        .$axios({
          method: "POST",
          url: `${ths.$global.api_}/v2/device/login`,
          data:{
               deviceId:`${user_info.username}`,
               deviceSecret:`${user_info.password}`
              }
        })
        .then(function(res) {
          console.log(res, "登录信息");
          var resData = res.data.result;
          if (resData&&(resData.deviceType==2||resData.deviceType==3)) {//1-教棒，2-班牌，3-校牌，4-售货机
            window.location.href = `${ths.$global.web_}/?username=${user_info.username}&password=${user_info.password}&type=${user_info.type}`;
          } else {
            ths.$router.push("/login");
          }
        });
    } else {
      ths.$router.push("/login");
    }
    })
  }
};
</script>
<style>
@font-face {
  font-family: "iconfont";
  src: url("./assets/font/iconfont.eot"); /* IE9*/
  src: url("./assets/font/iconfont.eot#iefix") format("embedded-opentype"),
    /* IE6-IE8 */ url("./assets/font/iconfont.woff") format("woff"),
    /* chrome, firefox */ url("./assets/font/iconfont.ttf") format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
      url("./assets/font/iconfont.svg#iconfont") format("svg"); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0;
  height: 100vh;
  width: 100vw;
}
#app {
  width: 100%;
  height: 100%;
}
/* element样式重写 */
</style>
