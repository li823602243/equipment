// junfeipage/working/confirm/confirmdetail/confirmdetail.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const timeout=require('../../../../utils/util.js').timeout;
let app = getApp();
Page({
  data: {
    confirmData: "",
    issubmit: false,
    id: ""
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    that.setData({
      id: options.id
    })
    var confirmdetaildata = {
      Id: options.id,
      sessionId: wx.getStorageSync('sessionid')
    }
    requiredata.confirmdetail(requireUrl.confirmdetailUrl, confirmdetaildata, function (res) {
      if (res.data.flag == "1") {
        var rows = JSON.parse(res.data.data.rows)
        that.setData({
          confirmData: rows
        })
        console.log("成功", res.data)
      } else if (res.data.flag == "-1") {
        timeout(that,"../../../login/index")
      }
    }, function (res) {
      console.log("失败", res.data)
    })
  },
  //借用确认
  submittap: function (e) {
    console.log("333333")
    var that = this;
    wx.showModal({
      title: '借用确认',
      content: '是否确认借用此设备',
      success: function (res) {
        if (res.confirm) {
          var submitconfirmdata = {
            Id: that.data.id,
            sessionId: wx.getStorageSync('sessionid')
          };
          requiredata.submitconfirm(requireUrl.submitconfirmUrl, submitconfirmdata, function (res) {
            if (res.data.flag == 1) {
              that.setData({
                issubmit: true
              })
              that.wetoast.toast({
                title: '借用成功',
                duration: 1000,
                success(data) {
                  wx.switchTab({
                    url: '../../../working/index'
                  })
                }
              });
            }
            console.log("eeee", res.data);
          }, function (res) {
            that.wetoast.toast({
              title: '借用失败',
              duration: 5000
            });
          })
        } else {
          console.log('用户点击取消')
        }

      }
    })
  }
})