// pages/addplace/addplace.js
const { listToMatrix } = require('/../lib/util.js');
var COS = require('../lib/cos-wx-sdk-v5.js');
const config = require('../../config.js');
const util = require('../lib/util.js');

var that
var list = []
var imageurl
var tempprovince = '北京'
var temparea = '北京'
import {
  multiArray,
  objectMultiArray
} from '../../utils/pickerLinkage.js'

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
    area: '',
    kobePlace: '',
    kobePlaceAddress:'',
    imageurltocloud:'',
    province: '',
    multiIndex: [0, 0],
    multiArray: multiArray,
    objectMultiArray: objectMultiArray
  },

  bindMultiPickerChange: function(e) {
    var that = this;
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      province: tempprovince,
      area: temparea
    })

  },

  bindMultiPickerColumnChange: function(e) {
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < that.data.objectMultiArray.length; i++) {
          if (that.data.objectMultiArray[i].parid == that.data.objectMultiArray[e.detail.value].regid) {
            list.push(that.data.objectMultiArray[i].regname)
          }
        }

        that.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0
        })
        break;
      case 1:
        that.setData({
          "multiIndex[1]": e.detail.value
        })
        break;
    }
    if (e.detail.column == 0) {
      tempprovince = multiArray[0][e.detail.value];
      temparea = list[0];
    }
    if (e.detail.column == 1) {
      temparea = list[e.detail.value];
    }
    console.log(tempprovince)
    console.log(temparea)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    imageurl = "";
    var kname = options.name;
    console.log(kname);
    this.setData({
      nikename: kname,
      province: '北京',
      area: '北京',
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })
  },
  previewImage: function(e) {
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
    imageurl ="";
  },


  placecomfirm: function(e) {
    if (this.data.kobePlace == "" || this.data.kobePlaceAddress == "" || imageurl=="") {
      wx.showToast({
        icon: 'none',
        title: '信息不全，请完善'
      })
    } else {
            wx.showModal({
              title: '确认要提交吗',
              content: '提交后可在科密地图/选择省份查看自己提供的圣地，在个人中心/我寻找的圣地下查看和删除圣地',
              success(res) {
                if (res.confirm) {
                  that.placesubmit(e);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

    }
  },

  placesubmit: function(e) {
    var self = this
    const db = wx.cloud.database()
    let time = new Date();
    var Key = 'kobeplace/' + util.getRandFileName(imageurl);
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
    db.collection('Kobe_Place').add({
      data: {
        nikename: this.data.nikename,
        area: this.data.area,
        province: this.data.province,
        address: this.data.kobePlaceAddress,
        placename: this.data.kobePlace,
        isdel: 0,
        //res.fileID
        image: this.data.imageurltocloud,
        updatetime: time
      },
      success: res => {
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
  onShareAppMessage: function() {

  },

  bindKeyName: function(e) {
    this.setData({
      nikename: e.detail.value
    })
  },
  bindKeyplaceName: function (e) {
    this.setData({
      kobePlace: e.detail.value
    })
  },
  bindfileid: function (e) {
    this.setData({
      imageurltocloud: e.detail.value
    })
  },
  bindKeyPlace: function(e) {
    this.setData({
      kobePlaceAddress: e.detail.value
    })
  }

})