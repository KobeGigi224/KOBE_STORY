// pages/addadvice/addadvice.js
var that
var imageurl
const { listToMatrix } = require('/../lib/util.js');
var COS = require('../lib/cos-wx-sdk-v5.js');
const config = require('../../config.js');
const util = require('../lib/util.js');

var cos = new COS({
  SecretId: 'AKIDby3HJ4TEckbEae5gKFtKXppY3iCTPsLZ',
  SecretKey: 'GF44sPvZynLwzlGvaFhnodCUYqJWSIzT',
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    advice: '',
    wxh: '',
    imageurltocloud: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    imageurl = "";
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files) {
    console.log('upload files', files)
    // 文件上传的函数，返回一个promise
    return new Promise((resolve, reject) => {
      const tempFilePaths = files.tempFilePaths;
      console.log(files.tempFiles[0].path);
      imageurl = files.tempFiles[0].path;
      this.setData({
        filesUrl: tempFilePaths
      })
      var object = {};
      object['urls'] = tempFilePaths;
      resolve(object);
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },
  uploaddelete(e) {
    imageurl = "";
  },


  advicecomfirm: function (e) {
    if (this.data.advice == ""  || imageurl == "") {
      wx.showToast({
        icon: 'none',
        title: '建议和图片为必填项'
      })
    } else {
      wx.showModal({
        title: '确认要提交吗',
        content: '请再确认所填信息无误',
        success(res) {
          if (res.confirm) {
            that.advicesubmit(e);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  advicesubmit: function (e) {
    var self = this
    const db = wx.cloud.database()
    let time = new Date();
    var Key = 'programadvice/' + util.getRandFileName(imageurl);
    cos.postObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: Key,
      FilePath: imageurl
    }, function (err, data) {
      if (data) {
        console.log(data)
        self.setData({
          imageurltocloud: 'https://' + data.Location
        })
      }
    })
    wx.showLoading({ title: '加载中', icon: 'loading', duration: 2000 });
    setTimeout(() => {
    db.collection('Advice').add({
      data: {
        advice: this.data.advice,
        wxh: this.data.wxh,
        image: this.data.imageurltocloud,
        status:0,
        updatetime: time
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '感谢您的建议!',
          duration: 2000,
          success() {
            setTimeout(() => {
              wx.navigateBack({
                complete: (res) => {
                  console.log(res)
                },
              })
            }, 2000)
          }
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '提交失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    }, 2000)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindKeyadvice: function (e) {
    this.setData({
      advice: e.detail.value
    })
  },
  bindKeywxh: function (e) {
    this.setData({
      wxh: e.detail.value
    })
  },
  bindfileid: function (e) {
    this.setData({
      imageurltocloud: e.detail.value
    })
  },

})