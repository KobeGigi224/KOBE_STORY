// pages/placedetail/placedetail.js
var COS = require('../lib/cos-wx-sdk-v5.js');
const config = require('../../config.js');


var cos = new COS({
  SecretId: 'AKIDby3HJ4TEckbEae5gKFtKXppY3iCTPsLZ',
  SecretKey: 'GF44sPvZynLwzlGvaFhnodCUYqJWSIzT',
});

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
    var place;
    var oid;
    if (options.openid == undefined) {
      oid = options
    }
    else {
      oid = options.openid;
    }
    console.log(oid);
    wx.cloud.callFunction({
      name: 'queryuserplace',
      data: {
        oid: oid,
      },
      complete: res => {
        console.log(res.result)
        this.setData({
          place: res.result
        })
      }
    })
  },

  deleteplace: function (e) {
    var cid = e.currentTarget.dataset.cid;
    var openid = e.currentTarget.dataset.oid;
    var imageurl = e.currentTarget.dataset.image;
    var m = imageurl.match(/^https:\/\/[^\/]+\/([^#?]+)/);
    var Key = m && m[1] || '';
    const db = wx.cloud.database();
    let that = this;
    wx.showModal({
      title: '确认要删除吗',
      content: '删除后不可恢复，不过你可以重新添加啦哈哈哈',
      success(res) {
        if (res.confirm) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
          }, (err, data) => {

          })
          wx.showLoading({ title: '删除中', icon: 'loading', duration: 2000 });
          setTimeout(() => {
          db.collection('Kobe_Place').where({
            _id: cid
          }).remove().then(res => {
            wx.showToast({
              title: '删除成功',
              duration: 1000,
              success() {
                setTimeout(() => {
                  that.onLoad(openid);
                }, 1000)
              }
            })
          })
          }, 2000)
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppplacesage: function () {

  }
})