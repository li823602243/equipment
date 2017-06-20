// junfeipage/working/RepiarDetail/RepiarDetail.js
const requireUrl = require('../../../config.js');
const getOrderOptType = require('../../../utils/util.js').getOrderOptType;
const getStatuz = require('../../../utils/util.js').getStatuz;
let app = getApp();
Page({
  data: {
    list: '',
    show: [true, false, false, false],
    checked: '',
    id: '',
    array: ['是', '否'],
    zhibao: '',
    totalFee: 0,
    result: ['通过', '不通过'],
    index: 0,
    statuz: '',
    aprres: '',
    record: '',
    CompanyName: ''
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      id: options.param,
      statuz: options.statuz
    })
    var param = {
      Id: that.data.id,
      t: 5,
      sessionId: wx.getStorageSync('sessionid')
    }
    wx.request({
      url: requireUrl.mtresdtUrl,
      data: param,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data.data.rows)
        if (res.data.flag == 1) {
          that.setData({
            list: JSON.parse(res.data.data.rows),
            checked: JSON.parse(res.data.data.rows).isAlarm,
            CompanyName: JSON.parse(res.data.data.rows).CompanyName,
            zhibao: that.data.array[JSON.parse(res.data.data.rows).IsWarranty],
            totalFee: parseInt(JSON.parse(res.data.data.rows).ServiceFee) + parseInt(JSON.parse(res.data.data.rows).PartsFee) + parseInt(JSON.parse(res.data.data.rows).HomeFee)
          })
        } else if (res.data.flag == -1) {
          that.wetoast.toast({
            title: '登录超时',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../login/index',
              })
            }
          });
        } else if (res.data.flag == 0) {
          that.wetoast.toast({
            title: res.data.msg,
            duration: 1000,
          });
        }
      },
      fail: function () {
        console.log('请求失败')
      }
    })
    //获取日志流水
    wx.request({
      url: requireUrl.mytorepairRecordUrl,
      data: {
        rnId: that.data.id,
        sessionId: wx.getStorageSync('sessionid')
      },
      method: 'GET',
      success: function (res) {
        var maplist = JSON.parse(res.data.data.rows);
        for (var i = 0; i < maplist.length; i++) {
          maplist[i].OptType = getOrderOptType(maplist[i].OptType);
          maplist[i].NextStatuz = getStatuz(maplist[i].NextStatuz)

        }
        that.setData({
          record: maplist
        })
        console.log(that.data.record)
      },
      fail: function () {
        console.log('error');
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  toggle: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    that.data.show[idx] = !that.data.show[idx];
    that.setData({
      show: that.data.show
    })
  }

})