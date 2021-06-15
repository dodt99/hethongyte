const Enum = require('./Enum.js');

class ExaminationType extends Enum {
  getTitle(key) {
    switch (key) {
      case this.NHO_RANG:
        return 'Nhổ răng';
      case this.LAY_CAO_RANG:
        return 'Lấy cao răng';
      case this.HAN_RANG:
        return 'Hàn răng';
      case this.CHONG_RANG_GIA:
        return 'Chồng răng giả';
      case this.TAI_KHAM:
        return 'Tái khám';
      case this.TU_VAN:
        return 'Tư vấn';
      case this.KHAC:
        return 'Khác';
      default:
        return '';
    }
  }
}

module.exports = new ExaminationType({
  NHO_RANG: 1,
  LAY_CAO_RANG: 2,
  HAN_RANG: 3,
  CHONG_RANG_GIA: 4,
  TAI_KHAM: 5,
  TU_VAN: 6,
  KHAC: 7,
});
