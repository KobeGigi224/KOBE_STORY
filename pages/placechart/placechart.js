import * as echarts from '../../ec-canvas/echarts';

function setOption(chart, province, sum) {
  var option = {
    title: {
      text: '科密圣地排行榜',
      subtext: '详细信息可点击科密地图选择省份查看'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      show: false,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      inverse: true,
      show: true,
      axisLine: {       //y轴
        show: false

      },
      axisTick: {       //y轴刻度线
        show: false
      },
      splitLine: {     //网格线
        show: false
      },
      data: province
    },
    series: [
      {
        type: 'bar',
        data: sum,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 0,
              [
                { offset: 0, color: '#7232DD' },                   //柱图渐变色
                { offset: 0.4, color: '#CC66CC' },                 //柱图渐变色
                { offset: 1, color: '#FFFF00' },                   //柱图渐变色
              ]
            )
          }
        },
        label: {
          show: true,
          position: 'right'
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
    province: [],
    sum: [],
    activeIndex: 0

  },


  getOneOption: function () {
    var province = [];
    var sum = [];
    var data;
    wx.cloud.callFunction({
      name: 'getplacerank',
      complete: res => {
        data = res.result.list
        for (var i in data) {
          province.push(data[i]._id)
          sum.push(data[i].num)
        }
        console.log(province)
        console.log(sum)

        this.setData({
          province: province,
          sum: sum
        });

        this.init_one(province, sum)

      },
    })


  },
  init_one: function (province, sum) {           //初始化第一个图表
    console.log(this.oneComponent)
    this.oneComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, province, sum)  //赋值给echart图表
      this.chart = chart;
      return chart;
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.oneComponent = this.selectComponent('#mychart');
    this.getOneOption();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


  },

})