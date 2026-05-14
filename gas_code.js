// ============================================================
//  就労継続支援B型 管理システム v3.0 (Modified)
// ============================================================

var HEADERS = {
  '利用者': ['id','name','furigana','birthdate','gender','disability',
    'serviceType','staffId',
    'prefecture','city','address','contact','contact2','contact3','emergencyContact','emergencyPhone',
    'recipientNumber','supportStartDate','supportEndDate','supportDays','category',
    'scheduleDays','scheduleStart','scheduleEnd','bento','pickup',
    'enrollDate','endDate','userStatus','notes'],
  '出欠': ['id','userId','date','status','startTime','endTime','breakMin','workTypeId','notes'],
  '日報': ['id','userId','date','workTypeId','content','mood','notes'],
  '送迎': ['id','userId','date','pickupTime','dropoffTime','driver','route','notes'],
  '作業種別': ['id','name','rate'],
  'スタッフ': ['id','name','role','loginId','password'],
  '設定': ['key','value']
};

function getSS(){try{var ss=SpreadsheetApp.getActiveSpreadsheet();if(ss)return ss;}catch(e){}var id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');if(id){try{return SpreadsheetApp.openById(id);}catch(e){}}throw new Error('スプレッドシートが見つかりません');}
function getSheet(name){return getSS().getSheetByName(name);}

function doGet(){return HtmlService.createHtmlOutputFromFile('Index').setTitle('就労継続支援B型 管理システム').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport','width=device-width, initial-scale=1');}

function initSheets(){
  var ss=SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SHEET_ID',ss.getId());
  var names=Object.keys(HEADERS);
  for(var n=0;n<names.length;n++){
    var name=names[n],headers=HEADERS[name],sheet=ss.getSheetByName(name);
    if(!sheet){
      sheet=ss.insertSheet(name);
      sheet.getRange(1,1,1,headers.length).setValues([headers]);
      sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#e8e0d8');
      sheet.setFrozenRows(1);
    }
    else{
      var cur=sheet.getLastColumn();
      if(cur<headers.length){
        sheet.getRange(1,1,1,headers.length).setValues([headers]);
        sheet.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#e8e0d8');
      }
    }
  }
  var wtS=ss.getSheetByName('作業種別');
  if(wtS.getLastRow()<=1){wtS.getRange(2,1,5,3).setValues([['w1','軽作業',250],['w2','清掃',220],['w3','農作業',280],['w4','手工芸',200],['w5','PC作業',300]]);}
  var seS=ss.getSheetByName('設定');
  if(seS.getLastRow()<=1){seS.getRange(2,1,2,2).setValues([['facilityName','就労継続支援B型事業所'],['capacity','30']]);}
  Logger.log('初期化完了');return '初期化完了';
}

function sheetToArray(sheetName){
  var sheet=getSheet(sheetName);if(!sheet||sheet.getLastRow()<=1)return[];
  var headers=HEADERS[sheetName];
  var data=sheet.getRange(2,1,sheet.getLastRow()-1,Math.max(sheet.getLastColumn(),headers.length)).getValues();
  var result=[];
  for(var i=0;i<data.length;i++){
    var obj={};
    for(var j=0;j<headers.length;j++){
      var val = (j<data[i].length&&data[i][j]!==undefined) ? data[i][j] : '';
      if(val instanceof Date) {
        if(val.getFullYear() <= 1900) {
          // Time formatting HH:mm
          var hh = String(val.getHours()).padStart(2, '0');
          var mm = String(val.getMinutes()).padStart(2, '0');
          val = hh + ':' + mm;
        } else {
          // Date formatting YYYY-MM-DD
          var yyyy = val.getFullYear();
          var mm = String(val.getMonth() + 1).padStart(2, '0');
          var dd = String(val.getDate()).padStart(2, '0');
          val = yyyy + '-' + mm + '-' + dd;
        }
      } else {
        val = String(val);
      }
      obj[headers[j]]=val;
    }
    if(!obj.id&&!obj[headers[0]])continue;
    result.push(obj);
  }
  return result;
}

function findRowById(sn,id){var s=getSheet(sn);if(!s||s.getLastRow()<=1)return-1;var ids=s.getRange(2,1,s.getLastRow()-1,1).getValues();for(var i=0;i<ids.length;i++){if(String(ids[i][0])===String(id))return i+2;}return-1;}
function addRow(sn,obj){var s=getSheet(sn);if(!s)throw new Error('シート「'+sn+'」が見つかりません');var h=HEADERS[sn];var r=[];for(var i=0;i<h.length;i++)r.push(obj[h[i]]!==undefined?obj[h[i]]:'');s.appendRow(r);return obj;}
function updateRow(sn,obj){var s=getSheet(sn);if(!s)return null;var rn=findRowById(sn,obj.id);if(rn<0)return null;var h=HEADERS[sn];var r=[];for(var i=0;i<h.length;i++)r.push(obj[h[i]]!==undefined?obj[h[i]]:'');s.getRange(rn,1,1,r.length).setValues([r]);return obj;}
function deleteRow(sn,id){var s=getSheet(sn);if(!s)return false;var rn=findRowById(sn,id);if(rn<0)return false;s.deleteRow(rn);return true;}

// 利用者
function getUsers(){return sheetToArray('利用者');}
function addUser(d){d.id='u'+new Date().getTime();return addRow('利用者',d);}
function updateUser(d){return updateRow('利用者',d);}
function deleteUser(id){return deleteRow('利用者',id);}

// スタッフ
function getStaff(){return sheetToArray('スタッフ');}
function addStaff(d){d.id='s'+new Date().getTime();return addRow('スタッフ',d);}
function updateStaff(d){return updateRow('スタッフ',d);}
function deleteStaff(id){return deleteRow('スタッフ',id);}

// 出欠
function getAttendance(ym){var a=sheetToArray('出欠');if(!ym)return a;var r=[];for(var i=0;i<a.length;i++){if(String(a[i].date).indexOf(ym)===0)r.push(a[i]);}return r;}
function getAttendanceByDate(d){var a=sheetToArray('出欠');var r=[];for(var i=0;i<a.length;i++){if(String(a[i].date)===String(d))r.push(a[i]);}return r;}
function addAttendance(d){d.id='a'+new Date().getTime()+Math.random().toString(36).substr(2,5);return addRow('出欠',d);}
function updateAttendance(d){return updateRow('出欠',d);}
function upsertAttendance(d){var a=sheetToArray('出欠');var ex=null;for(var i=0;i<a.length;i++){if(String(a[i].userId)===String(d.userId)&&String(a[i].date)===String(d.date)){ex=a[i];break;}}if(ex){d.id=ex.id;return updateRow('出欠',d);}else{return addAttendance(d);}}
function bulkAddAttendance(recs){var r=[];for(var i=0;i<recs.length;i++)r.push(upsertAttendance(recs[i]));return r;}

// 日報
function getDailyByDate(d){var a=sheetToArray('日報');var r=[];for(var i=0;i<a.length;i++){if(String(a[i].date)===String(d))r.push(a[i]);}return r;}
function addDailyReport(d){d.id='d'+new Date().getTime()+Math.random().toString(36).substr(2,5);return addRow('日報',d);}
function updateDailyReport(d){return updateRow('日報',d);}

// 送迎
function getTransportByDate(d){var a=sheetToArray('送迎');var r=[];for(var i=0;i<a.length;i++){if(String(a[i].date)===String(d))r.push(a[i]);}return r;}
function addTransport(d){d.id='t'+new Date().getTime()+Math.random().toString(36).substr(2,5);return addRow('送迎',d);}
function updateTransport(d){return updateRow('送迎',d);}

// 作業種別
function getWorkTypes(){return sheetToArray('作業種別');}
function addWorkType(d){d.id='w'+new Date().getTime();return addRow('作業種別',d);}
function updateWorkType(d){return updateRow('作業種別',d);}
function deleteWorkType(id){return deleteRow('作業種別',id);}

// 設定
function getSettings(){var rows=sheetToArray('設定');var obj={};for(var i=0;i<rows.length;i++)obj[rows[i].key]=rows[i].value;return obj;}
function updateSetting(k,v){var s=getSheet('設定');if(!s)return false;var lr=s.getLastRow();if(lr>1){var d=s.getRange(2,1,lr-1,2).getValues();for(var i=0;i<d.length;i++){if(String(d[i][0])===String(k)){s.getRange(i+2,2).setValue(v);return true;}}}s.appendRow([k,v]);return true;}

// CSV
function getWageCSV(ym){var us=getUsers(),att=getAttendance(ym),wts=getWorkTypes();var csv='氏名,出勤日数,総作業時間(h),工賃合計(円)\n';for(var u=0;u<us.length;u++){var user=us[u];var recs=[];for(var a=0;a<att.length;a++){if(String(att[a].userId)===String(user.id)&&(att[a].status==='出席'||att[a].status==='遅刻'||att[a].status==='早退'))recs.push(att[a]);}if(recs.length===0)continue;var tH=0,tW=0;for(var r=0;r<recs.length;r++){var h=calcHours(recs[r].startTime,recs[r].endTime,Number(recs[r].breakMin)||0);var wt=null;for(var w=0;w<wts.length;w++){if(String(wts[w].id)===String(recs[r].workTypeId)){wt=wts[w];break;}}tH+=h;tW+=h*(wt?Number(wt.rate):0);}csv+=user.name+','+recs.length+','+tH.toFixed(1)+','+Math.round(tW)+'\n';}return csv;}
function calcHours(s,e,b){if(!s||!e)return 0;var sp=String(s).split(':'),ep=String(e).split(':');return Math.max(0,(Number(ep[0])*60+Number(ep[1])-Number(sp[0])*60-Number(sp[1])-(b||0))/60);}

// ============================================================
// APIエンドポイント (GitHub Pages等の外部からのリクエスト処理用)
// ============================================================
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var args = payload.args || [];
    var result = null;

    if (action === 'getUsers') result = getUsers();
    else if (action === 'addUser') result = addUser(args[0]);
    else if (action === 'updateUser') result = updateUser(args[0]);
    else if (action === 'deleteUser') result = deleteUser(args[0]);
    else if (action === 'getStaff') result = getStaff();
    else if (action === 'addStaff') result = addStaff(args[0]);
    else if (action === 'updateStaff') result = updateStaff(args[0]);
    else if (action === 'deleteStaff') result = deleteStaff(args[0]);
    else if (action === 'getAttendance') result = getAttendance(args[0]);
    else if (action === 'getAttendanceByDate') result = getAttendanceByDate(args[0]);
    else if (action === 'addAttendance') result = addAttendance(args[0]);
    else if (action === 'updateAttendance') result = updateAttendance(args[0]);
    else if (action === 'upsertAttendance') result = upsertAttendance(args[0]);
    else if (action === 'bulkAddAttendance') result = bulkAddAttendance(args[0]);
    else if (action === 'getDailyByDate') result = getDailyByDate(args[0]);
    else if (action === 'addDailyReport') result = addDailyReport(args[0]);
    else if (action === 'updateDailyReport') result = updateDailyReport(args[0]);
    else if (action === 'getTransportByDate') result = getTransportByDate(args[0]);
    else if (action === 'addTransport') result = addTransport(args[0]);
    else if (action === 'updateTransport') result = updateTransport(args[0]);
    else if (action === 'getWorkTypes') result = getWorkTypes();
    else if (action === 'addWorkType') result = addWorkType(args[0]);
    else if (action === 'updateWorkType') result = updateWorkType(args[0]);
    else if (action === 'deleteWorkType') result = deleteWorkType(args[0]);
    else if (action === 'getSettings') result = getSettings();
    else if (action === 'updateSetting') result = updateSetting(args[0], args[1]);
    else if (action === 'getWageCSV') result = getWageCSV(args[0]);
    else throw new Error('不明なアクションです: ' + action);

    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
