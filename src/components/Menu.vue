<template>
<div class="nav-box">
  <router-link :to="{path:'/greed'}" tag='nav'>贪吃蛇</router-link>
  <router-link :to="{path:'/happy'}" tag='nav'>开心消消乐</router-link>
  <router-link :to="{path:'/tetris'}" tag='nav'>俄罗斯方块</router-link>
</div>
</template>

<script>
export default {

}
</script>

<style lang='scss' scoped>
.nav-box{
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%,-50%);
  width:3rem;
  nav{
    font-size:0.2rem;
    margin-bottom: 0.1rem;
    padding:0.1rem;
    background:rgba(102, 102, 102, 0.589);
    cursor: pointer;
    border-radius:0.1rem;
    text-align: center;
  }
}
</style>
