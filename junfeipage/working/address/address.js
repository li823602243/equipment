// junfeipage/working/address/address.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
function chooseaddress(that, parentId, sucess) {
  var getAddressData = {
    parentId: parentId,
    sessionId: wx.getStorageSync('sessionid')
  }
  requiredata.getAddress(requireUrl.getAddressUrl, getAddressData, function (res) {
    sucess(res)
  }, function (res) {
    console.log("失败", res);
  })
}
//企业
function companyaddr(that, parentId, schoolId, sucess) {
  var getBarcodeAddressData = {
    parentId: parentId,
    sessionId: wx.getStorageSync('sessionid'),
    schoolId: schoolId
  }
  requiredata.getBarcodeAddress(requireUrl.getBarcodeAddressUrl, getBarcodeAddressData, function (res) {
    sucess(res)
  }, function (res) {
    console.log("失败", res);
  })
}
Page({
  data: {
    pid: 0,
    list: '',
    subAddr: '',
    UnitTypeid: "",
    schoolnameid: "",
    activeIndex:"-1",
    activerightIndex:"-1"
  },
  onLoad: function (options) {
    var that = this;
    console.log(options.schoolnameid)
    that.setData({
      UnitTypeid: wx.getStorageSync('unittype'),
      schoolnameid: options.schoolnameid
    })
    if (that.data.UnitTypeid == "4") {
      companyaddr(that, that.data.pid, that.data.schoolnameid, function (res) {
       console.log("企业",res.data.data)
        that.setData({
          list: JSON.parse(res.data.data.rows)
        })
      })
    } else {
      chooseaddress(that, that.data.pid, function (res) {
        console.log("学校",res.data.data)
        that.setData({
          list: JSON.parse(res.data.data.rows)
        })
      })
    }

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
  getsubAddr: function (e) {
    var that = this;
    that.setData({
      activeIndex:e.currentTarget.dataset.index
    })
    if (that.data.UnitTypeid == "4") {
      companyaddr(that, e.currentTarget.dataset.addrid, that.data.schoolnameid, function (res) {
        console.log("企业",res.data.data)
        that.setData({
          subAddr: JSON.parse(res.data.data.rows)
        })
      })
    } else {
      chooseaddress(that, e.currentTarget.dataset.addrid, function (res) {
        console.log("学校",res.data.data)
        that.setData({
          subAddr: JSON.parse(res.data.data.rows)
        })
      })
    }

  },
  chooseAddr: function (e) {
    var that=this;
     that.setData({
      activerightIndex:e.currentTarget.dataset.index
    })
    wx.setStorageSync('addrName', e.currentTarget.dataset.addrname);
    wx.setStorageSync('addrId', e.currentTarget.dataset.addrsubid)
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  },
  hasOther:function(e){
     wx.setStorageSync('otheraddress', '其他')
      wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
    })
  }
})