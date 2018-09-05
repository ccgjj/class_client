<template>
    <div class="error">
        <img class="bg_" src="../assets/img/404.jpg">
	<div class="content_">
		网络连接错误，请检查网络。<br/>
		服务器出现问题，建议向供应商寻求帮助。
	</div>
    </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  created() {}
};
</script>
<style scoped>
/* 华康娃娃体W5 */
  @font-face {  
     font-family: 'huaKang';  
     src: url('../assets/font/W5.ttf') format('truetype'); /* EOT file for IE */  
}
.error{
 width: 100%;
 height: 100%;
}
.bg_{
	position: absolute;
	width: 100%;
	height: 100%;
    z-index: -1;
} 
.content_{
	left: 15%;
	top:30%;
	position: absolute;
    width: 70%;
    height: 40%;
    font-size: 50px;
    color: #FF7F00;
    font-family: 'huaKang';
    text-align: center;
    padding-top: 9%;
    line-height: 160%;
}
</style>
