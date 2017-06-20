// junfeipage/working/mtinspection/mtinspectionDetail/mtinspectionDetail.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const tips = require('../../../../utils/util.js').tips;
let app = getApp();
Page({
  data: {
    list: '',
    show: [false, false, false, true],
    checked: '',
    id: '',
    array: ['是', '否'],
    zhibao: '',
    totalFee: 0,
    result: ['通过', '不通过'],
    index: 0,
    statuz: 70,
    startlist: [0, 1, 2, 3, 4],
    startsrc: "../../../../images/start.png",
    startselectedsrc: "../../../../images/startselected.png",
    key1: 0,
    key2: 0,
    key3: 0,
    key4: 0,
    aprres: '',
    Memo: '',
    pass: true
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      id: options.param
    })

    //获取区县审核不通过意见
    if (options.statuz == '区县审核不通过') {
      var param = {
        repairNeedId: options.param,
        statuz: 71,
        sessionId: wx.getStorageSync('sessionid')
      }
      requiredata.getpassInfo(requireUrl.getpassinfoUrl, param, function (res) {
        console.log(res);
        if (res.data.flag == 1) {
          var maplist = JSON.parse(res.data.data.rows);
          that.setData({
            Memo: maplist.Memo
          })
        }
      }, function (res) {

      })
    }

    //获取维修单信息
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
          var rows = JSON.parse(res.data.data.rows);
          if (rows.Statuz == 60) {
            that.setData({
              list: JSON.parse(res.data.data.rows),
              checked: res.data.data.rows.isAlarm,
              zhibao: that.data.array[JSON.parse(res.data.data.rows).IsWarranty],
              totalFee: JSON.parse(res.data.data.rows).ServiceFee + JSON.parse(res.data.data.rows).PartsFee + JSON.parse(res.data.data.rows).HomeFee
            })
          } else {
            that.wetoast.toast({
              title: '该报修单已审批',
              duration: 1000,
              success: function () {
                wx.redirectTo({
                  url: '../../mtinspection/mtinspection',
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
      },
      fail: function () {
        console.log('请求失败')
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
  },
  startlist1: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key1: key

    })
  },
  startlist2: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key2: key

    })
  },
  startlist3: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key3: key

    })
  },
  startlist4: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key4: key

    })
  },
  // listenerPickerSelected: function (e) {
  //   //改变index值，通过setData()方法重绘界面
  //   var that = this;
  //   that.setData({
  //     index: e.detail.value,
  //     aprres: that.data.result[e.detail.value]
  //   });
  //   if (e.detail.value == 0) {
  //     that.setData({
  //       statuz: 70
  //     })
  //   } else if (e.detail.value == 1) {
  //     that.setData({
  //       statuz: 61
  //     })
  //   }
  // },
  radioChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value
    })
    console.log(e.detail.value)
    if (e.detail.value == 'true') {
      that.setData({
        statuz: 70
      })
    } else if (e.detail.value == 'false') {
      that.setData({
        statuz: 61
      })
    }
  },
  getCheckmemo: function (e) {
    var that = this;
    that.setData({
      checkmemo: e.detail.value
    })
  },
  submit: function (e) {
    var that = this;
    var param = {
      checkEvaluation: {
        Statuz: that.data.statuz,
        CheckMemo: that.data.checkmemo,
        RepairNeedId: that.data.id,
        Overall: that.data.key1,
        Attitude: that.data.key2,
        Ability: that.data.key3,
        Speed: that.data.key4,
        Memo: '',
        FormId: e.detail.formId
      },
      sessionid: wx.getStorageSync('sessionid')
    }
    console.log(param);
    if (that.data.statuz == '') {
      that.wetoast.toast({
        title: '请选择验收结果',
        duration: 2000,
      });
    } else {
      wx.request({
        url: requireUrl.busrepratingsUrl,
        data: param,
        method: 'POST',
        header: {
          'content-type': 'application/json',
        },
        success: function (res) {
          if (res.data.flag == 1) {
            tips(that, '验收成功', 1000, '../../index')
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
  }
})