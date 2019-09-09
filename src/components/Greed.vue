<template>
<div class="greed">
    <p>当前分数:{{grade}}</p>
    <p>
      <span class='btn' @click='start()' v-if='isStart'>开始游戏</span>
      <span class='btn' @click='stop()' v-if='!isStart'>暂停游戏</span>
      <span class='btn' @click='back()'>返回主菜单</span>
    </p>
    <p>
      <span class='btn' @click='startNew()'>重新开始</span>
      <span class='btn' @click='fast()'>加速</span>
      <span class='btn' @click='slow()'>减速</span>
    </p>
    <p>当前速度:{{showSpeed}}</p>
  <canvas width=500 height=500 ref='canvas'></canvas>
</div>
</template>

<script>
export default {
  data(){
    return{
      grade:0, //分数
      size:20,
      x:25,
      y:25,
      speed:350,     //移动速度
      direction:'top', //默认移动方向
      head:{x:10,y:10}, //默认蛇头
      isStart:true, //控制开始/停止按钮的显示
      body:[   //默认蛇身
        {x:11,y:10},
        {x:12,y:10},
        {x:12,y:11},
        {x:12,y:12}
      ],
      isUpdate:true,  //控制是否更新食物
      food:{}, //存储食物坐标
      timer:null,
      isUp:true
    }
  },
  computed:{
    showSpeed(){
      return 1000-this.speed;
    }
  },
  mounted(){
    document.onkeydown=()=>{
      let key = window.event.keyCode;
      if(this.isUp){
        if(key=='38'&&this.direction!='top'&&this.direction!='down')
          this.direction='top'
        else if(key=='40'&&this.direction!='top'&&this.direction!='down')
          this.direction='down'
        else if(key=='37'&&this.direction!='right'&&this.direction!='left')
          this.direction='left'
        else if(key=='39'&&this.direction!='right'&&this.direction!='left')
          this.direction='right'
        this.isUp=false;
      }
      if(key=='32'){
        this.isStart=true;
        clearInterval(this.timer);
      }
    }
    this.init();
  },
  methods:{
    //返回主菜单
    back(){
      this.$router.push({path:'/'});
    },
    //更改移动速度
    fast(){
      if(this.speed>=100&&this.isStart){
        this.speed-=50;
      }
    },
    slow(){
       if(this.speed<=350&&this.isStart){
        this.speed+=50;
      }
    },
    init(){
      let ctx=this.$refs.canvas.getContext('2d');
      ctx.clearRect(0, 0, 500, 500);
      ctx.strokeRect(0,0,500,500);
    },
    //绘制canvas
    draw(){
      this.init();
      let ctx=this.$refs.canvas.getContext('2d');
      ctx.fillStyle='yellow';
      ctx.fillRect(this.head.x*20,this.head.y*20,20,20);
      ctx.fillStyle='red';
      ctx.fillRect(this.food.x*20,this.food.y*20,20,20);
      for(let i=0;i<this.body.length;i++){
        ctx.fillStyle='black';
        ctx.fillRect(this.body[i].x*20,this.body[i].y*20,20,20);
      }
    },
    //随机出现食物
    showFood(){
      if(this.isUpdate){
        let x=Math.floor(Math.random()*22+1);
        let y=Math.floor(Math.random()*22+1);
        this.food={x:x,y:y};
        this.isUpdate=false;
      }
    },
    //游戏开始
    start(){
      this.isStart=!this.isStart;
      this.timer=setInterval(()=>{
        this.showFood();
        this.remove();
        this.add();
        this.move();
        this.isUp=true;
        if(this.isCrash()){
          clearInterval(this.timer);
          console.log(this.head);
          console.log(this.body);
          console.log(this.direction);
          alert('游戏结束,获得分数为:'+this.grade);
          this.startNew();
        }else{
          if(this.head.x==this.food.x&&this.head.y==this.food.y){
            this.add();
            this.move();
            this.food={};
            this.grade+=1;
            this.isUpdate=true;
          }
          for(let i=0;i<this.body.length;i++){
            if(this.body[i].x==this.food.x&&this.body[i].y==this.food.y){
              this.grade+=1;
              this.isUpdate=true;
            }
          }
          this.draw();
        }
      },this.speed)
    },
    //暂停游戏
    stop(){
      this.isStart= !this.isStart;
      clearInterval(this.timer);
    },
    startNew(){
      clearInterval(this.timer);
      this.init();
      this.isStart=true;
      this.grade=0;
      this.head={x:10,y:10},
      this.food={},
      this.body=[{x:11,y:10},{x:12,y:10},{x:12,y:11},{x:12,y:12}];
      this.isUpdate=true;
    },
    //贪吃蛇移动
    move(){
      switch(this.direction){
        case 'top':
          this.head.y-=1;
          break;
        case 'down':
          this.head.y+=1;
          break;
        case 'left':
          this.head.x-=1;
          break;
        case 'right':
          this.head.x+=1;
          break;
      }
    },
    //判断是否撞墙
    isCrash(){
      let x=this.head.x;
      let y=this.head.y;
      if(x<0||x>this.x-1||y<0||y>this.y-1){
        return true;
      }
      for(let i=0;i<this.body.length;i++){
        if(this.body[i].x==x&&this.body[i].y==y){
          return true;
        }
      }
    },
    //删除尾节点
    remove(){
      this.body.splice(this.body.length-1,1);
    },
    add(){
      this.body.unshift(JSON.parse(JSON.stringify(this.head)));
    }
  }
}
</script>

<style lang='scss' scoped>
.greed{
  display: flex;
  display: -webkit-flex;
  flex-flow:column wrap;
  >p{
    text-align:center;
    margin-top:0.1rem;
    >span{
      margin-right:0.5rem
    }
    .btn{
      display: inline-block;
      border-radius:0.05rem;
      background: red;
      color:white;
      padding:0.05rem;
      cursor: pointer;
    }
  }
  canvas{
    margin:0.1rem auto;
  }
}
</style>
