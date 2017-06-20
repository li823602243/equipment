// junfeipage/working/myrepair/myrepair.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const getStatuz = require('../../../utils/util.js').getStatuz;

var sliderWidth = 40;


//学校
function getListbyschool(isRefresh, that, key) {
  isRefresh = isRefresh || false;
  var param = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: key,
    statuz: that.data.statuz,
    callType:1
  }
  requiredata.getmtlist(requireUrl.repairviewUrl, param, function (res) {
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
      for (var i = 0; i < rows.length; i++) {
        rows[i].Statuz = getStatuz(rows[i].Statuz, rows[i].CompanyName);
        if (rows[i].CompanyName == '') {
          rows[i].CompanyName = '校内'
        }
      }
      if (rows.length == 0) {
        that.setData({
          hasnodata: true
        })
      } else {
        that.setData({
          hasnodata: false
        })

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
      }
    } else if (res.data.flag == 0) {
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000,
      });
    }
  }, function (res) {

  })
}

//企业
function getListbycompany(isRefresh, that , key) {
  isRefresh = isRefresh || false;
  var param = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: key,
    statuz: that.data.statuz
  }
  requiredata.getmtlist(requireUrl.bussreslistUrl, param, function (res) {
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
      for (var i = 0; i < rows.length; i++) {
        rows[i].Statuz = getStatuz(rows[i].Statuz, rows[i].CompanyName);
      }
      if (rows.length == 0) {
        that.setData({
          hasnodata: true
        })
      } else {
        that.setData({
          hasnodata: false
        })

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
      }
    } else if (res.data.flag == 0) {
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000,
      });
    }
  }, function (res) {

  })
}


//区县市级
function getListbytown(isRefresh, that , key) {
  isRefresh = isRefresh || false;
  var param = {
    start: that.data.start,
    pageLength: 10,
    sessionId: wx.getStorageSync('sessionid'),
    key: key,
    statuz: that.data.statuz
  }
  requiredata.getmtlist(requireUrl.countymtviewUrl, param, function (res) {
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
      for (var i = 0; i < rows.length; i++) {
        rows[i].Statuz = getStatuz(rows[i].Statuz, rows[i].CompanyName);
      }
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
    } else if (res.data.flag == 0) {
      that.wetoast.toast({
        title: res.data.msg,
        duration: 1000,
      });
    }
  }, function (res) {

  })
}



function getTabs(that) {
  wx.request({
    url: requireUrl.mtviewNumUrl,
    data: {
      sessionid: wx.getStorageSync('sessionid')
    },
    method: 'POST',
    success: function (res) {
      var maplist = JSON.parse(res.data.data.rows);
      if (that.data.unitid == 3) {
        maplist.splice(3, 1)
        that.setData({
          schooltabs: maplist
        })
      } else {
        that.setData({
          busstabs: maplist
        })
      }
      console.log(that.data.schooltabs);
    }
  })
}

Page({
  data: {
    schooltabs: [],
    busstabs: [],
    list: [],
    activeIndex: 0,
    sliderOffset: 0,
    slideLeft: 0,
    unitid: '',
    nodata: false,
    start: 0,
    total: "",
    hasMore: true,
    hasnodata: false,
    hidden: true,
    statuz: '',
    inputShowed: false,
    inputVal: "",
  },
  onLoad: function () {
    var that = this;
    that.setData({
      unitid: wx.getStorageSync('unittype')
    })
    getTabs(that);
    wx.getSystemInfo({
      success: function (res) {
        if (that.data.unitid == 3) {
          that.setData({
            sliderLeft: (res.windowWidth / 3 - sliderWidth) / 2,
            sliderOffset: res.windowWidth / 3 * that.data.activeIndex,
            statuz: 10
          });
        } else if (that.data.unitid == 4) {
          that.setData({
            sliderLeft: (res.windowWidth / 4 - sliderWidth) / 2,
            sliderOffset: res.windowWidth / 4 * that.data.activeIndex,
            statuz: 40
          });
        } else if (that.data.unitid == 2 || that.data.unitid == 1) {
          that.setData({
            sliderLeft: (res.windowWidth / 3 - sliderWidth) / 2,
            sliderOffset: res.windowWidth / 3 * that.data.activeIndex,
            statuz: 40
          });
        }
      }
    });

    if (that.data.unitid == 3) {
      getListbyschool(false, that,that.data.inputVal);
    } else if (that.data.unitid == 4) {
      getListbycompany(false, that,that.data.inputVal);
    } else if (that.data.unitid == 2 || that.data.unitid == 1) {
      getListbytown(false, that,that.data.inputVal);
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
  tabClick: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.statuz);
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      statuz: e.currentTarget.dataset.statuz,
      inputShowed: false,
      inputVal: "",
      list: [],
      start: 0,
      hidden: true
    });
    if (that.data.unitid == 3) {
      getListbyschool(false, that,that.data.inputVal);
    } else if (that.data.unitid == 4) {
      getListbycompany(false, that,that.data.inputVal);
    } else if (that.data.unitid == 2 || that.data.unitid == 1) {
      getListbytown(false, that,that.data.inputVal);
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  searchconfirm: function (e) {
    var that = this;
    // var sessionId = wx.getStorageSync('sessionid');//本地取存储的sessionID
    that.setData({
      inputVal: e.detail.value,
      start:0
    });
    
    if (that.data.unitid == 3) {
      getListbyschool(false, that,that.data.inputVal);
    } else if (that.data.unitid == 4) {
      getListbycompany(false, that,that.data.inputVal);
    } else if (that.data.unitid == 2 || that.data.unitid == 1) {
      getListbytown(false, that,that.data.inputVal);
    }
  },
  gotoDetail: function (e) {
    var param = e.currentTarget.dataset.id;
    var statuz = this.data.statuz;
    console.log(param + '...' + statuz);
    wx.redirectTo({
      url: '../RepiarDetail/RepiarDetail?param=' + param + '&statuz=' + statuz,
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
      getListbyschool(false, that,that.data.inputVal);
    } else if (that.data.unitid == 4) {
      getListbycompany(false, that,that.data.inputVal);
    } else if (that.data.unitid == 2 || that.data.unitid == 1) {
      getListbytown(false, that,that.data.inputVal);
    }

  },
  onReachBottom: function () {
    //上拉加载
    var that = this;
    that.setData({
      hidden: false,
      start: that.data.start
    })
    var param = {
      start: that.data.start,
      pageLength: 10,
      key: '',
      sessionid: wx.getStorageSync('sessionid'),
      statuz: that.data.statuz
    }
    console.log(that.data.start, that.data.list.length)
    if (that.data.total == that.data.list.length) {
      that.setData({
        hasMore: false
      })
      return;
    } else {
      //加载数据
      if (that.data.unitid == 3) {
        getListbyschool(false, that,that.data.inputVal);
      } else if (that.data.unitid == 4) {
        getListbycompany(false, that,that.data.inputVal);
      } else if (that.data.unitid == 2 || that.data.unitid == 1) {
        getListbytown(false, that,that.data.inputVal);
      }

    }
  },
})