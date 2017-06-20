// junfeipage/working/projectrec/projectrec.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const getStatuzPerson = require('../../../utils/util.js').getStatuzPerson;
const getproStatuz = require('../../../utils/util.js').getproStatuz;
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();
function getprojetrec(isRefresh, that) {
  isRefresh = isRefresh || false;
  var projectrecdata = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: ""
  }
  requiredata.projectrec(requireUrl.projectrecUrl, projectrecdata, function (res) {
    if (res.data.flag == "1") {
      console.log("整改信息", res.data)
      var rows = JSON.parse(res.data.data.rows);
      if (rows.length == 0) {
        that.setData({
          hasnodata: true
        })
      } else {
        that.setData({
          hasnodata: false
        })

        rows.map(function (item) {
          //item.UnitType = getStatuzPerson(item.UnitType);
          item.Statuz = getproStatuz(item.Statuz);

        })
        if (that.data.start == 0) {
          that.setData({
            projectrecList: rows,
            total: res.data.data.total
          })
        }
        else {
          that.setData({
            projectrecList: that.data.projectrecList.concat(rows),
            total: res.data.data.total
          })
        }

        that.setData({
          start: that.data.start + 10
        })
        if (isRefresh) {
          wx.stopPullDownRefresh()
        }
      }
    } else if (res.data.flag == "-1") {
      timeout(that, "../../login/index")
    }
  }, function (res) {

  })
}
Page({
  data: {
    projectrecList: [],
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
    ishidden: false,
    UnitTypeid: ""
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      UnitTypeid: wx.getStorageSync('unittype')
    })
    getprojetrec(false, that);
  },
  //创建项目整改
  creatprorecTap: function (e) {
    wx.navigateTo({
      url: 'creatprorec/creatprorec'
    })
  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    getprojetrec(true, that);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    console.log(that.data.start, that.data.projectrecList.length)
    if (that.data.total == that.data.projectrecList.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      getprojetrec(false, that);

    }
  },
  projectrectap: function (e) {
    wx.navigateTo({
      url: 'projectrecdetail/projectrecdetail?recid=' + e.currentTarget.dataset.recid
    })
  },
  projectrecdlistTap: function (e) {
    wx.navigateTo({
      url: 'projectrecdlist/projectrecdlist?recid=' + e.currentTarget.dataset.recid + '&statuz=' + e.currentTarget.dataset.statuz
    })
  }
})