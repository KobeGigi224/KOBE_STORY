import * as echarts from '../../ec-canvas/echarts';
import geoJson from './mapData.js';


const app = getApp();
function initChart(canvas, width, height, dpr) {
  
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  echarts.registerMap('china', geoJson);
  const option = {
    title:[ {
      text: '关于老大的中国足迹',
      textStyle:{
        color: '#7232DD',
        fontSize:12,
      },
      subtext: '可点击区域查看详情',
      subtextStyle: {
        color: '#000000',
        fontSize: 8,
      },
    }],
  /*  tooltip: {
      trigger: 'item',
      formatter: '{b}'
    },*/
    
    series: [{
      type: 'map',
      mapType: 'china',
      roam: true,
      label: {
        normal: {
          show: false
        },
        emphasis: {
            show: false
        }
      },
      zoom:1.25,
      itemStyle: {
        normal: {
          areaColor: '#FFFF00',
          borderColor: 'rgba(0, 0, 0, 0.3)'
        },
        emphasis: {
          areaColor: '#800080',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 20,
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animation: false,

      data: [
        { name: '北京' },
        { name: '天津' },
        { name: '上海' },
        { name: '重庆' },
        { name: '河北' },
        { name: '河南' },
        { name: '云南' },
        { name: '辽宁' },
        { name: '黑龙江' },
        { name: '湖南' },
        { name: '安徽' },
        { name: '山东' },
        { name: '新疆' },
        { name: '江苏' },
        { name: '浙江' },
        { name: '江西' },
        { name: '湖北' },
        { name: '广西' },
        { name: '甘肃' },
        { name: '山西' },
        { name: '内蒙古' },
        { name: '陕西' },
        { name: '吉林' },
        { name: '福建' },
        { name: '贵州' },
        { name: '广东' },
        { name: '青海' },
        { name: '西藏' },
        { name: '四川' },
        { name: '宁夏' },
        { name: '海南' },
        { name: '台湾' },
        { name: '香港' },
        { name: '澳门' },
        { name: '南海诸岛' }
      ]
    }],
  };
  chart.setOption(option);
  
  chart.on('click', function (params) {//点击事件
    if (params.componentType === 'series') {
      var city = params.name;
      var url = '../mapdetail/mapdetail?city=' + city;
      wx.navigateTo({
        url: url,
      })
      console.log(url);
    }
  });
  return chart;
}




Page({
  onShareAppMessage: function () {
    
  },
  
  data: {
    ec: {
      onInit: initChart
    }
  }, 
  
  onLoad: function (options) {
 
  },

  onShow: function () {

  } ,

});
