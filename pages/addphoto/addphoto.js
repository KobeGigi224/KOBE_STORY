// pages/addphoto/addphoto.js
const { listToMatrix } = require('/../lib/util.js');
var COS = require('../lib/cos-wx-sdk-v5.js');
const config = require('../../config.js');
const util = require('../lib/util.js');

var that
var imageurl
var temptype = '比赛'

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
    nikename: '',
    kobePlace: '',
    photodesc: '',
    tempphotottype:'',
    imageurltocloud: '',
    arraytype: ['比赛', '家庭', '合影', '活动','球迷','壁纸'],
    indextype: 0
  },

  bindphotoPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value) 
    console.log('picker发送选择改变，携带值为', this.data.arraytype[e.detail.value])
    temptype = this.data.arraytype[e.detail.value]
    this.setData({
      indextype: e.detail.value,
      tempphotottype: temptype
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    imageurl = "";
    var kname = options.name;
    console.log(kname);
    this.setData({
      nikename: kname,
      tempphotottype: temptype,
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
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
      var tempFilePaths = files.tempFilePaths;
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

  showLoading(loadingMessage) {
    this.setData({ showLoading: true, loadingMessage });
  },


  photocomfirm: function (e) {
  
    if (this.data.photodesc == "" || imageurl == "") {
      wx.showToast({
        icon: 'none',
        title: '信息不全，请完善'
      })
    } else {
            wx.showModal({
              title: '确认要提交吗',
              content: '提交后可在gigi页面查看自己上传的图片，在个人中心/我上传的图片下查看和删除图片',
              success(res) {
                if (res.confirm) {
                  that.plotosubmit(e);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
        }
    },
  

  plotosubmit: function (e) {
    var self = this
    const db = wx.cloud.database()
    let time = new Date();
    var Key = 'kobepic/' + util.getRandFileName(imageurl);
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
    db.collection('Kobe_Photo').add({
      data: {
        nikename: this.data.nikename,
        photodesc: this.data.photodesc,
        phototype: this.data.tempphotottype,
        isdel: 0,
        height: 0,
        //res.fileID
        image: this.data.imageurltocloud,
        updatetime: time
      },
      success: res => {
        temptype = '比赛'
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
        })
        wx.showToast({
          title: '上传成功',
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
          title: '上传失败'
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

  bindKeyName: function (e) {
    this.setData({
      nikename: e.detail.value
    })
  },
  bindfileid: function (e) {
    this.setData({
      imageurltocloud: e.detail.value
    })
  },
  bindKeydesc: function (e) {
    this.setData({
      photodesc: e.detail.value
    })
  }

})