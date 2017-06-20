// junfeipage/working/mtresponse/mtresponse.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const tips = require('../../../../utils/util.js').tips;
let app = getApp();
Page({
  data: {
    list: '',
    id: '',
    unitid: '',
    array: ['是', '否'],
    zhibao: ''
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      id: options.param,
      unitid: wx.getStorageSync('unittype')
    })

    var param = {
      Id: that.data.id,
      t: 5,
      sessionId: wx.getStorageSync('sessionid')
    }

    requiredata.getresDetail(requireUrl.mtresdtUrl, param, function (res) {
      if (res.data.flag == 1) {
        var rows = JSON.parse(res.data.data.rows);
        if (rows.Statuz == 10 || rows.Statuz == 40) {
          that.setData({
            list: JSON.parse(res.data.data.rows),
            zhibao: that.data.array[JSON.parse(res.data.data.rows).IsWarranty]
          })
        } else if(rows.Statuz==23){
          that.wetoast.toast({
            title: '该报修单已退回',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../mtresponse/mtresponse',
              })
            }
          });
        }else{
          that.wetoast.toast({
            title: '该报修单已响应',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../mtresponse/mtresponse',
              })
            }
          });
        }
      } else if (res.data.flag == -1) {
        that.wetoast.toast({
          title: '登录超时',
          duration: 1000,
          success: function () {
            wx.redirectTo({
              url: '../../../login/index',
            })
          }
        });
      } else if (res.data.flag == 0) {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000,
        });
      }

    }, function (res) {
      console.log("失败", res);
    })
  },
  formSubmit: function (e) {
    console.log(e);
    var that = this;
    var param = {
      FormId: e.detail.formId,
      Id: that.data.id,
      sessionId: wx.getStorageSync('sessionid')
    }
    var resUrl;
    if (that.data.unitid == 3) {
      resUrl = requireUrl.schoolresUrl;
    } else if (that.data.unitid == 4) {
      resUrl = requireUrl.busresUrl;
    }
    wx.request({
      url: resUrl,
      data: param,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.flag == 1) {
          that.wetoast.toast({
            title: '响应成功',
            duration: 1000,
            success: function () {
              if (that.data.unitid == 4) {
                wx.redirectTo({
                  url: '../../mtdispatching/mtdisDetail/mtdisDetail?param=' + that.data.id,
                })
              } else {
                wx.switchTab({
                  url: '../../index',
                })
              }
            }
          });

        } else if (res.data.flag == -1) {
          that.wetoast.toast({
            title: '登录超时',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../../login/index',
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
  },
  undoBack: function (e) {
    var that = this;
    var param = {
      FormId: e.detail.formId,
      rnId: that.data.id,
      memo: '',
      sessionId: wx.getStorageSync('sessionid')
    }
    wx.request({
      url: requireUrl.backmtUrl,
      data: param,
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.flag == 1) {
          tips(that, '撤销成功', 1000, '../../index')
        } else if (res.data.flag == -1) {
          that.wetoast.toast({
            title: '登录超时',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../../../login/index',
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
  }
})