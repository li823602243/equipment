// junfeipage/working/prosupervision/supervisionlist/supervisionlist.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const timeout = require('../../../../utils/util.js').timeout;
const getprofileStatuz = require('../../../../utils/util.js').getprofileStatuz;
let app = getApp();
function getprolist(isRefresh, that) {
  isRefresh = isRefresh || false;
  var prdata = {
    Statuz: "-2",
    Start: that.data.Start,
    PageLength: "10",
    SessionId: wx.getStorageSync('sessionid'),
    Key: "",
    ProjectId: that.data.profileid
  }

  requiredata.getschoolprojectlist(requireUrl.getschoolprojectlistUrl, prdata, function (res) {
    if (res.data.flag == "1") {
      console.log("成功", res.data)
      var rows = JSON.parse(res.data.data.rows);
      rows.map(function (item) {
        if (item.SurplusDayNum < 0) {
          item.overdata = Math.abs(item.SurplusDayNum)
        }

        item.Statuz = getprofileStatuz(item.Statuz)
      })
      if (rows.length == 0) {
        that.setData({
          hasnodata: true
        })
      } else {
        that.setData({
          hasnodata: false
        })
      }
      if (that.data.Start == 0) {
        that.setData({
          profilelist: rows,
          total: res.data.data.total
        })
      }
      else {
        that.setData({
          profilelist: that.data.profilelist.concat(rows),
          total: res.data.data.total
        })
      }
      that.setData({
        Start: that.data.Start + 10
      })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
    } else if (res.data.flag == "-1") {
      timeout(that, "../../../login/index")
    }

  }, function (res) {
    console.log("失败", res.data)
  })


}
Page({
  data: {
    profilelist: [],
    profileid: "",
    Statuz: "",
    Start: 0,
    hasMore: true,
    hasnodata: false,
    hidden: true,
    total: ""
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      profileid: options.profileid
    })
    console.log(options.profileid)
    getprolist(false, that);
  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      Start: 0,
      hidden: true
    })
    getprolist(true, that);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      hasMore: true,
      pagenum: that.data.pagenum + 1,
      Start: that.data.Start
    })
    console.log(that.data.Start, that.data.profilelist.length)
    if (that.data.total == that.data.profilelist.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      getprolist(false, that);

    }
  },
  proaccepttap: function (event) {
    var pritemid = event.currentTarget.dataset.pritemid;
    var projectid = event.currentTarget.dataset.projectid;
    console.log("分项id", pritemid);
    console.log("项目id", projectid);
    wx.navigateTo({
      url: '../supervisiondetail/supervisiondetail?pritemid=' + pritemid + '&projectid=' + projectid
    })
  }
})
