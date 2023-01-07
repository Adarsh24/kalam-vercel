export function timestampToDate(timestamp, format = '') {
  timestamp = parseInt(timestamp);
  var date = new Date(timestamp);

  if (format == '') {
    return date.toDateString();
  }

  if (format == 'y-m-d') {
    var day = date.getDate().toString();
    var month = (date.getMonth() + 1).toString(); // 0 -> January
    var year = date.getFullYear();

    var pad = "00"
    var day = pad.substring(0, pad.length - day.length) + day
    var month = pad.substring(0, pad.length - month.length) + month;
    return `${year}-${month}-${day}`;
  }
}

export function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '');

  // Make the string lowercase
  str = str.toLowerCase();

  // Remove accents, swap ñ for n, etc
  var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  var to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  // Remove invalid chars
  str = str.replace(/[^a-z0-9 -]/g, '')
    // Collapse whitespace and replace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');

  return str;
}

export function getLocalData(key) {
  const localData = localStorage.getItem(key);
  if (localData != null) {
    try {
      return JSON.parse(localData)
    } catch {
      return localData
    }
  }
  return null
}

export function setLocalData(key, value, isJson = false) {
  localStorage.setItem(key, isJson ? JSON.stringify(value) : value)
  return
}

export function removeDuplicates(arr) {
  return arr.filter((item,
    index) => arr.indexOf(item) === index);
}

export function readingTime(text, wpm = 255) {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
}

export const crypt = (salt, text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

export const decrypt = (salt, encoded) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};