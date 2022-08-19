//****************************************** Category : dateCategory ******************************************

/* 
	title : 시간 포맷 함수
	description : 11:50 AM 형식의 시간으로 치환
	parameter : date(date)
*/
function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

/* 
	title : 날짜 및 시간 치환
	description : 몇분전 과 같이 치환시킴
	parameter : date(date)
*/
function aFewDateAgo(date) {
  const today = new Date();
  const minutes = Math.floor((today.getTime() - date.getTime()) / 1000 / 60);
  const hour = Math.floor(minutes / 60);
  const day = Math.floor(hour / 24);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hour < 24) return `${hour}시간 전`;
  if (day < 31) return `${day}일 전`;
  if (day < 365) return `${Math.floor(day / 31)}달 전`;
  return `${Math.floor(day / 365)}년 전`;
}
//****************************************** Category : dateCategory ******************************************
//****************************************** Category : validationCategory ************************************

/* 
	title : 한국어 조사 체크
	description : "은는이가"를 맞는 형식으로 넣어줌.
	parameter : 1. word(String) 2.type(Number - 1번은 "은,는" 2번은 "이,가")
*/
function josaCheck(word, type) {
  const lastLetter = word[word.length - 1];
  const uni = lastLetter.charCodeAt(0);

  if (uni < 44032 || uni > 55203) return null;

  const wordboolean = (uni - 44032) % 28 != 0;
  let josa = null;
  if (type == 1) {
    josa = wordboolean ? "은" : "는";
  } else {
    josa = wordboolean ? "이" : "가";
  }
  return josa;
}

/* 
	title : 휴대전화 "-" 삽입
	description : 휴대전화에 하이푼 삽입(지역번호 및 휴대번호 분기처리)
	parameter : number(String)
*/
function replaceCell(number) {
  number = number.replace(/[^0-9]/g, "");
  let phone = "";
  if (number.length < 4) {
    return number;
  } else if (number.length < 7) {
    phone += number.substr(0, 3);
    phone += "-";
    phone += number.substr(3);
  } else if (number.length < 11) {
    phone += number.substr(0, 3);
    phone += "-";
    phone += number.substr(3, 3);
    phone += "-";
    phone += number.substr(6);
  } else {
    phone += number.substr(0, 3);
    phone += "-";
    phone += number.substr(3, 4);
    phone += "-";
    phone += number.substr(7);
  }
  return phone;
}

/* 
	title : 가격콤마찍기
	description : 가격(3자리단위)로 콤마를 찍어 문자로 치환
	parameter : num (Number)
*/
function addPriceComma(num) {
  const reg = /(^[+-]?\d+)(\d{3})/;
  num += "";
  while (reg.test(num)) {
    num = num.replace(reg, "$1" + "," + "$2");
  }
  return num;
}

/* 
	title : 0붙이기
	description : 한자릿수 숫자에 0 붙이기 exam)01, 02
	parameter : num (Number)
*/
function addZero(num) {
  return num < 10 ? "0" + num : num;
}

/* 
	title : 요일체크
	description : 내장 Date함수 getDay 치환용
	parameter : 1. day(Number - getDay()) 2. type(Number - 1: x요일 2:x)
*/
function getDayLabel(day, type) {
  const labelType1 = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const labelType2 = ["일", "월", "화", "수", "목", "금", "토"];
  let dayLabel = null;
  if (type === 1) {
    dayLabel = labelType1[day];
  } else if (type === 2) {
    dayLabel = labelType2[day];
  }

  return dayLabel;
}

/* 
	title : 카드번호 밸리데이션 체크
	description : 카드번호를 통해 카드 종류 체크(정확 x)
	parameter : cardnumber(String)
*/
function validatecardnumber(cardnumber) {
  cardnumber = cardnumber.replace(/[ -]/g, "");
  var match =
    /^(?:(94[0-9]{14})|(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/.exec(
      cardnumber
    );
  if (match) {
    var types = [
      "BC",
      "Visa",
      "MasterCard",
      "Discover",
      "American Express",
      "Diners Club",
      "JCB",
    ];
    var cardType = "";

    for (var i = 1; i < match.length; i++) {
      if (match[i]) {
        cardType = types[i - 1];
        break;
      }
    }

    if (cardType == "") {
      return false;
    } else {
      return luhn(cardnumber);
    }
  } else {
    return false;
  }
}
//****************************************** Category : validationCategory ************************************
//****************************************** Category : AsynchronousCategory **********************************
/* 
	title : ajax 통신
	description : ajax 사용한 Post 통신
	parameter : 1. url(String - requestURL), 2.data(object - requestParam) 3. callback(function) 4. error(function), 5. dataType(String - default:json)
*/
function ajaxPost(url, data, callback, error, dataType = "json") {
  let header = {};
  if (token) {
    header = {
      accept: "*/*",
      "Content-Type": "application/json",
    };
  } else {
    header = {
      accept: "*/*",
      "Content-Type": "application/json",
      Authorization: token,
    };
  }

  $.ajax({
    url: url,
    method: "POST",
    dataType: dataType,
    data: JSON.stringify(data),
    headers: header,
    success: callback,
    error: error,
  });
}
//****************************************** Category : AsynchronousCategory **********************************
//****************************************** Category : etcCategory *******************************************
/* 
	title : 거리차이 km 구하기
	description : 위도 경도로 거리 차이를 구한 뒤 km 로 치환
	parameter : lat1(Number) lng1(Number), lat2(Number), lng2(Number)
*/
function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/* 
	title : 날짜 밸리데이션 체크
	description : 받은 날짜가 실제 존재하는 날짜인지 판별(윤달 포함)
	parameter : 1. vDate(String) 2. message(경고메세지)
*/
function isRightDate(vDate, message) {
  var vValue = vDate;
  var vValue_Num = vValue.replace(/[^0-9]/g, "");
  var rxDatePattern = /^(\d{4})(\d{1,2})(\d{1,2})$/;
  var dtArray = vValue_Num.match(rxDatePattern);
  if (dtArray == null) {
    return false;
  }
  dtYear = dtArray[1];
  dtMonth = dtArray[2];
  dtDay = dtArray[3];

  if (dtMonth < 1 || dtMonth > 12) {
    alert(message);
    return false;
  } else if (dtDay < 1 || dtDay > 31) {
    alert(message);
    return false;
  } else if (
    (dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) &&
    dtDay == 31
  ) {
    alert(message);
    return false;
  } else if (dtMonth == 2) {
    var isleap = dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0);
    if (dtDay > 29 || (dtDay == 29 && !isleap)) {
      alert(message);
      return false;
    }
  }

  return true;
}
//****************************************** Category : etcCategory *******************************************
