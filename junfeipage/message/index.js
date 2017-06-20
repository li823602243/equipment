// junfeipage/message/index.js
const requiredata = require('../../utils/util.js').request_data;
const requireUrl = require('../../config.js');
const timeout = require('../../utils/util.js').timeout;
let app = getApp();
function messageData(isRefresh, that) {
  isRefresh = isRefresh || false;
  var getmessagelistdata = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: "",
  }
  requiredata.getmessagelist(requireUrl.getmessagelistUrl, getmessagelistdata, function (res) {
    console.log("message", res.data)
    if (res.data.flag == "-1") {
      that.wetoast.toast({
        title: '登录超时',
        duration: 1000,
        success(data) {
          wx.redirectTo({
            url: '../login/index'
          })
        }
      });
    } else if (res.data.flag == "1") {
      var rows = JSON.parse(res.data.data.rows);
      that.setData({
          isloading: false
      })
      if (rows.length == 0) {
        that.setData({
          hasnodata: true,
          hidden: true
        })
      } else {
        that.setData({
          hasnodata: false
        })

        if (that.data.start == 0) {
          that.setData({
            messagelist: rows,
            total: res.data.data.total
           
          })
        }
        else {
          that.setData({
            messagelist: that.data.messagelist.concat(rows),
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
    } else {
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000
      });
    }

  }, function (res) {
    console.log("失败", res.data)
    that.wetoast.toast({
      title: '加载失败',
      duration: 1000,
      success(data) {
        wx.redirectTo({
          url: '../login/index'
        })
      }
    });
  })
}
Page({
  data: {
    messagelist: [],
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
    ishidden: false,
    touch_end: "",
    touch_start: "",
    isloading: true

  },
  onShow: function () {
    var that = this;
    new app.WeToast()
    that.setData({
      start:0
    })
    messageData(false, that);
  },
  onPullDownRefresh: function () {
    //下拉刷新
    var that = this;
    that.setData({
      start: 0,
      hidden: true,
      hasMore: true
    })
    messageData(true, that);
  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    console.log(that.data.start, that.data.messagelist.length)
    if (that.data.total == that.data.messagelist.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      messageData(false, that);

    }
  },
  deletemessage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var hrefurl = e.currentTarget.dataset.url;
    var deletemessagedata = {
      Id: e.currentTarget.dataset.id,
      SessionId: wx.getStorageSync('sessionid'),

    }
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    if (touchTime > 350) {
      wx.showModal({
        title: '提示',
        content: '是否删除该消息',
        success: function (res) {
          var messagelist = that.data.messagelist;
          if (res.confirm) {
            requiredata.deletemessage(requireUrl.deletemessageUrl, deletemessagedata, function (res) {
              console.log("删除", res.data)
              if (res.data.flag == "1") {
                console.log("33333", index)
                messagelist.splice(index, 1);
                that.setData({
                  messagelist: messagelist
                })
                that.wetoast.toast({
                  title: '删除成功',
                  duration: 1000
                });
              } else if (res.data.flag == "-1") {
                timeout(that, "../login/index")
              } else {
                that.wetoast.toast({
                  title: res.data.msg,
                  duration: 1000
                });
              }

            }, function (res) {

            })

          }

        }
      })
    } else {
      console.log("2222", hrefurl)
      var setreaddata = {
        Id: id,
        SessionId: wx.getStorageSync('sessionid'),
      }
      if (that.data.messagelist[index].Statuz == 0) {
        requiredata.setread(requireUrl.setreadUrl, setreaddata, function (res) {
          console.log("状态", setreaddata, res.data)
          if (res.data.flag == "1") {
            that.data.messagelist[index].Statuz = 1;
            that.setData({
              messagelist: that.data.messagelist
            })
          } else if (res.data.flag == "-1") {
            timeout(that, "../login/index")
          } else {
            that.wetoast.toast({
              title: res.data.msg,
              duration: 1000
            });
          }

        }, function (res) {

        })
      }
      if (hrefurl) {
        wx.navigateTo({
          url: '../../' + hrefurl
        })

      }
    }

  },
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  }


})