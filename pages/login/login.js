const app = getApp();
const baseUrl = app.globalData.baseUrl;
Page({
  data: {
    imgUrls: [
      'https://prd-kpl.oss-cn-shanghai.aliyuncs.com/images/yangtongfan/top_3_1.png',
      'https://prd-kpl.oss-cn-shanghai.aliyuncs.com/images/yangtongfan/top_3_2.png',
      'https://prd-kpl.oss-cn-shanghai.aliyuncs.com/images/yangtongfan/top_3_3.png',
      'https://prd-kpl.oss-cn-shanghai.aliyuncs.com/images/yangtongfan/top_3_4.png',
      'https://prd-kpl.oss-cn-shanghai.aliyuncs.com/images/yangtongfan/top_3_5.png',
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 500,
    check_code:'获取验证码',
    scene: '',
    chooseDesc: '随时退款保障',
    chooseSubDesc: '三节课内对陪练效果或服务不满意可全额退款',
  },
  onLoad: function (query) {
    wx.hideNavigationBarLoading();
    var token = wx.getStorageSync('token');
    if (token) {
      wx.switchTab({
        url: '../stu/stu',
      })
    }
    this.setData({
      scene: decodeURIComponent(query.scene)
    })
  },
  bindanimationfinish: function(e) {
    switch(e.detail.current) {
      case 0:
        this.setData({
          chooseDesc: '随时退款保障',
          chooseSubDesc: '三节课内对陪练效果或服务不满意可全额退款',
        });
        break;
      case 1:
        this.setData({
          chooseDesc: '优秀师资',
          chooseSubDesc: '陪练老师均拥有专业音乐院校背景，经6层严格选拔',
        });
        break;
      case 2:
        this.setData({
          chooseDesc: '便捷的约课',
          chooseSubDesc: '便捷约课，随时了解孩子练琴表现',
        });
        break;
      case 3:
        this.setData({
          chooseDesc: '省时，省心',
          chooseSubDesc: '科学的课程设置，符合儿童成长规律',
        });
        break;
      case 4:
        this.setData({
          chooseDesc: '优质的教学教具',
          chooseSubDesc: '专业定制覆盖全键盘，鱼眼转像光学系统',
        });
        break;
      default:
        this.setData({
          chooseDesc: '随时退款保障',
          chooseSubDesc: '三节课内对陪练效果或服务不满意可全额退款',
        });
    }
  },
  inpu_num: function (e) {
    var phone = e.detail.value;
    var that = this;
    that.setData({
      inpu_num: phone
    })

    wx.setStorageSync('pho', phone);
  },
  inpu_code: function (f) {
    var qr = f.detail.value;
    var that = this;
    that.setData({
      inpu_code: qr
    })
    wx.setStorageSync('code', qr);
  },
  getcode: function (sbs, islogin) {
    var sbs = wx.getStorageSync('pho')

    var that = this
    var count = 50;
    //var sb = that.data.inpu_num;
    clearInterval(timer) //预清除定时器，防止多个定时器同时运行

    var re = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!re.test(that.data.inpu_num)) {
      wx.showToast({
        title: '手机号格式有误',
        icon:'none'
      })
      return false;
    } else {
      wx.request({
        url: baseUrl + 'sms/send',
        method: 'POST',
        data: { 
          "mobile": sbs,
          'event': 'mobilelogin'
          },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if(res.data.code==1){
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            });
          }
        }
      })

      var timer = setInterval(function () {
        count--;
        if (count >= 1) {
          that.setData({
            check_code: count + 's后重新获取',
            disabled: true
          })
        } else {
          that.setData({
            check_code: '获取验证码',
            disabled: false
          })
          clearInterval(timer);
          that.data.isdisable = false;
        }
      }, 1000);
    }
  },
  login: function (e) {
    var that = this;
    var re = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    var sbs = wx.getStorageSync('pho')
    var phone = that.data.inpu_num;
    var qr_code = that.data.inpu_code;
    var code = wx.getStorageSync('code');
    var open_id = wx.getStorageSync('open_id');
    var id = this.data.id;
    var cid = this.data.cid;
    var curPath = this.data.curPath;
    var scene = this.data.scene;
    console.log(scene)
    if (phone == '' || qr_code == '') {
      wx.showToast({
        title: '请填写手机号和验证码',
        icon:'none'
      })
    } else if (!re.test(that.data.inpu_num)) {
      wx.showModal({
        title: '提示',
        content: '手机号格式有误',
        showCancel: false
      });
      return false;
    } else {
      wx.request({
        url: baseUrl + 'user/mobilelogin',
        method: 'POST',
        data: { "mobile": sbs, "captcha": code, "from": 3, "q": this.data.scene},
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 200||res.data.code==1) {
            wx.showToast({
              title: '登录成功',
              icon: 'success'
            })
            var is_new = res.data.data.userinfo.is_own;
            wx.setStorageSync('mobile', res.data.data.mobile);
            wx.setStorageSync('token', res.data.data.userinfo.token);
            wx.setStorageSync('username', res.data.data.userinfo.username);
            wx.setStorageSync('avatar', res.data.data.userinfo.avatar);
            wx.setStorageSync('rulelist', res.data.data.userinfo.group.rules_list);
            wx.setStorageSync('userinfo', res.data.data.userinfo);
            wx.setStorageSync('is_new', is_new)
            if (is_new==1){
              wx.switchTab({
                url: '../stu/stu',
              })
            }else if(is_new==0){
              wx.reLaunch({
                url: '../loginNew/loginNew?scene=' + scene,
              })
            } 
          }
          if (res.data.code != 1) {
            var msg = res.data.msg;
            wx.showModal({
              title: '提示',
              content: msg,
              showCancel: false,
              complete:function(){
                if (res.data.code == 1001 || res.data.code == 1002) {
                    wx.navigateToMiniProgram({
                        appId: 'wxf156f99010f9575d',
                        path: 'pages/index/index',
                        extraData: {
                            foo: 'bar'
                        },
                        envVersion: 'trial',
                        success(res) {
                            // 打开成功
                            console.log('打开成功')
                        }
                    })
                }
              }
            })
          }

          if (res.data.code == 1) {
            var msg = res.data.msg;
            wx.showToast({
              title: msg,
              icon:'none'
            })
          }
        }, fail: function () {

        }
      })
    }
  },
})