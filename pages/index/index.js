// pages/index/index.js
const util = require('../../utils/util.js')
const app = getApp()
var username=null
var openid
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datetimeToRetire: "2016/04/14 13:00:00 GMT+0800", 
    datetimeToDied: "2020/1/27 01:45:00 GMT+0800", 
    timeRetire: "" ,   
    timeDied: "" ,
    timebirth: "", 
    birthcong:"",
    userInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.login({
      success: res => {
        wx.cloud.callFunction({
          name: 'getopenid',
          complete: res => {
            console.log('index_openid:', res.result.openid)
            openid = res.result.openid
          }
        })
      }
    })
    var active;
    var newadd;
    var visitcount
    wx.cloud.callFunction({
      name: 'getdailyuser',
      complete: res => {
        console.log(res.result);
        this.setData({
          active:res.result.list[0].visitUv,
          newadd:res.result.list[0].visitUvNew,
          visitcount:res.result.list[0].visitPv
        })
      },
    })

        this.setData({
          ishidelogin: true
        })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var birth;
    var birthcong;
    var kobesays;
    wx.cloud.callFunction({
      name: 'kobeindexshow',
      complete: res => {
        console.log(res.result);
        this.data.timer = setInterval(() => { //注意箭头函数！！
          this.setData({
            index: res.result,
            timebirth: util.getbirth(res.result[0].time),
            timehall: util.getbirth(res.result[1].time)
          });
          if (this.data.timebirth == "0天0时0分0秒") {
            clearInterval(this.data.timer);
          }
          if (this.data.timehall == "0天0时0分0秒") {
            clearInterval(this.data.timer);
          }
        }, 1000);
      },
    })
    var mescount;
    wx.cloud.callFunction({
      name: 'getmescount',
      complete: res => {
        console.log(res.result);
        mescount = res.result.total;
        this.setData({
          mescount: mescount
        });
      },
    })
    var placecount;
    wx.cloud.callFunction({
      name: 'getplacecount',
      complete: res => {
        console.log(res.result);
        placecount = res.result.total;
        this.setData({
          placecount: placecount
        });
      },
    })
    var say;
    wx.cloud.callFunction({
      name: 'kobesays',
      complete: res => {
        console.log(res.result);
        say = res.result;
        this.setData({
          kobesays: say
        });
      },
    })

    this.data.timer = setInterval(() => { //注意箭头函数！！
      this.setData({
        timeRetire: util.getTime(this.data.datetimeToRetire),//使用了util.getTimeRetire
        timeDied: util.getTime(this.data.datetimeToDied),
        birthcong: birthcong
      });
      if (this.data.timeRetire == "0天0时0分0秒") {
        clearInterval(this.data.timer);
      }
      if (this.data.timeDied == "0天0时0分0秒") {
        clearInterval(this.data.timer);
      }
    }, 1000);
  },

  big: function (Event) {
    var src = Event.currentTarget.dataset.src;//获取data-src
    console.log(src);
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },

  gongzhonghao: function (e) {
    wx.previewImage({
      current: 'cloud://blackmisskobe-wb71j.626c-blackmisskobe-wb71j-1303932135/images/gongzhonghao.jpg', // 当前显示图片的http链接
      urls: ['cloud://blackmisskobe-wb71j.626c-blackmisskobe-wb71j-1303932135/images/gongzhonghao.jpg'] // 需要预览的图片http链接列表
    })
  },
  
  gomeschart(){
    wx.navigateTo({
      url: '/pages/meschart/meschart'//跳转
    })
  },

  
  goplacechart(){
    wx.navigateTo({
      url: '/pages/placechart/placechart'//跳转
    })
  },


  gotocomment: function (e) {
    if (username==null) {
      wx.showModal({
        title: '提醒',
        content: '您没有授权，将无法使用留言功能，如需留言请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
      })
    }
    else{
      wx.navigateTo({
        url: '../addmes/addmes?name=' + username,
      }) 
    }
  },

  gotoplace: function (e) {
    if (username == null) {
      wx.showModal({
        title: '提醒',
        content: '您没有授权，将无法添加圣地，如需添加圣地请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
      })
    }
    else {
      wx.navigateTo({
        url: '../addplace/addplace?name=' + username,
      })
    }
  }, 
  gotophoto: function (e) {
    if (username == null) {
      wx.showModal({
        title: '提醒',
        content: '您没有授权，将无法添加图片，如需添加图片请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
      })
    }
    else {
      wx.navigateTo({
        url: '../addphoto/addphoto?name=' + username,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindGetUserInfo: function (e) {
    var that=this;
    wx.showModal({
      title: '温馨提示',
      content: '即将授权，需要获取你的头像和昵称，请确定',
      success(res) {
        if (res.confirm) {
          wx.getUserProfile({
            desc: "获取你的昵称、头像、地区及性别",
            success: res => {
              username = res.userInfo.nickName;
              console.log(res)
              console.log(res.userInfo)
              that.setData({
                username: res.userInfo.nickName,
                image: res.userInfo.avatarUrl,
                ishidemes: true,
                ishidelogin: false,
              })
            },
            fail: res => {
              //拒绝授权
              wx.showToast({
                icon: 'none',
                title: '您已拒绝授权'
              })
              return;
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            icon:'none',
            title: '您已拒绝授权'
          })
          return;
        }
      }
    })
    },

  gotousercenter: function (e) {
    wx.navigateTo({
      url: '../usercenter/usercenter?openid=' + openid,
    })
  },
})