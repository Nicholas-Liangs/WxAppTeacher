// pages/my/my.js
let app = getApp();
let baseUrl = app.globalData.baseUrl;
Page({
  data: {
  
  },
  fankui:function(){
    wx.navigateTo({
      url: '../fankui/fankui',
    })
  },
  egency:function(e){
    var id=e.currentTarget.dataset.id;
    var logo = e.currentTarget.dataset.logo;
    var url = encodeURIComponent(logo);
    var name=e.currentTarget.dataset.name;
    var mobile = e.currentTarget.dataset.mobile;
    var address = e.currentTarget.dataset.address;
    console.log(logo)
    wx.navigateTo({
      url: '../editAgency/editAgency?' + 'id=' + id + '&address=' + address + '&mobile=' + mobile + '&name=' + name + '&logo=' + url,
    })
  },
  selectEgency:function(){
    wx.navigateTo({
      url: '../selectAgency/selectAgency',
    })
  },
  loginOut:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'user/logout',
      method: 'get',
      header: {
        token: token
      },
      data: {

      },
      success:function(){
        wx.removeStorageSync('token');
        wx.reLaunch({
          url: '../login/login',
        })
      }
    })
  },
  getInfo:function(){
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: baseUrl + 'user/getUserInfo',
      method: 'get',
      header: {
        token: token
      },
      data: {
      
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading();
          that.setData({
           detail:res.data.data.userinfo,
           logo: res.data.data.userinfo.agency.logo,
           name: res.data.data.userinfo.agency.name,
           type_text: res.data.data.userinfo.agency.type_text
          })
          wx.hideLoading();

        }else if(res.data.data==null){
          // wx.reLaunch({
          //   url: '../login/login',
          // })
        }
          if(res.data.code == 401){
            wx.reLaunch({
              url: '../login/login',
            })
          }
      }
    })
  },
  setting:function(e){
    var avatar = e.currentTarget.dataset.avatar;
    var username = e.currentTarget.dataset.username;
    wx.navigateTo({
      url: '../setting/setting?' + 'avatar=' + avatar +'&username='+username,
    })
  },
  mystu(){
    wx.navigateTo({
      url: '../stu/stu',
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中',
    })
    this.getInfo();
  },
  onShow: function () {
    this.getInfo();
  },
})