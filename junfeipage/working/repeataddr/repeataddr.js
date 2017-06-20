// junfeipage/working/repeataddr/repeataddr.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
const indexHref = require('../../../utils/util.js').indexHref;
let app = getApp();
function getonesweepData(sno, that) {
  var reg = /^[0-9a-zA-Z]{7}$/;
  if (reg.test(sno)) {
    var getsnoinfodata = {
      sno: sno,
      sessionId: wx.getStorageSync('sessionid')
    }
    requiredata.getsnoinfo(requireUrl.getsnoinfoUrl, getsnoinfodata, function (res) {
      if (res.data.flag == "1") {
        var rows = JSON.parse(res.data.data.rows)
        console.log("二维码对应信息", res.data)
        if (res.data.msg == '-') {
          that.wetoast.toast({
            title: '该编码还未使用',
            duration: 1000,
          });
          that.setData({
            onesweepaddress: "",
            Id: "",
            Num: ""

          })
        } else if(res.data.msg == '成功查到数据') {
          if (rows.SchoolId == wx.getStorageSync('Unitid')) {
            that.setData({
              onesweepaddress: rows.Address,
              Id: rows.Id,
              Num: rows.Num

            })
          }else{
             that.wetoast.toast({
            title: '非法操作',
            duration: 1000,
          });
          }
        }

      } else if (res.data.flag == "-1") {
        timeout(that, "../../../login/index")
      } else {
        that.wetoast.toast({
          title: "该二维码不存在",
          duration: 1000
        });
      }

    }, function (res) {

    })
  } else {
    that.wetoast.toast({
      title: "请输入七位编码",
      duration: 1000
    });
  }
}
Page({
  data: {
    onesweeptext: "",
    onesweepaddress: "",
    addrId: "",
    Id: "",
    Num: ""
  },
  onLoad: function (options) {
    new app.WeToast()
    wx.removeStorageSync('addrName');
    wx.removeStorageSync('addrId')
  },
  onShow: function (options) {
    var that = this;
    that.setData({
      onesweepaddress: wx.getStorageSync('addrName'),
      addrId: wx.getStorageSync('addrId')
    })
  },
  onesweepinput: function (e) {
    var that = this;
    that.setData({
      onesweeptext: e.detail.value
    })
    //获取地址
    getonesweepData(e.detail.value, that)
  },
  chooseaddress: function (e) {
    wx.navigateTo({
      url: '../../working/address/address'
    })
  },
  submittap: function (e) {
    var that = this;
    var repeataddrdata = {
      Id: that.data.Id,
      AddressId: that.data.addrId,
      AddressName: that.data.onesweepaddress,
      SnoIds: that.data.onesweeptext,
      SessionId: wx.getStorageSync('sessionid')
    };
    if (that.data.onesweeptext == "" || that.data.onesweepaddress == "") {
      that.wetoast.toast({
        title: '请填全选项',
        duration: 1000
      });
    } else {
      requiredata.repeataddr(requireUrl.repeataddrUrl, repeataddrdata, function (res) {
        if (res.data.flag == "1") {
          indexHref(that, "修改成功", "../../working/index")
        } else if (res.data.flag == "-1") {
          timeout(that, "../../login/index")
        } else {
          that.wetoast.toast({
            title: res.data.msg,
            duration: 1000
          });
        }

      }, function (res) {

      })
    }
  },
  //扫码
  onesweep: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log("二维码信息", res.result)
        var scancodename = res.result.substr(-8);
        scancodename = scancodename.replace('/', '');
        console.log(scancodename);
        that.setData({
          onesweeptext: scancodename
        })
      }
    })
    getonesweepData(that.data.onesweeptext, that)
  }
})