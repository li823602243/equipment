// junfeipage/working/Projectaudit/Projectaudit.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
let app = getApp();
function proacceptData(isRefresh, that,UnitTypeid) {
  isRefresh = isRefresh || false;
  if(UnitTypeid==1){
  var  ContractsObjectType=1;
  }else if(UnitTypeid==2){
  var  ContractsObjectType=2;
  }
  var proacceptdata = {
    Statuz: "11",
    SessionId: wx.getStorageSync('sessionid'),
    Start: that.data.start,
    PageLength: "10",
    Key: "",
    ContractsObjectType:ContractsObjectType
  }
  requiredata.getschoolprojectlist(requireUrl.getschoolprojectlistUrl, proacceptdata, function (res) {
    console.log("项目审核",proacceptdata,res.data)
    if (res.data.flag == "1") {
      var rows = JSON.parse(res.data.data.rows);
      if (rows.length == 0) {
        that.setData({
          hasnodata: true
        })
      } else {
        that.setData({
          hasnodata: false
        })
      }
      if (that.data.start == 0) {
        that.setData({
          proacceptlist: rows,
          total: res.data.data.total
        })
      }
      else {
        that.setData({
          proacceptlist: that.data.proacceptlist.concat(rows),
          total: res.data.data.total
        })
      }

      that.setData({
        start: that.data.start + 10
      })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
    } else if (res.data.flag == "-1") {
      that.wetoast.toast({
        title: '登录超时',
        duration: 1000,
        success(data) {
          wx.redirectTo({
            url: '../../login/index'
          })
        }
      });
    } else {

    }

  }, function (res) {

  })
}
Page({
  data: {
    proacceptlist: [],
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
    ishidden: false,
    UnitTypeid:""
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      UnitTypeid: wx.getStorageSync('unittype')
    })
    proacceptData(false, that,that.data.UnitTypeid);

  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    proacceptData(true, that,that.data.UnitTypeid);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    console.log(that.data.start, that.data.proacceptlist.length)
    if (that.data.total == that.data.proacceptlist.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据proacceptData
      proacceptData(false, that,that.data.UnitTypeid);

    }
  },
  proaccepttap: function (event) {
    var pritemid = event.currentTarget.dataset.pritemid;
    var projectid = event.currentTarget.dataset.projectid;
    console.log(pritemid);
    wx.navigateTo({
      url: 'Projectauditdetail/Projectauditdetail?pritemid=' + pritemid + '&projectid=' + projectid
    })
  }
})