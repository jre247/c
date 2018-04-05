import moment from 'moment';

var DateHelper  = {
  formatTimestamp(value, format) {
    if (format === 'h:mm:ss') {
      var hour = value.split(':')[0];
      var minute = value.split(':')[1];
      if (hour < 10) {
        let hourFormatted = hour.toString()[1];
        return hourFormatted + ":" + minute + " AM";
      }
      else if (hour < 12) {
        return hour + ":" + minute + " AM";
      }
      else if (hour === 0) {
        return 12 + ":" + minute + " AM";
      }
      else if (hour === 12) {
        return hour + ":" + minute + " PM";
      }
      else {
        return (hour - 12) + ":" + minute + " PM";
      }
    }
    else {
      throw new Error('Unsupported timestamp format: ' + format);
    }
  },

  convertSecondsToTimestamp(value) {
    return moment("2015-01-01").startOf('day')
      .seconds(value)
      .format('H:mm:ss');
  }
}

export default DateHelper;
