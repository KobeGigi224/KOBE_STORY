// pages/careerdetail/careerdetail.js
import * as echarts from '../../ec-canvas/echarts';
const db = wx.cloud.database()
const careerCollection = db.collection('Kobe_Career')

function setOption(chart, point) {
  var option = {
    title:{
      text:'球队得分',
      left:'center',
      top:'center',
      textStyle:{
        fontSize:25,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
          formatter: '{b}{c}分({d}%)'
    },
    color:['#9A60B4', '#FFFFE0'],
    series: [
    {
        type: 'pie',
        radius:['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        data: point
      }
    ]
  };
  chart.setOption(option);
}

function setOption1(chart, radar,score) {
  var option = {
    radar: [
      {
        indicator: [
          { text: '篮板', max: 16 },
          { text: '助攻', max: 17 },
          { text: '抢断', max: 7 },
          { text: '盖帽', max: 5 },
          { text: '失误', max: 11 },
          { text: '犯规', max: 6 },
        ],
        
      },
    ],
    series: [
      {
        
        type: 'radar',
        areaStyle: {},
        radius: 120,
        data: [
          {
            value: radar,
            name: 'GAME STATS',
            itemStyle: {
              normal: {
                  color: '#BA55D3',
                  lineStyle: {
                      color: '#BA55D3',
                  },
              },
          },
          label: {
                    normal: {
                        show: true,
                        position:'inside'
                    },
                }
          }
        ]
      }
    ]
  };
  chart.setOption(option);
}

function setOption2(chart, min) {
  var option = {
    tooltip: {
      trigger: 'item',
          formatter: function (params) {
              if (params.dataIndex == 0) {
                return '上场时间:'+params.value+'分钟'
              }
              else
              {
                return '未上场'
              }
            }
    },
    title:{
      text:'上场时间',
      left:'center',
      top:'center',
      textStyle:{
        fontSize:25,
        fontWeight: 'bold'
      }
    },
    color:['#9A60B4', '#FFFFE0'],
    series: [
    {
        name: 'Access From',
        type: 'pie',
        radius:['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        data: min
      }
    ]
  };
  chart.setOption(option);
}

function setOption3(chart, point) {
  var option = {
    title:{
      text:'投篮命中率',
      left:'center',
      top:'center',
      textStyle:{
        fontSize:25,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
          formatter: '{b}{c}球({d}%)'
    },
    color:['#9A60B4', '#FFFFE0'],
    series: [
    {
        type: 'pie',
        radius:['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        data: point
      }
    ]
  };
  chart.setOption(option);
}

function setOption4(chart, point) {
  var option = {
    title:{
      text:'罚球命中率',
      left:'center',
      top:'center',
      textStyle:{
        fontSize:25,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
          formatter: '{b}{c}球({d}%)'
    },
    color:['#9A60B4', '#FFFFE0'],
    series: [
    {
        type: 'pie',
        radius:['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        data: point
      }
    ]
  };
  chart.setOption(option);
}

function setOption5(chart, point) {
  var option = {
    title:{
      text:'三分命中率',
      left:'center',
      top:'center',
      textStyle:{
        fontSize:25,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
          formatter: '{b}{c}球({d}%)'
    },
    color:['#9A60B4', '#FFFFE0'],
    series: [
    {
        type: 'pie',
        radius:['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        data: point
      }
    ]
  };
  chart.setOption(option);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    radar: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Component = this.selectComponent('#mychart');
    this.getOption(options);
    this.oneComponent = this.selectComponent('#mychart1');
    this.getOneOption(options);
    this.twoComponent = this.selectComponent('#mychart2');
    this.getTwoOption(options);
    this.threeComponent = this.selectComponent('#mychart3');
    this.getThreeOption(options);
    this.fourComponent = this.selectComponent('#mychart4');
    this.getFourOption(options);
    this.fiveComponent = this.selectComponent('#mychart5');
    this.getFiveOption(options);

     var cid = options.id;
    console.log(cid);
    careerCollection.where({
      _id: cid
    }).get().then(res => {
      this.setData({
        career: res.data
      })
    })
  },
  
  getOption: function (options) {
    var point = [];
    var cid = options.id;
    careerCollection.where({
      _id: cid
    }).get().then(res => {
      console.log(res.data)
      var obj=new Object()
      obj.value=parseInt(res.data[0].pts)
      obj.name='科比个人拿下'
      point[0]=obj
      var obj1=new Object()
      var temp =res.data[0].scoreresult.split('-');
      console.log(temp)
      obj1.value=parseInt(temp[1])-parseInt(res.data[0].pts)
      obj1.name='球队其他人拿下'
      point[1]=obj1
      console.log(point)
      
      this.setData({
        point: point
      })

      this.init(point)
    })
  },

  getOneOption: function (options) {
    var radar = [];
    var cid = options.id;
    careerCollection.where({
      _id: cid
    }).get().then(res => {
      console.log(res.data)
      radar.push(res.data[0].reb)
      radar.push(res.data[0].ast)
      radar.push(res.data[0].stl)
      radar.push(res.data[0].bck)
      radar.push(res.data[0].to)
      radar.push(res.data[0].pf)
      console.log(radar)
      
      this.setData({
        radar: radar
      })

      this.init_one(radar)
    })
  },

  getTwoOption: function (options) {
    var min = [];
    var cid = options.id;
    careerCollection.where({
      _id: cid
    }).get().then(res => {
      console.log(res.data)
      var obj=new Object()
      obj.value=res.data[0].min
      min[0]=obj
      var obj1=new Object()
      obj1.value=60-parseInt(res.data[0].min)
      min[1]=obj1
      console.log(min)
      
      this.setData({
        min: min
      })

      this.init_two(min)
    })
  },

  getThreeOption: function (options) {
    var point = [];
    var cid = options.id;
    careerCollection.where({
      _id: cid
    }).get().then(res => {
      console.log(res.data)
      var obj=new Object()
      obj.value=parseInt(res.data[0].fgm)
      obj.name='投进'
      point[0]=obj
      var obj1=new Object()
      obj1.value=parseInt(res.data[0].fga)-parseInt(res.data[0].fgm)
      obj1.name='投失'
      point[1]=obj1
      console.log(point)
      
      this.setData({
        point: point
      })

      this.init_three(point)
    })
  },

  getFourOption: function (options) {
    var point = [];
    var cid = options.id;
    careerCollection.where({
      _id: cid
    }).get().then(res => {
      console.log(res.data)
      var obj=new Object()
      obj.value=parseInt(res.data[0].ftm)
      obj.name='罚进'
      point[0]=obj
      var obj1=new Object()
      obj1.value=parseInt(res.data[0].fta)-parseInt(res.data[0].ftm)
      obj1.name='罚失'
      point[1]=obj1
      console.log(point)
      
      this.setData({
        point: point
      })

      this.init_four(point)
    })
  },

  getFiveOption: function (options) {
    var point = [];
    var cid = options.id;
    careerCollection.where({
      _id: cid
    }).get().then(res => {
      console.log(res.data)
      var obj=new Object()
      obj.value=parseInt(res.data[0].tpm)
      obj.name='三分投进'
      point[0]=obj
      var obj1=new Object()
      obj1.value=parseInt(res.data[0].tpa)-parseInt(res.data[0].tpm)
      obj1.name='三分投失'
      point[1]=obj1
      console.log(point)
      
      this.setData({
        point: point
      })

      this.init_five(point)
    })
  },
  init: function (point) {           //初始化第一个图表
    this.Component.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, point)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

  init_one: function (radar) {           //初始化第一个图表
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption1(chart, radar)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

  init_two: function (min) {           //初始化第一个图表
    this.twoComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption2(chart, min)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

  init_three: function (point) {           //初始化第一个图表
    this.threeComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption3(chart, point)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

  init_four: function (point) {           //初始化第一个图表
    this.fourComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption4(chart, point)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

  init_five: function (point) {           //初始化第一个图表
    this.fiveComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption5(chart, point)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },



    gotocommentgame:function(e){
      wx.navigateTo({
        url: '../commentgame/commentgame'
      })  
    },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})