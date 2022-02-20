//app.js

App({
  onLaunch: function () {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      }
      else {
        wx.cloud.init({
          env:"blackmisskobe-wb71j",
          traceUser: true,
        })
      }
    
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.onAppRoute(function (res) {
      //获取加载的页面
      let pages = getCurrentPages(),
        //获取当前页面的对象
        view = pages[pages.length - 1],
        data;
      if (view) {
        data = view.data;
        if (!data.isOverShare) {
          data.isOverShare = true;
          view.onShareAppMessage = function () {
            //重写分享配置
            return {
              title: '你知道凌晨四点的洛杉矶嘛？',
              imageUrl: '/images/cover.jpg',
              path: "/pages/index/index"    //分享页面地址
            };
          }
        }
      }
    })
  },
  
  globalData: {
    openid:null,
    china:null
  }
})