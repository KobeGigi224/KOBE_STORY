// pages/gigiindex/gigiindex.js
import * as echarts from '../../ec-canvas/echarts';
const util = require('../../utils/util.js')
const app = getApp()
var types ="比赛"
let col1H = 0;
let col2H = 0;

function setOption(chart, stats) {
  var option ={
    title: {
      text: '图片统计',
      subtext: '数据以实际图片为准',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    color:['#9A60B4', '#FAC858', '#91CC75','#EE6666','#73C0DE','#FC8452'],
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '75%',
        top:30,
        data:  stats,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
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
    stats: [],
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    shuaxin:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          windowHeight: scrollH,
          imgWidth: imgWidth
        });
        this.loadImages(options);
      }
    })

  },
  
  getOneOption: function () {
    var stats=[];
    var data;
    wx.cloud.callFunction({
      name: 'statsphoto',
      complete: res => {
        data = res.result.list
        console.log(data);
        for (var i in data) {
          var obj=new Object();
          obj.name=data[i]._id; 
          obj.value=data[i].num;
          stats[i]=obj;
        }
        console.log(stats)

        this.setData({
          stats:stats
        });

        this.init_one(stats)

      },
    })


  },

  init_one: function (stats) {           //初始化第一个图表
    console.log(this.oneComponent)
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, stats)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },



  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;      
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.trips;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img._id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
     
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },
  
  loadImages: function (options) {

    if (JSON.stringify(options) == "{}" || options == undefined) {
      wx.showLoading({ title: '加载中', icon: 'loading', duration: 2000 });
        wx.cloud.callFunction({
          name: 'getkobephoto',
          data: {
            temptype: '比赛',
          },
          complete: res => {
            console.log(res.result)
            this.setData({
              trips: res.result,
              loadingCount: res.result.length
            })
          },
        })

    }
    else {
      wx.showLoading({ title: '加载中', icon: 'loading', duration: 2000 });

      wx.cloud.callFunction({
          name: 'getkobephoto',
          data: {
            temptype: options,
          },
          complete: res => {
            console.log(res.result)
            this.setData({
              trips: res.result,
              loadingCount: res.result.length
            })
          },
        })

    }
  },

  onClick(event) {
    col1H = 0;
    col2H = 0;

    types = event.detail.title;
    console.log(types);  //这里的打印没有问题
        this.setData({
          col1: [],
          col2: []
        })
    this.loadImages(types);
  },

  big: function (Event) {
    this.data.shuaxin = false
    var src = Event.currentTarget.dataset.src;//获取data-src
    console.log(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.oneComponent = this.selectComponent('#mychart');
    this.getOneOption();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})