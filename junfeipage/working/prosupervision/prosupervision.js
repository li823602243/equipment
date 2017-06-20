// junfeipage/working/prosupervision/prosupervision.js
var sliderWidth = 40;
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();
function getprolist(isRefresh, that,key) {
    isRefresh = isRefresh || false;
    var prdata = {
        Statuz: that.data.Statuz,
        Start: that.data.Start,
        PageLength: "10",
        SessionId: wx.getStorageSync('sessionid'),
        Key: key
    }

    requiredata.getschoolprojectlist(requireUrl.getschoolprojectlistUrl, prdata, function (res) {
        if (res.data.flag == "1") {
            console.log("成功", res.data)
            var rows = JSON.parse(res.data.data.rows);
            rows.map(function (item) {
                if (item.SurplusDayNum < 0) {
                    item.overdata = Math.abs(item.SurplusDayNum)
                }

            })
            if (rows.length == 0) {
                that.setData({
                    hasnodata: true
                })
            } else {
                that.setData({
                    hasnodata: false
                })

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
            }
        } else if (res.data.flag == "-1") {
            timeout(that, "../../login/index")
        }

    }, function (res) {
        console.log("失败", res.data)
    })


}
function getprootherlist(isRefresh, that,key) {
    isRefresh = isRefresh || false;
    var prdata = {
        Statuz: "-2",
        Start: that.data.Start,
        PageLength: "10",
        SessionId: wx.getStorageSync('sessionid'),
        Key: key,
        isAll: false
    }

    requiredata.getprojectlist(requireUrl.getprojectlistUrl, prdata, function (res) {
        if (res.data.flag == "1") {
            console.log("总项目成功", res.data)
            var rows = JSON.parse(res.data.data.rows);
            rows.map(function (item) {
                if (item.SurplusDayNum < 0) {
                    item.overdata = Math.abs(item.SurplusDayNum)
                }

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
            timeout(that, "../../login/index")
        }

    }, function (res) {
        console.log("失败", res.data)
    })


}
Page({
    data: {
        tabs: [],
        activeIndex: 0,
        sliderOffset: 0,
        slideLeft: 0,
        Statuz: "2",
        Start: 0,
        hasMore: true,
        hasnodata: false,
        hidden: true,
        profilelist: [],
        total: "",
        UnitTypeid: "",
        inputShowed: false,
        inputVal: "",
    },
    onLoad: function () {
        var that = this;
        new app.WeToast()
        var unitid = wx.getStorageSync('unittype')
        that.setData({
            UnitTypeid: wx.getStorageSync('unittype')
        })
        var tabscompany = [{ "name": "实施中", "statuz": "2", num: "" }, { "name": "等待验收", "statuz": "3", num: "" }, { "name": "验收不通过", "statuz": "41", num: "" }, { "name": "审核不通过", "statuz": "121", num: "" }];
        var tabsschool = [{ "name": "实施中", "statuz": "2", num: "" }, { "name": "等待验收", "statuz": "3", num: "" }, { "name": "验收通过", "statuz": "4", num: "" }, { "name": "验收不通过", "statuz": "41", num: "" }]
        var tabarea = [{ "name": "全部", "statuz": "-2", num: "" }, { "name": "实施中", "statuz": "2", num: "" }, { "name": "等待验收", "statuz": "3", num: "" }, { "name": "验收通过", "statuz": "4", num: "" }, { "name": "等待审核", "statuz": "11", num: "" }]
        if (unitid == 3) {
            that.setData({
                tabs: tabsschool
            })
        } else if (unitid == 4) {
            that.setData({
                tabs: tabscompany
            })
        }
        else if (unitid == 1 || unitid == 2) {
            that.setData({
                tabs: tabarea
            })
        }
        if (that.data.tabs) {
            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                        sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                    });
                }
            });
            requiredata.numstatistics(requireUrl.numstatisticsUrl, wx.getStorageSync('sessionid'), function (res) {
                console.log("num成功", res.data);
                JSON.parse(res.data.data.rows).map(function (item) {
                    for (var i = 0; i < that.data.tabs.length; i++) {
                        if (that.data.tabs[i].statuz == item.Statuz) {
                            that.data.tabs[i].num = item.Num
                        }
                    }


                })
                that.setData({
                    tabs: that.data.tabs
                })
                console.log(that.data.tabs)
            }, function (res) {
                console.log("失败", res);
            })
        }
        //初始化数据
        if (unitid == 3) {
            getprolist(false, that,"");
        } else {
            that.setData({
                Statuz: "-2"
            })
            getprootherlist(false, that,"");
        }
    },
    tabClick: function (e) {
        var that = this;
        console.log("status11111", e.currentTarget.dataset.statuz)
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
            Statuz: e.currentTarget.dataset.statuz,
            Start: 0,
            profilelist: "",
            hidden: true
        });
        //点击切换tab数据
        if (e.currentTarget.dataset.statuz == "-2") {
            getprootherlist(false, that,"");
        } else {
            getprolist(false, that,"");
        }

    },
    onPullDownRefresh: function () {
        //下拉刷新
        var that = this;
        that.setData({
            Start: 0,
            hidden: true
        })
        if (that.data.Statuz == "-2") {
            getprootherlist(true, that,"");
        } else {
            getprolist(true, that,"");
        }
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
            if (that.data.Statuz == "-2") {
                getprootherlist(false, that,"");
            } else {
                getprolist(false, that,"");
            }


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
      Start:0
    });
    
    if (that.data.Statuz == "-2") {
            getprootherlist(false, that,that.data.inputVal);
    } else {
          getprolist(false, that,that.data.inputVal);
    } 
  },
    //点击查看
    projectrectap: function (e) {
        console.log(e.currentTarget.dataset.profileid)
        wx.navigateTo({
            url: 'supervisionlist/supervisionlist?profileid=' + e.currentTarget.dataset.profileid

        })

    },
    proaccepttap: function (event) {
        var pritemid = event.currentTarget.dataset.pritemid;
        console.log(pritemid);
        var projectid = event.currentTarget.dataset.projectid;
        wx.navigateTo({
            url: 'supervisiondetail/supervisiondetail?pritemid=' + pritemid + '&projectid=' + projectid
        })
    }
});