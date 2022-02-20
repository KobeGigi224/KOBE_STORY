// pages/commentgame/commentgame.js
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

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    bindFormSubmit: function(e) {
        var that = this;
        // 获取输入的内容
        var value = e.detail.value.textarea;
    
        if (value.length < 4) {
          wx.showModal({
            title: '提示',
            content: '目前开发中。。',
          })
        } else {
          
          // 提交留言
          wx.request({
            // 传到自己的服务器上
            url: 'xxx.com',
            method: 'POST',  
            // 。。。。。。。  
          })
          
          // 提交完成后的显示
          wx.showToast({
            title: '感谢留言',
            icon: 'success',
            duration: 2000
          })
        }
      },
      
      // 实时显示输入字数
      bindInputText: function(e) {
        var that = this
        var value = e.detail.value;
        var len = parseInt(value.length);
        if (len > that.data.noteMaxLen) return;
        that.setData({
          currentWordNumber: len,
          max:224-len
        })
      },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})