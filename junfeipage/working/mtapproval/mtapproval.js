// junfeipage/working/mtapproval/mtapproval.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const getStatuz = require('../../../utils/util.js').getStatuz;
let app = getApp();

//学校 
function getschoolData(isRefresh, that) {
  isRefresh = isRefresh || false;
  var param = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: '',
  }
  requiredata.getmtapproval(requireUrl.mtapprovalUrl, param, function (res) {
    console.log("11", res.data)
    if (res.data.flag == "-1") {
      that.wetoast.toast({
        title: '登录超时',
        duration: 1000,
        success(data) {
          wx.redirectTo({
            url: '../../startup/index'
          })
        }
      });
    } else if (res.data.flag == 1) {
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
          list: rows,
          total: res.data.data.total
        })
      }
      else {
        console.log('加载' + res.data)
        that.setData({
          list: that.data.list.concat(rows),
          total: res.data.data.total
        })
      }

      that.setData({
        start: that.data.start + 10
      })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
    }else if(res.data.flag==0){
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000,
      });
    }
  }, function (res) {

  })
}

//区县
function getcountyData(isRefresh, that) {
  isRefresh = isRefresh || false;
  var param = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: '',
  }
  requiredata.getcountyapproval(requireUrl.countyapprovalUrl, param, function (res) {
    console.log("11", res.data)
    if (res.data.flag == "-1") {
      that.wetoast.toast({
        title: '登录超时',
        duration: 1000,
        success(data) {
          wx.redirectTo({
            url: '../../startup/index'
          })
        }
      });
    } else if (res.data.flag == 1) {
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
          list: rows,
          total: res.data.data.total
        })
      }
      else {
        console.log('加载' + res.data)
        that.setData({
          list: that.data.list.concat(rows),
          total: res.data.data.total
        })
      }

      that.setData({
        start: that.data.start + 10
      })
      if (isRefresh) {
        wx.stopPullDownRefresh()
      }
    }else if(res.data.flag==0){
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000,
      });
    }
  }, function (res) {

  })
}


Page({
  data: {
    list: [],
    unitid: '',
    nodata: false,
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      unitid: wx.getStorageSync('unittype')
    })
    if (that.data.unitid == 3) {
      getschoolData(false, that);
    } else if (that.data.unitid == 2) {
      getcountyData(false, that);
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
  gotoDetail: function (e) {
    var param = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'mtapprovalDetail/mtapprovalDetail?param=' + param,
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
    if (that.data.unitid == 3) {
      getschoolData(false, that);
    } else if (that.data.unitid == 2) {
      getcountyData(false, that);
    }
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    console.log(that.data.start, that.data.list.length)
    if (that.data.total == that.data.list.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      if (that.data.unitid == 3) {
        getschoolData(false, that);
      } else if (that.data.unitid == 2) {
        getcountyData(false, that);
      }

    }
  },
})