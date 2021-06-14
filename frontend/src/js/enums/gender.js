const Enum = require('./Enum.js');

class Gender extends Enum {
  getTitle(key) {
    switch (key) {
      case this.MALE:
        return 'Nam';
      case this.FEMALE:
        return 'Nữ';
      default:
        return '';
    }
  }
}

module.exports = new Gender({
  MALE: 1,
  FEMALE: 2,
});
