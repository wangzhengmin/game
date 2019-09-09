<template>
  <div class='tetris'>
    <p>当前分数:{{grade}}</p>
    <p>
      <span class='btn' @click='start()' v-if='isStart'>开始游戏</span>
      <span class='btn' @click='stop()' v-if='!isStart'>暂停游戏</span>
      <span class='btn' @click='startNew()'>重新开始</span>
      <span class='btn' @click='back()'>返回主菜单</span>
    </p>
    <table ref="box">
      <tr v-for="row in rows" :key='row'>
        <td v-for="col in cols" :key='col'></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data(){
    return{
      rows:18,   //高度
      cols:12,  //宽度
      grade:0,
      timer:null,  //存储定时器
      map:[], //存储地图信息
      shape:[], //存储图形信息
      speed:200,  //下滑速度
      isStart:true, //开始暂停按钮的显示
      type:0,
      change:'a' //变化类型
    }
  },
  mounted(){
    //初始化地图信息
    for(let x=0;x<this.rows;x++){
      this.map[x]=new Array();
      for(let y=0;y<this.cols;y++){
        this.map[x][y]=0;
      }
    }
  },
  methods:{
    //返回主菜单
    back(){
      this.$router.push({path:'/'});
    },
    //开始游戏
    start(){
      this.isStart=false;
      this.slide();
    },
    //暂停游戏
    stop(){
      this.isStart=true;
      clearInterval(this.timer);
    },
    //重新开始
    startNew(){
      clearInterval(this.timer);
      this.isStart=true;
      this.shape=[];
      for(let i=0;i<this.map.length;i++){
        this.map[i].fill(0);
      }
      this.draw();
    },
    //创建图形
    createFigure(){
      this.shape=[];
      this.type=0;
      this.change='a';
      this.type=Math.floor((Math.random()*6)+1);
      let [x,y]=[0,5];
        if (this.type==1)
          this.shape=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y},{x:x,y:y+1},{x:x+1,y:y+1},{x:x+2,y:y+1}];
        if (this.type==2)
          this.shape=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y}];
        if (this.type==3)
          this.shape=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y},{x:x,y:y+1}];
        if (this.type==4)
          this.shape=[{x:x,y:y},{x:x+1,y:y},{x:x+1,y:y+1},{x:x+2,y:y+1}];
        if (this.type==5)
          this.shape=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y},{x:x+1,y:y+1}];
        if (this.type==6)
          this.shape=[{x:x,y:y},{x:x,y:y+1},{x:x+1,y:y},{x:x+1,y:y+1}];
    },
    //渲染表格
    draw(){
       for(let x=0;x<this.map.length;x++){
        for(let y=0;y<this.map[x].length;y++){
          if(this.map[x][y]==0)
            this.$refs.box.rows[x].cells[y].style.background='white';
          else
            this.$refs.box.rows[x].cells[y].style.background='red';
        }
      }
    },
    //图形下滑
    slide(){
      if(this.shape.length==0){
        this.createFigure();
      }
      this.move();
      this.timer=setInterval(()=>{
        this.draw();
        for(let i=0;i<this.shape.length;i++){
          this.$refs.box.rows[this.shape[i].x].cells[this.shape[i].y].style.background='red';
        }
        if(!this.judgeDown()){
          for(let i=0;i<this.shape.length;i++){
            this.shape[i].x++;
          }
        }else{
          this.save();
          this.createFigure();
          this.remove();
        }
        if(!this.isEnd()){
          clearInterval(this.timer);
          setTimeout(()=>{
            alert('游戏结束，获得分数为:'+this.grade);
            this.startNew();
          },500)
        }
      },this.speed)
    },
    //到达底部保存坐标
    save(){
      for(let i=0;i<this.shape.length;i++){
        this.map[this.shape[i].x][this.shape[i].y]=1;
      }
    },
    //判断下边界
    judgeDown(){
      for(let i=0;i<this.shape.length;i++){
        if(this.shape[i].x+1>=this.rows||this.map[this.shape[i].x+1][this.shape[i].y]==1){
          return true;
        }
      }
    },
    //判断左边界
    judgeLeft(){
      for(let i=0;i<this.shape.length;i++){
        if(this.shape[i].y-1<0||this.map[this.shape[i].x][this.shape[i].y-1]==1){
          return true;
        }
      }
    },
    //判断右边界
    judgeRight(){
      for(let i=0;i<this.shape.length;i++){
        if(this.shape[i].y+1>=this.cols||this.map[this.shape[i].x][this.shape[i].y+1]==1){
          return true;
        }
      }
    },
    //判断变形坐标是否重复
    isRepeat(obj){
       for(let i=0;i<obj.length;i++){
         if(this.map[obj[i].x][obj[i].y]==1||obj[i].y<0||obj[i].y>=this.cols){
            return true;
         }
      }
    },
    //图形左右移动
    move(){
      document.onkeydown=()=>{
        let key = window.event.keyCode;
        if(this.shape.length>0){
          //左移
          if(key=='37'&&!this.judgeLeft()){
            for(let i=0;i<this.shape.length;i++){
              this.shape[i].y-=1;
            }
          }
          //右移
          if(key=='39'&&!this.judgeRight()){
            for(let i=0;i<this.shape.length;i++){
              this.shape[i].y+=1;
            }
          }
          //加速下滑
          if(key=='40'&&!this.judgeDown()){
            for(let i=0;i<this.shape.length;i++){
              this.shape[i].x++;
            }
          }
          //变形
          if(key=='38'){
            this.rotate();
          }
          if(key=='32'){
            if(this.isStart){
              this.start()
            }else{
              this.stop();
            }
          }
        }
      }
    },
    //消除行
    remove(){
      let len=0;
      for(let i=0;i<this.map.length;i++){
        let bol=this.map[i].every((value)=>{
          return value==1;
        });
        if(bol){
          this.map[i].fill(0);
          let obj=this.map.splice(i,1);
          this.map.unshift(obj[0]);
          len++;
        }
      }
      this.grade+=len*len*10;
    },
    //判断游戏是否结束
    isEnd(){
      return this.map[0].every((value)=>{
        return value<=0;
      })
    },
    //图形变形
    rotate(){
      let obj=[];
      obj=JSON.parse(JSON.stringify(this.shape));
      let x=obj[0].x;
      let y=obj[0].y;
      switch(this.type){
        case 1:
          switch(this.change){
            case 'a':
              obj=[{x:x,y:y},{x:x,y:y-1},{x:x,y:y-2},{x:x+1,y:y},{x:x+1,y:y-1},{x:x+1,y:y-2}]
              this.change='b';
            break;
            case 'b':
              obj=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y},{x:x,y:y+1},{x:x+1,y:y+1},{x:x+2,y:y+1}]
              this.change='a';
            break;
          }
          break;
        case 2:
          switch(this.change){
            case 'a':
              obj=[{x:x,y:y},{x:x,y:y-1},{x:x,y:y-2}]
              this.change='b';
            break;
            case 'b':
              obj=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y}]
              this.change='a';
            break;
          }
          break;
        case 3:
          switch(this.change){
            case 'a':
              obj=[{x:x,y:y},{x:x,y:y-1},{x:x,y:y-2},{x:x+1,y:y}]
              this.change='b';
            break;
            case 'b':
              obj=[{x:x,y:y},{x:x-1,y:y},{x:x-2,y:y},{x:x,y:y-1}]
              this.change='c';
            break;
            case 'c':
              obj=[{x:x,y:y},{x:x,y:y+1},{x:x,y:y+2},{x:x-1,y:y}]
              this.change='d';
            break;
            case 'd':
              obj=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y},{x:x,y:y+1}]
              this.change='a';
            break;
          }
          break;
        case 4:
          switch(this.change){
            case 'a':
              obj=[{x:x,y:y},{x:x,y:y-1},{x:x+1,y:y-1},{x:x+1,y:y-2}]
              this.change='b';
            break;
            case 'b':
              obj=[{x:x,y:y},{x:x-1,y:y},{x:x-1,y:y-1},{x:x-2,y:y-1}]
              this.change='c';
            break;
            case 'c':
              obj=[{x:x,y:y},{x:x,y:y+1},{x:x-1,y:y+1},{x:x-1,y:y+2}]
              this.change='d';
            break;
            case 'd':
              obj=[{x:x,y:y},{x:x+1,y:y},{x:x+1,y:y+1},{x:x+2,y:y+1}]
              this.change='a';
            break;
          }
          break;
        case 5:
          switch(this.change){
            case 'a':
              obj=[{x:x,y:y},{x:x,y:y-1},{x:x,y:y-2},{x:x+1,y:y-1}]
              this.change='b';
            break;
            case 'b':
              obj=[{x:x,y:y},{x:x-1,y:y},{x:x-2,y:y},{x:x-1,y:y-1}]
              this.change='c';
            break;
            case 'c':
              obj=[{x:x,y:y},{x:x,y:y+1},{x:x,y:y+2},{x:x-1,y:y+1}]
              this.change='d';
            break;
            case 'd':
              obj=[{x:x,y:y},{x:x+1,y:y},{x:x+2,y:y},{x:x+1,y:y+1}]
              this.change='a';
            break;
          }
          break;
        case 6:
          break;
      }
      if(!this.isRepeat(obj)){
        this.shape=obj;
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tetris{
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
  table{
    border:1px solid black;
    background:white;
    margin:0.3rem auto;
    td{
      width:0.3rem;
      height:0.3rem;
    }
  }
}
</style>
