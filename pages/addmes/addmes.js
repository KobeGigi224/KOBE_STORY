// pages/addmes/addmes.js
var that
var list = []
var tempprovince='北京'
var temparea='北京'
import { multiArray, objectMultiArray } from '../../utils/pickerLinkage.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    nikename:'',
    area: '',
    comment: '',
    province:'',
    multiIndex: [0, 0],
    multiArray: multiArray,
    objectMultiArray: objectMultiArray
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var kname = options.name;
    console.log(kname);
    this.setData({
      nikename: kname,
      province:'北京',
      area: '北京'
    })
    
  },

  bindMultiPickerChange: function (e) {
    var that =this;
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      province: tempprovince,
      area: temparea
    })

  },
  bindMultiPickerColumnChange: function (e) {
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  commentcomfirm: function (e) {
    if (this.data.comment=="")
    {
      wx.showToast({
        icon: 'none',
        title: '留言不能为空'
      })
    }
    else
    {
      wx.showModal({
        title: '确认要提交吗',
        content: '提交后可在科密地图/选择省份查看自己的留言，在个人中心/我的留言下查看和删除留言',
        success(res) {
          if (res.confirm) {
            that.commentsubmit(e);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },


  commentsubmit: function (e) {
    const db = wx.cloud.database()
    let time = new Date();
    db.collection('Message').add({
      data: {
        nikename: this.data.nikename,
        area: this.data.area,
        province: this.data.province,
        comment: this.data.comment,
        isdel: 0,
        image:'',
        updatetime: time
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
        })
        wx.showToast({
          title: '留言成功',
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
          title: '留言失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  bindKeyName: function (e) {
    this.setData({
      nikename: e.detail.value
    })
  },
  bindKeyComment: function (e) {
    this.setData({
      comment: e.detail.value
    })
  }

})