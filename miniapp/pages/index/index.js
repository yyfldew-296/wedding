const app = getApp();

Page({
  data: {
    cd: { days: '00', hours: '00', mins: '00', secs: '00' },
    venue: '贵州省铜仁市松桃苗族自治县乌罗镇杨立掌',
    photos: [
      { jpg: '/images/微信图片_20260603110032_52_40.jpg', caption: '2024年秋 · 初见' },
      { jpg: '/images/微信图片_20260603110034_53_40.jpg', caption: '在一起的那天' },
      { jpg: '/images/微信图片_20260603110037_54_40.jpg', caption: '他的镜头里全是我' },
      { jpg: '/images/微信图片_20260603110040_55_40.jpg', caption: '他在深圳，每晚视频' },
      { jpg: '/images/微信图片_20260603110042_56_40.jpg', caption: '周末约会' },
      { jpg: '/images/微信图片_20260603110044_57_40.jpg', caption: '一起做饭的日常' },
      { jpg: '/images/微信图片_20260603110047_58_40.jpg', caption: '最幸福的一刻' },
      { jpg: '/images/微信图片_20260603110049_59_40.jpg', caption: '他说"嫁给我"' },
      { jpg: '/images/微信图片_20260603110054_61_40.jpg', caption: '我们一起选车' },
      { jpg: '/images/微信图片_20260603110055_62_40.jpg', caption: '甜蜜日常' },
      { jpg: '/images/微信图片_20260603110058_63_40.jpg', caption: '在一起就很好' },
      { jpg: '/images/3545d5bb-00d9-4841-bd7b-8dc1fa61e224.jpg', caption: '我们的请柬' },
    ],
    timeline: [
      { date: '2024年10月4日 · 18:12', title: '💫 命运相遇', desc: '茫茫人海中，我们遇见了彼此。那一刻的怦然心动，是此生最美的意外。' },
      { date: '2024年11月25日 · 18:49', title: '💕 甜蜜相恋', desc: '牵起彼此的手，许下相守的诺言。从这一天起，心有所属，爱有所归。', heart: true },
      { date: '2025年 · 相隔千里的每一天', title: '💻 他在深圳，她在心里', desc: '他在深圳写代码，她在老家默默成长。每晚的视频通话，把一千公里的距离变成零。' },
      { date: '2026年', title: '💍 开始筹备我们的未来', desc: '选车、规划路线、设计婚礼——每一件小事都在说同一句话：我们准备好了。', heart: true },
      { date: '2026年12月', title: '🚗 第一辆属于我们的车', desc: '一辆属于我们两个人的SUV。它不只是车——是我们在路上的小家，是想走就走的自由。' },
      { date: '2027年1月23日', title: '💒 步入婚姻', desc: '在家人和朋友的见证下，在生养我们的贵州山里，我们成为彼此生命中最重要的人。', heart: true },
    ],
    blessName: '',
    blessMsg: '',
    blessings: [],
    timer: null
  },

  onLoad() {
    this.startCountdown();
    this.initBlessings();
    // 开启分享
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] });
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer);
  },

  // ===== 倒计时 =====
  startCountdown() {
    const weddingDate = new Date('2027-01-23T10:18:00');
    const tick = () => {
      const diff = weddingDate - new Date();
      if (diff <= 0) {
        this.setData({ cd: { days: '00', hours: '00', mins: '00', secs: '00' } });
        if (this.data.timer) clearInterval(this.data.timer);
        return;
      }
      this.setData({
        cd: {
          days: String(Math.floor(diff / 86400000)).padStart(2, '0'),
          hours: String(Math.floor((diff / 3600000) % 24)).padStart(2, '0'),
          mins: String(Math.floor((diff / 60000) % 60)).padStart(2, '0'),
          secs: String(Math.floor((diff / 1000) % 60)).padStart(2, '0'),
        }
      });
    };
    tick();
    this.data.timer = setInterval(tick, 1000);
  },

  // ===== 照片预览（小程序原生） =====
  previewPhoto(e) {
    const idx = e.currentTarget.dataset.idx;
    wx.previewImage({
      current: this.data.photos[idx].jpg,
      urls: this.data.photos.map(p => p.jpg),
    });
  },

  // ===== 复制地址（小程序原生API） =====
  copyAddress() {
    wx.setClipboardData({
      data: this.data.venue,
      success() { wx.showToast({ title: '已复制 ✓', icon: 'success' }); }
    });
  },

  // ===== 地图导航（小程序原生地图） =====
  openMap() {
    wx.openLocation({
      latitude: 28.05,
      longitude: 108.95,
      name: '杨亦富 & 杨静静 婚礼',
      address: this.data.venue,
      scale: 15,
    });
  },

  // ===== 祝福墙 =====
  onNameInput(e) { this.setData({ blessName: e.detail.value }); },
  onMsgInput(e) { this.setData({ blessMsg: e.detail.value }); },

  submitBlessing() {
    const { blessName, blessMsg } = this.data;
    if (!blessName.trim() || !blessMsg.trim()) {
      wx.showToast({ title: '请填写名字和祝福', icon: 'none' });
      return;
    }
    const now = new Date();
    const time = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const blessings = [{ name: blessName, msg: blessMsg, time }, ...this.data.blessings];
    this.setData({ blessings, blessName: '', blessMsg: '' });
    // 存本地
    wx.setStorageSync('wedding_blessings', blessings);
    wx.showToast({ title: '祝福已送出 💝', icon: 'success' });
  },

  initBlessings() {
    const saved = wx.getStorageSync('wedding_blessings') || [];
    if (saved.length === 0) {
      // 预设示例祝福
      this.setData({ blessings: [
        { name: '妈妈', msg: '亦富、静静，看着你们走到今天，妈妈心里高兴。以后的日子，两个人好好的。', time: '6/3 10:30' },
        { name: '爸爸', msg: '儿子，成家了就是大人了。对静静好一点，好好过日子。', time: '6/3 10:31' },
        { name: '深圳的同事阿杰', msg: '老杨终于结婚了！从代码到婚礼，一路看着你们走过来。祝你们新婚快乐！', time: '6/3 10:32' },
        { name: '静静的闺蜜', msg: '静静要幸福！你找到了一个把你写进代码里的男人——这比任何情书都浪漫 💕', time: '6/3 10:33' },
      ]});
    } else {
      this.setData({ blessings: saved });
    }
  },

  // ===== 分享 =====
  onShareAppMessage() {
    return {
      title: '杨亦富 ❤ 杨静静 | 婚礼请柬',
      desc: '2027年1月23日 · 腊月十六 · 诚邀您的见证',
      path: '/pages/index/index',
    };
  },

  onShareTimeline() {
    return {
      title: '杨亦富 ❤ 杨静静 | 婚礼请柬',
    };
  },
});
