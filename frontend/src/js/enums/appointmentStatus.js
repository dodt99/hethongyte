const Enum = require('./Enum.js');

class AppointmentStatus extends Enum {
  getTitle(key) {
    switch (key) {
      case this.CHO_XAC_NHAN:
        return 'Chờ xác nhận';
      case this.CHON_LICH_KHAC:
        return 'Chọn lịch khác';
      case this.HUY_LICH:
        return 'Hủy lịch';
      case this.XAC_NHAN:
        return 'Đã xác nhận';
      case this.DA_KHAM:
        return 'Đã khám';
      default:
        return '';
    }
  }
}

module.exports = new AppointmentStatus({
  CHO_XAC_NHAN: 1,
  CHON_LICH_KHAC: 2,
  HUY_LICH: 3,
  XAC_NHAN: 4,
  DA_KHAM: 5,
});
