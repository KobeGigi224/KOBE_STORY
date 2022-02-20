// pages/usercenter/usercenter.js
var oid
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
    oid = options.openid;
    console.log(oid);
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  gotomesdetail: function () {
    var url = '../mesdetail/mesdetail?openid=' + oid
    wx.navigateTo({
      url: url,
    })
    console.log(url)
  },
  gotoplacedetail: function () {
    var url = '../placedetail/placedetail?openid=' + oid
    wx.navigateTo({
      url: url,
    })
    console.log(url)
  },
  gotophotodetail: function () {
    var url = '../photodetail/photodetail?openid=' + oid
    wx.navigateTo({
      url: url,
    })
    console.log(url)
  },
  gotoadvice: function () {
    var url = '../addadvice/addadvice'
    wx.navigateTo({
      url: url,
    })
    console.log(url)
  }
})