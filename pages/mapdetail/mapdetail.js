// pages/mapdetail/mapdetail.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var city = options.city;
    var china;
    var mes;
    var ccount;
    var mcount;
    var pcount;
    console.log(city);
    wx.cloud.callFunction({
      name: 'querychina',
      data: {
        qcity: city,
      },
      complete: res => {
        console.log(res.result)
        this.setData({
          china: res.result.city,
          area:city,
          ccount: res.result.ccount
        })
      },
    }),
      wx.cloud.callFunction({
        name: 'querymessage',
        data: {
          qcity: city,
        },
        complete: res => {
          console.log(res.result)
          res.result.mes.forEach((item) => {
            item.updatetime = util.getDateStr(item.updatetime)
          })
          this.setData({
            mes: res.result.mes,
            mcount: res.result.mcount
          })
        },
      }),
      wx.cloud.callFunction({
      name: 'queryplace',
        data: {
          qcity: city,
        },
        complete: res => {
          console.log(res.result)
          this.setData({
            place: res.result.place,
            pcount: res.result.pcount
          })
        },
      })
  },


  big: function (Event) {
    var src = Event.currentTarget.dataset.src;//获取data-src
    console.log(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

})