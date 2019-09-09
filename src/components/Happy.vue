<template>
  <div class="happy">
    <p>
      <span>第{{num}}关</span>
      <span>目标分数:{{goal}}</span>
      <span>当前分数:{{grade}}</span>
    </p>
    <p>
      <span class='btn' @click='init(1)'>重新开始</span>
      <span class='btn' @click='back()'>返回主菜单</span>
    </p>
    <table ref="box">
      <tr v-for="row in rows" :key='row'>
        <td v-for="col in cols" @click="remove(col-1,row-1)" :key='col'></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data(){
    return{
      num:1,    //关数
      grade:0,  //分数
      rows:10,
      cols:10,
      map:[],
      middle:[],
      action:[],
      colors:['red','green','yellow','purple','white']
    }
  },
  computed:{
    goal(){
      return 500+(this.num-1)*1000
    },
    mapReverse(){
      let reverseSave=[];
      if(this.map.length>0){
        for(let x=0;x<this.cols;x++){
          reverseSave[x]=new Array();
          for(let y=0;y<this.rows;y++){
            reverseSave[x][y]=this.map[y][x];
          }
        }
      }
      return reverseSave;
    }
  },
  mounted(){
    this.init();
  },
  methods:{
    //初始化游戏
    init(bol){
      if(bol){
        this.grade=0;
        this.num=1;
      }
      for(let x=0;x<this.cols;x++){
        this.map[x]=new Array();
        for(let y=0;y<this.rows;y++){
          let color=Math.floor((Math.random()*4)+0);
          this.map[x][y]=color;
          this.$refs.box.rows[y].cells[x].style.background=this.colors[color];
        }
      }
      this.initMiddle();
    },
    //初始化判断数组
    initMiddle(){
      for(let x=0;x<this.rows;x++){
        this.middle[x]=new Array();
        for(let y=0;y<this.cols;y++){
          this.middle[x][y]=0;
        }
      }
    },
    remove(x,y){
      let clicked=this.map[x][y];
      if(clicked!=4){
        this.getIndex(x,y);
        if(this.action.length>=2){
          //更该坐标信息
          for(let i=0;i<this.action.length;i++){
            this.map[this.action[i].x][this.action[i].y]=4;
          }
          //使上方方块下移和合并
          for(let x=0;x<this.cols;x++){
            for(let y=0;y<this.rows;y++){
              if(this.map[x][y]==4){
                this.map[x].splice(y,1);
                this.map[x].unshift(4);
              }
            }
          }
          for(let x=0;x<this.cols;x++){
            let bol=this.map[x].every((value)=>{
              return value>=4;
            });
            if(bol){
              let m=this.map.splice(x,1)[0];
              this.map.splice(0,0,m);
            }
          }
          //重新渲染表格
          for(let x=0;x<this.cols;x++){
            for(let y=0;y<this.rows;y++){
              this.$refs.box.rows[y].cells[x].style.background=this.colors[this.map[x][y]];
            }
          }
          this.grade+=this.action.length*25;
        }
        this.initMiddle();
        this.action=[];
      }
      //判断游戏是否结束
      let b=this.isEnd();
      if(b){
        if(this.grade>this.goal){
          this.num+=1;
          setTimeout(()=>{
            this.init();
          },500)
        }else{
          setTimeout(()=>{
            alert('游戏结束，分数为:'+this.grade);
            this.num=1;
            this.grade=0;
            this.init();
          },500)
        }
      }
    },
    //获取可以消除的坐标
    getIndex(x,y){
      this.action.push({x:x,y:y});
      let clicked=this.map[x][y];
      if(clicked!=4){
        this.middle[x][y]=1;
        //判断左边颜色
        if((y-1)>=0&&clicked==this.map[x][y-1]&&this.middle[x][y-1]==0)
          this.getIndex(x,y-1);
        if((y+1)<=(this.cols-1)&&clicked==this.map[x][y+1]&&this.middle[x][y+1]==0)
          this.getIndex(x,y+1);
        if((x-1)>=0&&clicked==this.map[x-1][y]&&this.middle[x-1][y]==0)
          this.getIndex(x-1,y);
        if((x+1)<=(this.rows-1)&&clicked==this.map[x+1][y]&&this.middle[x+1][y]==0)
          this.getIndex(x+1,y);
      }
    },
    //判断游戏是否结束
    isEnd(){
      let bol=true;
      for(let i=0;i<this.map.length;i++){
        for(let j=0;j<this.map[i].length-1;j++){
          if(this.map[i][j]==this.map[i][j+1]&&this.map[i][j]!='4'){
            return  bol=false;
          }
        }
      }
      for(let i=0;i<this.mapReverse.length;i++){
        for(let j=0;j<this.mapReverse[i].length-1;j++){
          if(this.mapReverse[i][j]==this.mapReverse[i][j+1]&&this.mapReverse[i][j]!='4'){
            return bol=false;
          }
        }
      }

      return  bol;
    },
    //返回主菜单
    back(){
      this.$router.push({path:'/'});
    }
  }
}
</script>

<style lang='scss' scoped>
.happy{
  margin-top:0.2rem;
  line-height: 0.2rem;
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
      width:0.5rem;
      height:0.5rem;
    }
  }
}
</style>
