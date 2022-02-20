// pages/mesdetail/mesdetail.js
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
    var mes;
    var oid;
    if (options.openid==undefined)
    {
      oid = options
    }
    else
    {
      oid = options.openid;
    }
    console.log(oid);
    wx.cloud.callFunction({
      name: 'queryusermes',
      data: {
        oid: oid,
      },
      complete: res => {
        console.log(res.result)
        this.setData({
          mes: res.result
        })
      }
    })
  },

  deletemes: function (e) {
    var cid = e.currentTarget.dataset.cid;
    var openid = e.currentTarget.dataset.oid;
    const db = wx.cloud.database();
    let that = this;
    wx.showModal({
      title: '确认要删除吗',
      content: '删除后不可恢复，不过你可以重新写啦哈哈哈',
      success(res) {
        if (res.confirm) {
          db.collection('Message').where({
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
          
        } 
      }
    })

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})