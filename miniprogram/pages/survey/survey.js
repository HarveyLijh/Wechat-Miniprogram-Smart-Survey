// miniprogram/pages/survey/survey.js

var allQA = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_info_1: "多云\n北风3-4级\n",
    image_info_2: "晴~多云\n东风3-4级\n",
    //Question 1
    image_info: [{
      id: 1,
      weather: "",
      wind: "",
      aqi: 123
    }],
    rand_aqi_1: -1,
    image_1: null,
    Q1: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否'
      }
    ],
    Q_a1: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否'
      }
    ],
    A1: null,
    A1_1: null,
    G1_hide: false,
    Q1_hide: false,
    Q1_a_hide: true,
    // Question 2
    image_02: null,
    Q2: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否'
      }
    ],
    Q_a2: [{
        name: 1,
        value: '是'
      },
      {
        name: 0,
        value: '否'
      }
    ],
    A2: null,
    A2_1: null,
    G2_hide: true,
    Q2_hide: true,
    Q2_a_hide: true,
    submit_hide: true,
    personInfo_hide: true,
    p_info: [{
        value: "A.初等教育（ 小学） 及以下"
      },
      {
        value: "B.中等教育（ 初级中学； 高级中学、 中专； 职校、 中校）"
      },
      {
        value: "C.高等教育（ 专科（ 高职、 高专、 高技）、 本科）"
      },
      {
        value: "D.硕士以及博士研究生"
      }
    ],
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let value = e.detail.value;
    if (e.target.dataset.index == 1) {
      // store value of question 1
      allQA.push("A1:" + value);
      this.setData({
        A1: value
      })
    } else if (e.target.dataset.index == 1.1) {
      // store value of question 1.1
      allQA.push("A1_1:" + value);
      this.setData({
        A1_1: value
      })
    } else if (e.target.dataset.index == 2) {
      // store value of question 2
      allQA.push("A2:" + value);
      this.setData({
        A2: value
      })
    } else if (e.target.dataset.index == 2.1) {
      // store value of question 2.1
      allQA.push("A2_1:" + value);
      this.setData({
        A2_1: value
      })
    }
  },

  next_page: function (e) {
    const num = e.target.dataset.index;
    // dealing Q1
    if (num == 1) {
      if (this.data.A1 == null || (this.data.Q1_hide && this.data.A1_1 == null)) {
        wx.showToast({
          title: '请先选择答案',
          icon: 'none',
          duration: 1100,
          mask: true
        })
        // go to Q2
      } else if (this.data.A1 == 1 || this.data.A1_1 != null) {
        this.setData({
          G1_hide: true,
          Q1_hide: true,
          Q1_a_hide: true,
          G2_hide: false,
          Q2_hide: false,
        })
        this.loadImage(2)
        // go to Q1.a
      } else {
        this.setData({
          Q1_hide: true,
          Q1_a_hide: false
        })
      }
    }

    // dealing Q2
    if (num == 2) {
      if (this.data.A2 == null || (this.data.Q2_hide && this.data.A2_1 == null)) {
        wx.showToast({
          title: '请先选择答案',
          icon: 'none',
          duration: 1100,
          mask: true
        })
        // go to personinfo page
      } else if (this.data.A2 == 1 || this.data.A2_1 != null) {
        this.setData({
          G1_hide: true,
          Q1_hide: true,
          Q1_a_hide: true,
          G2_hide: true,
          Q2_hide: true,
          Q2_a_hide: true,
          personInfo_hide: false
        })
        // go to Q2.a
      } else {
        this.setData({
          Q2_hide: true,
          Q2_a_hide: false
        })
      }
    }

    // go to submit page
    if (num == 3) {
      this.setData({
        G1_hide: true,
        Q1_hide: true,
        Q1_a_hide: true,
        G2_hide: true,
        Q2_hide: true,
        Q2_a_hide: true,
        personInfo_hide: true,
        submit_hide: false
      })
    }
  },

  submitSurvey: function (event) {
    wx.cloud.callFunction({
      name: "saveSurvey",
      data: {
        content: allQA
      },
      success: (res) => {
        //reset dataset
        allQA = [];
        this.setData({
          //Question 1
          A1: null,
          A1_1: null,
          // Question 2
          A2: null,
          A2_1: null
        });
        wx.navigateTo({
          url: '/pages/thankyou/thankyou',
        })
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadImage(1);
  },

  loadImage: function (image) {
    const num = this.getRandomNum(1, 17);
    if (image == 1) {
      this.setData({
        image_1: "http://qajl6rzaz.bkt.clouddn.com/image" + num + ".png",
        rand_aqi_1: this.getRandomNum(0, 500)
      })
      allQA.push("img1:" + num)
    } else if (image == 2) {
      this.setData({
        image_2: "http://qajl6rzaz.bkt.clouddn.com/image" + num + ".png",
        rand_aqi_2: this.getRandomNum(0, 500)
      })
      allQA.push("img2:" + num)
    } else {
      wx.showToast({
        title: '图片加载错误，请联系工作人员',
        icon: 'none',
        duration: 1100,
        mask: true
      })
    }
  },

  getRandomNum: function (floor, ceiling) {
    var randomIndex = Math.floor(Math.random() * (ceiling - 1)) + floor;
    return randomIndex
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});