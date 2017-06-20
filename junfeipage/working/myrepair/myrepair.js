// junfeipage/working/mtview/mtview.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const getStatuz = require('../../../utils/util.js').getStatuz;


let app = getApp();
var Start = 10;

function getlist(that) {
  var param = {
    Start: 0,
    PageLength: 10,
    key: '',
    SessionId: wx.getStorageSync('sessionid')
  }
  var repairUrl;
  if (that.data.unitid == 3) {
    requiredata.getmtreplist(requireUrl.schoolrepUrl, param, function (res) {
      if (res.data.flag == 1) {
        var maplist = JSON.parse(res.data.data.rows);
        if (maplist.length == 0) {
          that.setData({
            nodata: true
          })
        } else {
          for (var i = 0; i < maplist.length; i++) {
            maplist[i].Statuz = getStatuz(maplist[i].Statuz, maplist[i].CompanyName);
            if (maplist[i].CompanyName == '') {
              maplist[i].CompanyName = '校内'
            }
          }
          that.setData({
            list: maplist,
            total: res.data.data.total,
            nodata: false
          })
        }
        console.log(that.data.list)
        Start = 10;
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
    }, function (res) {
      console.log("失败", res);
    })
  } else if (that.data.unitid == 4) {
    requiredata.getmtreplist(requireUrl.bussmyrepUrl, param, function (res) {
      if (res.data.flag == 1) {
        console.log(res)
        var maplist = JSON.parse(res.data.data.rows);
        console.log(maplist);
        for (var i = 0; i < maplist.length; i++) {
          maplist[i].Statuz = getStatuz(maplist[i].Statuz, maplist[i].CompanyName);
          if (maplist[i].CompanyName == '') {
            maplist[i].CompanyName = '校内'
          }
        }
        that.setData({
          list: maplist,
          total: res.data.data.total
        })
        Start = 10;
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
    }, function (res) {
      console.log("失败", res);
    })
  }
}

Page({
  data: {
    list: '',
    unitid: '',
    nodata: false,
    hidden: true,
    hasMore: true,
    total: ''
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      unitid: wx.getStorageSync('unittype')
    })
    getlist(that);
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
    Start = 10;
  },
  // gotoDetail: function (e) {
  //   var statuz = e.currentTarget.dataset.statuz;
  //   var param = e.currentTarget.dataset.id;
  //   var devicecodeid = e.currentTarget.dataset.devicecodeid

  //   if (statuz == '学校自修中' || statuz == '企业维修中' || statuz == '学校验收不通过') {
  //     wx.navigateTo({
  //       url: 'myrepairDetail/myrepairDetail?param=' + param + '&devicecodeid=' + devicecodeid,
  //     })
  //   } else if (statuz == '校长审批不通过') {
  //     wx.navigateTo({
  //       url: '../enterpriserepair/enterpriserepair?editid=' + e.currentTarget.dataset.id,
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '../RepiarDetail/RepiarDetail?param=' + param,
  //     })
  //   }

  // },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      hasMore: true
    })
    getlist(that);
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    var that = this;
    that.setData({
      hidden: false
    })
    var param = {
      Start: Start,
      PageLength: 10,
      key: '',
      SessionId: wx.getStorageSync('sessionid')
    }
    var repairUrl;
    if (that.data.unitid == 3) {
      requiredata.getmtreplist(requireUrl.schoolrepUrl, param, function (res) {
        console.log(res)
        var maplist = JSON.parse(res.data.data.rows);
        console.log(maplist);
        for (var i = 0; i < maplist.length; i++) {
          maplist[i].Statuz = getStatuz(maplist[i].Statuz, maplist[i].CompanyName);
          if (maplist[i].CompanyName == '') {
            maplist[i].CompanyName = '校内'
          }
        }
        that.setData({
          list: that.data.list.concat(maplist),
        })
        if (that.data.list.length == that.data.total) {
          console.log('没有更多数据了');
          that.setData({
            hasMore: false
          })
        }
        Start += 10;
      }, function (res) {
        console.log("失败", res);
      })
    } else if (that.data.unitid == 4) {
      requiredata.getmtreplist(requireUrl.bussmyrepUrl, param, function (res) {
        console.log(res)
        var maplist = JSON.parse(res.data.data.rows);
        console.log(maplist);
        for (var i = 0; i < maplist.length; i++) {
          maplist[i].Statuz = getStatuz(maplist[i].Statuz, maplist[i].CompanyName);
          if (maplist[i].CompanyName == '') {
            maplist[i].CompanyName = '校内'
          }
        }
        that.setData({
          list: that.data.list.concat(maplist),
        })
        if (that.data.list.length == that.data.total) {
          console.log('没有更多数据了');
          that.setData({
            hasMore: false
          })
        }
        Start += 10;
      }, function (res) {
        console.log("失败", res);
      })
    }
  },
  //修改报修单（转报审批不通过）
  gotoEdit: function (e) {
    if (e.currentTarget.dataset.statuz == '校长审批不通过') {
      wx.navigateTo({
        url: '../enterpriserepair/enterpriserepair?param=' + e.currentTarget.dataset.id + '&role=1' + '&pass=22',
      })
    } else {
      wx.navigateTo({
        url: '../enterpriserepair/enterpriserepair?param=' + e.currentTarget.dataset.id + '&role=1',
      })
    }

  },
  //查看详情
  gotoDetail: function (e) {
    var param = e.currentTarget.dataset.id;
    var statuz = e.currentTarget.dataset.statuz;
    wx.navigateTo({
      url: '../RepiarDetail/RepiarDetail?param=' + param + '&statuz=' + statuz,
    })
  },
  //填写维修单
  editMtreport: function (e) {
    var param = e.currentTarget.dataset.id;
    var devicecodeid = e.currentTarget.dataset.devicecodeid;
    if (e.currentTarget.dataset.statuz == '学校验收不通过') {
      wx.navigateTo({
        url: 'myrepairDetail/myrepairDetail?param=' + param +'&pass=61',
      })
    } else {
      wx.navigateTo({
        url: 'myrepairDetail/myrepairDetail?param=' + param,
      })
    }


  }
})