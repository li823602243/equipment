// 选择项目编号
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
let app = getApp();
function chooseCompanyNum(key, that) {
    var sessionId = wx.getStorageSync('sessionid');//本地取存储的sessionID
    requiredata.chooseproNum(requireUrl.projectnumUrl, key, sessionId, function (res) {
        if (res.data.flag == "-1") {
            that.wetoast.toast({
                title: '登录超时请重新登录',
                duration: 1000,
                success(data) {
                    wx.redirectTo({
                        url: '../../login/index'
                    })
                }
            });

        } else if (res.data.flag == "1") {
            if (res.data.data.total == 0) {
                that.setData({
                    hasnodata: true,
                    isloading: false
                });
            } else {
                that.setData({
                    wxSearchData: JSON.parse(res.data.data.rows),
                    isloading: false,
                     hasnodata: false
                });
                console.log("1项目编号的数据", res.data);
            }


        } else {
            that.wetoast.toast({
                title: res.data.msg,
                duration: 1000
            });
        }

    }, function (res) {
        console.log("失败", res);
    })
}
function projectcodelist(key, that) {
    var codelistdata = {
        start: 0,
        pageLength: 100,
        sessionId: wx.getStorageSync('sessionid'),
        key: key
    }
    requiredata.getprojectcodelist(requireUrl.codelistUrl, codelistdata, function (res) {
        if (res.data.flag == "-1") {
            that.wetoast.toast({
                title: '登录超时请重新登录',
                duration: 1000,
                success(data) {
                    wx.redirectTo({
                        url: '../../login/index'
                    })
                }
            });

        } else if (res.data.flag == "1") {
            if (res.data.data.total == 0) {
                that.setData({
                    hasnodata: true,
                    isloading: false
                });
            } else {
                that.setData({
                    wxSearchData: JSON.parse(res.data.data.rows),
                    isloading: false,
                    hasnodata: false
                });
                console.log("2项目编号的初始化数据", res.data);
            }

        }

    }, function (res) {
        console.log("失败", res);
    })
}
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        wxSearchData: [],
        UnitTypeid: "",
        isloading: true,
        hasnodata: false
    },

    onLoad: function (options) {
        new app.WeToast()
        var that = this;
        wx.removeStorageSync('SchoolName');
        wx.removeStorageSync('schoolareaname');

        that.setData({
            UnitTypeid: wx.getStorageSync('unittype')
        })



        //初始化搜索列表
        if (that.data.UnitTypeid == "4") {
            chooseCompanyNum("", that)
        } else {
            projectcodelist("", that)
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
    prnumtap: function (event) {
        var that = this;
        var num = event.currentTarget.dataset.num;
        var listid = event.currentTarget.dataset.listid;
        var name = event.currentTarget.dataset.name;
        console.log(event.currentTarget);
        wx.setStorageSync('projectnum', num);
        wx.setStorageSync('projectname', name);
        wx.setStorageSync('projectid', listid);
        wx.navigateBack({
            delta: 1 // 回退前 delta(默认为1) 页面

        })

    },
    searchconfirm: function (e) {
        var that = this;
        var sessionId = wx.getStorageSync('sessionid');//本地取存储的sessionID
        that.setData({
            inputVal: e.detail.value
        });
        //调用选择项目编号接口
        if (that.data.UnitTypeid == "4") {
            chooseCompanyNum(that.data.inputVal, that)
        } else {
            console.log(that.data.inputVal)
            projectcodelist(that.data.inputVal, that)
        }

    }

})