// junfeipage/working/prosupervision/supervisiondetail/supervisiondetail.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const indexHref = require('../../../../utils/util.js').indexHref;
const timeout = require('../../../../utils/util.js').timeout;
let app = getApp();
function getimgList(objId, moduleId, category, sucess) {
  var getattachmentlistdata = {
    objId: objId,
    moduleId: moduleId,
    sessionId: wx.getStorageSync('sessionid'),
    category: category
  }
  requiredata.getattachmentlist(requireUrl.getattachmentlistUrl, getattachmentlistdata, function (res) {
    sucess(res)
  },
    function (res) {

    })
}
Page({
  data: {
    list: '',
    show: [true, false, false, false, false],
    checked: '',
    id: '',
    attachmentList: [],
    imglist: [],
    prodate: "",
    overdate: true,
    pritemid: "",
    UnitTypeid: "",
    projectid: "",
    rountlist: [],
    tenderList: [],
    tenderimglist: [],
    settleList: [],
    settleimglist: [],
    hasnodata: false,
    hasnofile:false
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    console.log("分项id", options.pritemid)
    console.log("id", options.projectid)
    that.setData({
      pritemid: options.pritemid,
      UnitTypeid: wx.getStorageSync('unittype'),
      projectid: options.projectid
    })

    //过程材料
    getimgList(that.data.pritemid, "3", "0", function (res) {
      console.log("附件列表数据", res.data)
      var rows = JSON.parse(res.data.data.rows);
      rows.map(function (item) {
        item.PathList.map(function (i) {
          that.data.imglist.push("https://wx.demo.cneefix.com" + i.Path)
        })
      })

      that.setData({
        attachmentList: rows,
        imglist: that.data.imglist
      })
      console.log(that.data.attachmentList)
    })
    getimgList(that.data.projectid, "1", "0", function (res) {
      console.log("招标文件附件列表数据", res.data)
      var rows = JSON.parse(res.data.data.rows);
      rows.map(function (item) {
        item.PathList.map(function (i) {
          that.data.tenderimglist.push("https://wx.demo.cneefix.com" + i.Path)
        })
      })

      that.setData({
        tenderList: rows,
        tenderimglist: that.data.tenderimglist
      })
      console.log(that.data.tenderimglist)
    })
    getimgList(that.data.pritemid, "4", "0", function (res) {
      console.log("结算材料列表数据", res.data)
      var rows = JSON.parse(res.data.data.rows);
       if (res.data.data.total == 0) {
        that.setData({
          hasnofile: true
        })
      }
      rows.map(function (item) {
        item.PathList.map(function (i) {
          that.data.settleimglist.push("https://wx.demo.cneefix.com" + i.Path)
        })
      })

      that.setData({
        settleList: rows,
        settleimglist: that.data.settleimglist
      })
      console.log(that.data.settleimglist)
    })
    //项目详情
    var getprodetaildata = {
      Id: options.pritemid,
      SessionId: wx.getStorageSync('sessionid')
    }
    requiredata.getprodetail(requireUrl.getprodetailUrl, getprodetaildata, function (res) {
      console.log("项目详情", res.data);
      var rows = JSON.parse(res.data.data.rows);
      if (rows.SurplusDayNum < 0) {
        rows.overdata = Math.abs(rows.SurplusDayNum)
        that.setData({
          overdate: false
        })

      }
      that.setData({
        list: rows
      })
    }, function (res) {

    })

    //获取项目完成情况信息列表
    var param = {
      Id: options.pritemid,
      sessionid: wx.getStorageSync('sessionid')
    }
    requiredata.getprojectitemfulfilment(requireUrl.getprodurationinfoUrl, param, function (res) {
      var rows = JSON.parse(res.data.data.rows);
      console.log(res.data)
      for (var i = 0; i < rows.length; i++) {
        if(rows[i].SectionDate){        
        rows[i].SectionDate = rows[i].SectionDate.substr(5, rows[i].SectionDate.length);
        }
      }
      that.setData({
        itemfulfilment: rows
      })
    }, function () {

    })


  },
  toggle: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    if (idx == 4) {
      // 巡检记录列表
      var prorecorddetaildata = {
        start: 0,
        pageLength: 50,
        projectItemId: that.data.pritemid,
        sessionId: wx.getStorageSync('sessionid')
      }
      requiredata.prorecorddetail(requireUrl.prorecorddetailUrl, prorecorddetaildata, function (res) {
        console.log("巡检记录", res.data);
        var rowlist = JSON.parse(res.data.data.rows)
        if (res.data.data.total == 0) {
          that.setData({
            hasnodata: true
          })
        }
        that.setData({
          rountlist: rowlist
        })
      }, function (res) {

      })
    }
    that.data.show[idx] = !that.data.show[idx];
    that.setData({
      show: that.data.show
    })
  },
  //过程材料预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imglist
    })
  },
  //招标文件预览图片
  previewtenderImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.tenderimglist
    })
  },
  previewsettleImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.settleimglist
    })
  }
})