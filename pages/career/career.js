// pages/career/career.js

Page({

  /**
   * 页面的初始数据
   */
  data: {

    multiArray: [['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
      '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
      '25', '26', '27', '28', '29', '30', '31'
    ]],
    multiIndex: [0, 0],


    multiArrayTeam: ['中国', '勇士', '雄鹿', '小牛', '快船', '鹈鹕', '奇才', '开拓者', '森林狼', '马刺', '凯尔特人', '猛龙',
      '太阳', '灰熊', '热火', '老鹰', '爵士', '篮网', '雷霆', '掘金', '76人', '步行者', '国王', '活塞','骑士', '公牛', '魔术', '火箭'
    , '尼克斯', '黄蜂', '子弹','超音速','山猫','西班牙','阿根廷','澳大利亚','立陶宛','尼日利亚','突尼斯','法国','德国','希腊','安哥拉','东部全明星'],
    multiIndexTeam: 0,

    multiArraySeason: ['1516赛季', '1415赛季', '1314赛季', '1213赛季', '1112赛季', '1011赛季', '0910赛季', '0809赛季', '0708赛季', '0607赛季', '0506赛季', '0405赛季', '0304赛季', '0203赛季', '0102赛季', '0001赛季', '9900赛季', '9899赛季', '9798赛季', '9697赛季','Olympic赛季'],
    multiIndexSeason: 0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var query = options;
    var isquery = options.length;
    var querynow = that.getNowTime();
    var reg = new RegExp("^[0-9]*$"); 
    var res;
    var career;
    var total;
    var time;
    var mes;
    if (query.toString().indexOf("/") != -1 || JSON.stringify(query) == "{}" )
    {
      if (isquery == 6) {
        querynow = query;
      }
      time = querynow.split('/');
      mes = time[1].replace(/\b(0+)/gi, "") + '月' + time[2].replace(/\b(0+)/gi, "") + '日';
      wx.cloud.callFunction({
        name: 'querydate',
        data:{
          querynow: querynow,
        },
        complete: res => {
          console.log(res.result.career)
          if (res.result.career.length ==0)
          {
            mes = "历史上的"+mes+"暂无比赛";
            res.result.total ="";
          }
          else
          {
            mes = "历史上的" + mes
          }
          this.setData({
            total: res.result.total,
            career: res.result.career,
            mes
          })
        },
      })
    }
    else if (reg.test(query) || query =="Olympic")
    {
      wx.cloud.callFunction({
        name: 'queryseason',
        data: {
          qseason: query,
        },
        complete: res => {
          console.log(res.result.season)
          mes = query+"赛季";
          this.setData({
            total: res.result.total,
            career: res.result.season,
            mes
          })
        },
    })
    }
    else
    {
      wx.cloud.callFunction({
        name: 'queryteam',
        data: {
          qteam: query,
        },
        complete: res => {
          console.log(res.result.team)
          mes = "历史上的与" + query+"交手";
          this.setData({
            total: res.result.total,
            career: res.result.team,
            mes
          })
        },
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  getNowTime: function () {
    var now = new Date();
    var month = now.getMonth() + 1;
    if (month.toString().length == 1)
    month = "0"+ month
    var day = now.getDate();
    if (day.toString().length == 1)
      day = "0" + day
    var formatDate = '/'+ month + '/' + day;
    return formatDate;
  },

  gocareerdetail:function(e){
    var cid = e.currentTarget.dataset.cid;
    var url;
    wx.navigateTo({
      url: '../careerdetail/careerdetail?id='+cid,
    })  
    console.log(url);
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 1:
            data.multiArray[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
              '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
              '25', '26', '27', '28', '29'
            ];
            break;
          case 3:
          case 5:
          case 8:
          case 10:
            data.multiArray[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
              '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
              '25', '26', '27', '28', '29', '30'
            ];
            break;
          default:
            data.multiArray[1] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
              '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
              '25', '26', '27', '28', '29', '30', '31'
            ];
            break;
        }
        break;
    }
    this.setData(data);
    console.log(data);
  },

 

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var month = e.detail.value[0]+1;
    var day = e.detail.value[1]+1;
    if (month.toString().length == 1)
      month = "0" + month
    if (day.toString().length == 1)
      day = "0" + day
    var querydate = '/' + month + '/' + day;
    let that = this;
    that.onLoad(querydate);
  },

  bindTeamPickerChange: function (e) {
    var team = this.data.multiArrayTeam[e.detail.value]
    console.log('picker发送选择改变，携带值为', team)
    let that = this;
    that.onLoad(team);
  },

  bindSeasonPickerChange: function (e) {
    var season = this.data.multiArraySeason[e.detail.value]
    season = season.replace(RegExp("赛季", "g"), "")
    console.log('picker发送选择改变，携带值为', season)
    let that = this;
    that.onLoad(season);
  },

})