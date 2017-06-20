// junfeipage/working/chooseSchool/chooseSchool.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        wxSearchData: [],
        projectid: "",
        schoolsstatus: "",
        UnitTypeid: "",
        isloading: true,
        hasnodata: false
    },

    onLoad: function (options) {
        var that = this;
        console.log(options.schoolsstatus)
        new app.WeToast()
        that.setData({
            projectid: options.projectid,
            schoolsstatus: options.schoolsstatus,
            UnitTypeid: wx.getStorageSync('unittype')
        })

        var chooseSchooldata = {
            key: "",
            projectId: options.projectid,
            sessionId: wx.getStorageSync('sessionid'),
            statuz: options.schoolsstatus
        }
        var getschoolareadata = {
            projectId: options.projectid,
            sessionId: wx.getStorageSync('sessionid'),
            start: "0",
            pageLength: "100"
        }
        //初始化学校搜索列表
        if (that.data.UnitTypeid == "4") {
            requiredata.chooseSchool(requireUrl.chooseSchoolUrl, chooseSchooldata, function (res) {
                if (res.data.flag == "1") {
                    console.log("学校初始列表成功", res.data.data.rows);
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
                    }

                } else if (res.data.flag == "-1") {
                    timeout(that, "../../login/index")
                }

            }, function (res) {
                console.log("失败", res);
            })
        }
        else {
            requiredata.getschoolarea(requireUrl.getschoolareaUrl, getschoolareadata, function (res) {
                if (res.data.flag == "1") {
                    console.log("区县学校名称", res.data);
                    var rows = JSON.parse(res.data.data.rows);
                    if (res.data.data.total == 0) {
                        that.setData({
                            hasnodata: true,
                            isloading: false
                        });
                    } else {
                        that.setData({
                            wxSearchData: rows,
                            isloading: false,
                            hasnodata: false
                        });
                    }
                } else if (res.data.flag == "-1") {
                    timeout(that, "../../login/index")
                }

            }, function (res) {
                console.log("失败", res);
            })
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
        this.setData({
            inputVal: e.detail.value
        });
        var chooseSchooldata = {
            key: that.data.inputVal,
            projectId: that.data.projectid,
            sessionId: wx.getStorageSync('sessionid'),
            statuz: that.data.schoolsstatus
        }
        //调用选择学校接口
        requiredata.chooseSchool(requireUrl.chooseSchoolUrl, chooseSchooldata, function (res) {
            if (res.data.flag == "1") {
                console.log("选择学校成功", chooseSchooldata, res.data.data.rows);
                that.setData({
                    wxSearchData: JSON.parse(res.data.data.rows)
                });
            } else if (res.data.flag == "-1") {
                timeout(that, "../../login/index")
            }

        }, function (res) {
            console.log("失败", res);
        })
    },
    prschooltap: function (event) {
        var that = this;
        console.log("学校单位id", event.currentTarget.dataset.schoolnameid, event.currentTarget.dataset.schoolid)
        var schoolname = event.currentTarget.dataset.schoolname;
        var schoolid = event.currentTarget.dataset.schoolid;//学校里的分项id
        var schoolnameid = event.currentTarget.dataset.schoolnameid//学校单位id
        wx.setStorageSync('schoolnameid', schoolnameid);
        wx.setStorageSync('SchoolName', schoolname);
        wx.setStorageSync('schoolid', schoolid);
        wx.navigateBack({
            delta: 1 // 回退前 delta(默认为1) 页面

        })
    },
    prschoolareatap: function (event) {
        var that = this;
        wx.setStorageSync('schoolareaname', event.currentTarget.dataset.schoolareaname);
        wx.setStorageSync('schoolareaid', event.currentTarget.dataset.schoolareaid);
        wx.navigateBack({
            delta: 1 // 回退前 delta(默认为1) 页面

        })
    }

})