// ═══════════════════════════════════════════════════
// Supabase アダプター (gas() 互換レイヤー)
// gas('functionName', args...) をそのまま使えるように
// Supabase操作に自動変換する
// ═══════════════════════════════════════════════════

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ID生成（GASと同じ形式）
function _genId(prefix){return prefix+new Date().getTime()+Math.random().toString(36).substr(2,5);}

// エラーを文字列に変換
function _throwErr(e){throw new Error(e.message||e.hint||JSON.stringify(e));}

// テーブルのカラム名キャッシュ
var _colCache={};
async function _getCols(table){
  if(_colCache[table])return _colCache[table];
  var r=await supabase.from(table).select('*').limit(0);
  // レスポンスヘッダーからカラムを取得できないので、1件取得して判断
  var r2=await supabase.from(table).select('*').limit(1);
  if(r2.data&&r2.data.length>0){
    _colCache[table]=Object.keys(r2.data[0]);
  }else{
    // テーブルが空の場合、全カラムを通す（フィルタしない）
    _colCache[table]=null;
  }
  return _colCache[table];
}

// オブジェクトからテーブルに存在するカラムだけ抽出 + 空文字→null変換
async function _filterCols(table,obj){
  var cols=await _getCols(table);
  var filtered={};
  var keys=cols||Object.keys(obj);
  for(var i=0;i<keys.length;i++){
    var k=keys[i];
    if(obj[k]!==undefined){
      filtered[k]=obj[k]===''?null:obj[k];
    }
  }
  return filtered;
}

// テーブルから全件取得（時刻パディング付き）
async function _getAll(table){var r=await supabase.from(table).select('*');if(r.error)_throwErr(r.error);return(r.data||[]).map(_padTimes);}

// テーブルからフィルタ取得
async function _getFiltered(table,col,val){var r=await supabase.from(table).select('*').eq(col,val);if(r.error)_throwErr(r.error);return(r.data||[]).map(_padTimes);}

// 前方一致フィルタ（日付のym検索用）
async function _getLike(table,col,prefix){var r=await supabase.from(table).select('*').like(col,prefix+'%');if(r.error)_throwErr(r.error);return(r.data||[]).map(_padTimes);}

// 以上フィルタ
async function _getGte(table,col,val){var r=await supabase.from(table).select('*').gte(col,val).order(col);if(r.error)_throwErr(r.error);return(r.data||[]).map(_padTimes);}

// 時刻フィールドをHH:mm形式にパディング
function _padTimes(row){
  var timeFields=['startTime','endTime','scheduleStart','scheduleEnd','departTime','arriveTime'];
  for(var i=0;i<timeFields.length;i++){
    var k=timeFields[i];
    if(row[k]&&typeof row[k]==='string'&&row[k].match(/^\d{1,2}:\d{2}$/)){
      var p=row[k].split(':');row[k]=p[0].padStart(2,'0')+':'+p[1];
    }
  }
  return row;
}

// 追加（不明カラム自動除去リトライ付き）
async function _add(table,obj){
  var safe=await _filterCols(table,obj);
  for(var retry=0;retry<10;retry++){
    var r=await supabase.from(table).insert([safe]).select();
    if(!r.error)return(r.data&&r.data[0])||obj;
    if(r.error.message&&r.error.message.indexOf('Could not find the')>=0){
      var m=r.error.message.match(/find the '([^']+)'/);
      if(m){console.warn('カラム除去:',table+'.'+m[1]);delete safe[m[1]];continue;}
    }
    _throwErr(r.error);
  }
  _throwErr(r.error);
}

// 更新（不明カラム自動除去リトライ付き）
async function _update(table,obj){
  var id=obj.id;var safe=await _filterCols(table,obj);
  for(var retry=0;retry<10;retry++){
    var r=await supabase.from(table).update(safe).eq('id',id).select();
    if(!r.error)return(r.data&&r.data[0])||obj;
    if(r.error.message&&r.error.message.indexOf('Could not find the')>=0){
      var m=r.error.message.match(/find the '([^']+)'/);
      if(m){console.warn('カラム除去:',table+'.'+m[1]);delete safe[m[1]];continue;}
    }
    _throwErr(r.error);
  }
  _throwErr(r.error);
}

// 削除
async function _del(table,id){var r=await supabase.from(table).delete().eq('id',id);if(r.error)_throwErr(r.error);return true;}

// Upsert（userId+dateで既存チェック）
async function _upsertByUserDate(table,obj,idPrefix){
  var r=await supabase.from(table).select('id').eq('userId',obj.userId).eq('date',obj.date).limit(1);
  if(r.data&&r.data.length>0){obj.id=r.data[0].id;return _update(table,obj);}
  else{obj.id=_genId(idPrefix);return _add(table,obj);}
}

// ═══ 設定（key-value形式）═══
async function _getSettings(){
  var rows=await _getAll('設定');
  var obj={};for(var i=0;i<rows.length;i++)obj[rows[i].key]=rows[i].value;
  return obj;
}
async function _updateSetting(key,value){
  var r=await supabase.from('設定').select('key').eq('key',key).limit(1);
  if(r.error)_throwErr(r.error);
  if(r.data&&r.data.length>0){
    var ur=await supabase.from('設定').update({value:value}).eq('key',key);
    if(ur.error)_throwErr(ur.error);
  }else{
    var obj={key:key,value:value};
    for(var retry=0;retry<5;retry++){
      var r2=await supabase.from('設定').insert([obj]);
      if(!r2.error)break;
      if(r2.error.message&&r2.error.message.indexOf('Could not find the')>=0){
        var m=r2.error.message.match(/find the '([^']+)'/);if(m){delete obj[m[1]];continue;}
      }
      _throwErr(r2.error);
    }
  }
  return{success:true};
}

// ═══ gas() 互換関数 ═══
async function gas(fn){
  var args=Array.prototype.slice.call(arguments,1);
  var a1=args[0],a2=args[1],a3=args[2];

  switch(fn){
    // ── 利用者 ──
    case 'getUsers': return _getAll('利用者');
    case 'addUser': a1.id=_genId('u');return _add('利用者',a1);
    case 'updateUser': return _update('利用者',a1);
    case 'deleteUser': return _del('利用者',a1);

    // ── スタッフ ──
    case 'getStaff':
      var _st=await _getAll('スタッフ');
      var _roleOrder={'サービス管理責任者':1,'生活支援員':2,'職業指導員':3};
      _st.sort(function(a,b){return(_roleOrder[a.role]||99)-(_roleOrder[b.role]||99);});
      return _st;
    case 'addStaff': a1.id=_genId('s');return _add('スタッフ',a1);
    case 'updateStaff': return _update('スタッフ',a1);
    case 'deleteStaff': return _del('スタッフ',a1);

    // ── 作業種別 ──
    case 'getWorkTypes': return _getAll('作業種別');
    case 'addWorkType': a1.id=_genId('w');return _add('作業種別',a1);
    case 'updateWorkType': return _update('作業種別',a1);
    case 'deleteWorkType': return _del('作業種別',a1);

    // ── 出欠 ──
    case 'getAttendance': return a1?_getLike('出欠','date',a1):_getAll('出欠');
    case 'getAttendanceByDate': return _getFiltered('出欠','date',a1);
    case 'addAttendance': a1.id=_genId('a');return _add('出欠',a1);
    case 'updateAttendance': return _update('出欠',a1);
    case 'upsertAttendance': return _upsertByUserDate('出欠',a1,'a');
    case 'bulkAddAttendance':
      var results=[];for(var i=0;i<a1.length;i++)results.push(await _upsertByUserDate('出欠',a1[i],'a'));return results;

    // ── 日報 ──
    case 'getDaily': return a1?_getLike('日報','date',a1):_getAll('日報');
    case 'getDailyByDate': return _getFiltered('日報','date',a1);
    case 'upsertDailyReport': return _upsertByUserDate('日報',a1,'d');

    // ── 送迎 ──
    case 'getTransportByDate': return _getFiltered('送迎','date',a1);
    case 'addTransport': a1.id=_genId('t');return _add('送迎',a1);
    case 'updateTransport': return _update('送迎',a1);

    // ── 臨時利用 ──
    case 'getTempByMonth': return a1?_getLike('臨時利用','date',a1):_getAll('臨時利用');
    case 'getTempByDate': return _getFiltered('臨時利用','date',a1);
    case 'addTempUser': a1.id=_genId('tmp');a1.createdAt=new Date().toISOString();return _add('臨時利用',a1);
    case 'deleteTempUser': return _del('臨時利用',a1);

    // ── 見学体験 ──
    case 'getTrials': return _getAll('見学体験');
    case 'addTrial': a1.id=_genId('tr');a1.createdAt=new Date().toISOString();return _add('見学体験',a1);
    case 'updateTrial': return _update('見学体験',a1);
    case 'deleteTrial': return _del('見学体験',a1);

    // ── 車両 ──
    case 'getVehicles': return _getAll('車両');
    case 'addVehicle': a1.id=_genId('v');return _add('車両',a1);
    case 'updateVehicle': return _update('車両',a1);
    case 'deleteVehicle': return _del('車両',a1);

    // ── テンプレート ──
    case 'getTemplates': return _getAll('日報テンプレート');
    case 'addTemplate': a1.id=_genId('tpl');return _add('日報テンプレート',a1);
    case 'updateTemplate': return _update('日報テンプレート',a1);
    case 'deleteTemplate': return _del('日報テンプレート',a1);

    // ── 設定 ──
    case 'getSettings': return _getSettings();
    case 'updateSetting': return _updateSetting(a1,a2);
    case 'saveSetting': return _updateSetting(a1,a2);
    case 'getClosedDays':
      var settings=await _getSettings();
      var val=settings['closedDays_'+a1]||'';
      try{return JSON.parse(val);}catch(e){return[];}
    case 'setClosedDays': return _updateSetting('closedDays_'+a1,JSON.stringify(a2));

    // ── 個別支援計画 ──
    case 'getSupportPlans': return _getFiltered('個別支援計画','userId',a1);
    case 'getAllSupportPlans': return _getAll('個別支援計画');
    case 'upsertSupportPlan':
      // signatureDataUrl → signatureUrl に変換（画面側はsignatureUrlで読む）
      if(a1.signatureDataUrl!==undefined){a1.signatureUrl=a1.signatureDataUrl;delete a1.signatureDataUrl;}
      if(a1.id){var ex=await supabase.from('個別支援計画').select('id').eq('id',a1.id).limit(1);if(ex.data&&ex.data.length>0)return _update('個別支援計画',a1);}
      a1.id=_genId('sp');a1.createdAt=new Date().toISOString();return _add('個別支援計画',a1);
    case 'deleteSupportPlan': return _del('個別支援計画',a1);

    // ── アセスメント ──
    case 'getAssessment': return _getFiltered('アセスメント','userId',a1);
    case 'getAllAssessments': return _getAll('アセスメント');
    case 'upsertAssessment':
      if(a1.id){var ex2=await supabase.from('アセスメント').select('id').eq('id',a1.id).limit(1);if(ex2.data&&ex2.data.length>0)return _update('アセスメント',a1);}
      a1.id=_genId('as');a1.createdAt=new Date().toISOString();return _add('アセスメント',a1);
    case 'deleteAssessment': return _del('アセスメント',a1);

    // ── 会議録 ──
    case 'getMeetings': return _getFiltered('会議録','userId',a1);
    case 'upsertMeeting':
      if(a1.id){var ex3=await supabase.from('会議録').select('id').eq('id',a1.id).limit(1);if(ex3.data&&ex3.data.length>0)return _update('会議録',a1);}
      a1.id=_genId('mt');a1.createdAt=new Date().toISOString();return _add('会議録',a1);
    case 'deleteMeeting': return _del('会議録',a1);

    // ── 代理受領 ──
    case 'getProxyReceipts': return a1?_getFiltered('代理受領','serviceYearMonth',a1):_getAll('代理受領');
    case 'saveProxyReceipt':
      var prAll=await supabase.from('代理受領').select('id,createdAt').eq('userId',a1.userId).eq('serviceYearMonth',a1.serviceYearMonth).limit(1);
      if(prAll.data&&prAll.data.length>0){a1.id=prAll.data[0].id;a1.createdAt=prAll.data[0].createdAt;return _update('代理受領',a1);}
      a1.id=_genId('pr');a1.createdAt=new Date().toISOString();return _add('代理受領',a1);

    // ── 送迎ルート ──
    case 'getRoutesByDate': return _getFiltered('送迎ルート','date',a1);

    // ── ヒヤリハット ──
    case 'getIncidents': return _getAll('ヒヤリハット');
    case 'addIncident': a1.id=_genId('inc');a1.createdAt=new Date().toISOString();return _add('ヒヤリハット',a1);
    case 'updateIncident': a1.updatedAt=new Date().toISOString();return _update('ヒヤリハット',a1);
    case 'deleteIncident': return _del('ヒヤリハット',a1);

    // ── 苦情・相談 ──
    case 'getComplaints': return _getAll('苦情相談');
    case 'addComplaint': a1.id=_genId('cmp');a1.createdAt=new Date().toISOString();return _add('苦情相談',a1);
    case 'updateComplaint': a1.updatedAt=new Date().toISOString();return _update('苦情相談',a1);
    case 'deleteComplaint': return _del('苦情相談',a1);

    // ── 研修・委員会 ──
    case 'getTrainings': return _getAll('研修');
    case 'addTraining': a1.id=_genId('trn');a1.createdAt=new Date().toISOString();return _add('研修',a1);
    case 'updateTraining': a1.updatedAt=new Date().toISOString();return _update('研修',a1);
    case 'deleteTraining': return _del('研修',a1);
    case 'getTrainingReports': return _getAll('研修報告');
    case 'addTrainingReport': a1.id=_genId('trr');a1.createdAt=new Date().toISOString();return _add('研修報告',a1);
    case 'updateTrainingReport': a1.updatedAt=new Date().toISOString();return _update('研修報告',a1);

    // ── スタッフ出欠 ──
    case 'getStaffAttendance': return a1?_getLike('スタッフ出欠','date',a1):_getAll('スタッフ出欠');
    case 'getStaffAttendanceByDate': return _getFiltered('スタッフ出欠','date',a1);
    case 'addRouteRecord': a1.id=_genId('rt');a1.createdAt=new Date().toISOString();return _add('送迎ルート',a1);
    case 'updateRouteRecord': return _update('送迎ルート',a1);
    case 'deleteRouteRecord': return _del('送迎ルート',a1);

    // ── サイン保存 ──
    case 'saveSignatureForDate':
      // a1=userId, a2=date, a3=signatureDataUrl
      var sigR=await supabase.from('出欠').select('id').eq('userId',a1).eq('date',a2).limit(1);
      if(sigR.data&&sigR.data.length>0){
        await supabase.from('出欠').update({signature:a3}).eq('id',sigR.data[0].id);
      }
      return{success:true};

    // ── ダッシュボード（複合クエリ）──
    case 'getDashboardData':
      var dAtt=await _getGte('出欠','date',a1);
      var dTemp=await _getGte('臨時利用','date',a1);
      var todayAtt=[],upcoming=[];
      dAtt.forEach(function(x){if(String(x.date)===a1)todayAtt.push(x);upcoming.push(x);});
      var todayTemp=[],upcomingTemp=[];
      dTemp.forEach(function(x){if(String(x.date)===a1)todayTemp.push(x);upcomingTemp.push(x);});
      return{todayAtt:todayAtt,upcoming:upcoming,todayTemp:todayTemp,upcomingTemp:upcomingTemp};

    // ── 初期データ（複合）──
    case 'getInitialData':
      var p=await Promise.all([_getAll('利用者'),_getAll('作業種別'),_getSettings(),_getAll('スタッフ')]);
      return{users:p[0],workTypes:p[1],settings:p[2],staff:p[3]};
    case 'getDeferredData':
      var p2=await Promise.all([
        _getAll('車両').catch(function(){return[];}),
        _getAll('日報テンプレート').catch(function(){return[];}),
        _getAll('見学体験').catch(function(){return[];})
      ]);
      return{vehicles:p2[0],templates:p2[1],trials:p2[2]};

    // ── 帳票系（クライアント側で完全計算）──
    case 'getAttendanceList': return _calcAttendanceList(a1);
    case 'getWorkTypeSummary': return _calcWorkTypeSummary(a1);
    case 'getUtilizationData': return _calcUtilizationData(a1);
    case 'getWageDetailPerUser': return _calcWageDetailPerUser(a1);
    case 'getAnnualWageDetail': return _calcAnnualWageDetail(a1);
    case 'getWageCSV': return a1?_getLike('出欠','date',a1):_getAll('出欠');
    case 'getServiceRecordData': return _calcServiceRecordData(a1);

    // ── ルート計算（Maps API不要版：概算+Googleマップリンク）──
    case 'calcSmartRoutes': return _calcSmartRoutes(a1,a2,a3);
    case 'calcOptimalRoute': return _calcOptimalRoute(a1,a2);
    case 'calcFixedOrderRoute': return _calcFixedOrderRoute(a1,a2);

    // ── メール送信（要Edge Function → 後日対応）──
    case 'sendPlanEmail':
      throw new Error('メール送信はSupabase Edge Functionで別途対応が必要です');

    // ── アプリURL ──
    case 'getAppUrl': return window.location.origin+window.location.pathname;

    default:
      console.warn('未対応のgas関数:',fn,args);
      throw new Error('Supabaseアダプター: 「'+fn+'」は未対応です');
  }
}

console.log('✅ Supabaseアダプター読み込み完了');

// ═══ ルート計算ヘルパー（Maps API不要版）═══
function _buildMapsUrl(facilityAddr,users,pattern){
  var base='https://www.google.com/maps/dir/';
  var parts=[encodeURIComponent(facilityAddr)];
  for(var i=0;i<users.length;i++)parts.push(encodeURIComponent(users[i].address));
  if(pattern==='morning')parts.push(encodeURIComponent(facilityAddr));
  return base+parts.join('/');
}

async function _calcOptimalRoute(userIds,pattern){
  var allUsers=await _getAll('利用者');var settings=await _getSettings();
  var facilityAddr=settings.facilityAddress||settings.address||'大阪府豊中市小曽根1丁目10-23';
  var ordered=[];
  for(var i=0;i<userIds.length;i++){
    for(var j=0;j<allUsers.length;j++){
      if(String(allUsers[j].id)===String(userIds[i])){
        var u=allUsers[j];var addr=(u.prefecture||'')+(u.city||'')+(u.address||'');
        ordered.push({id:u.id,name:u.name,address:addr});break;
      }
    }
  }
  var totalMin=ordered.length*10+15;var drivingMin=ordered.length*8;
  return{orderedUsers:ordered,totalMinutes:totalMin,drivingMinutes:drivingMin,mapsUrl:_buildMapsUrl(facilityAddr,ordered,pattern)};
}

async function _calcFixedOrderRoute(userIds,pattern){
  return _calcOptimalRoute(userIds,pattern);
}

async function _calcSmartRoutes(userIds,pattern,date){
  var allUsers=await _getAll('利用者');var att=await _getFiltered('出欠','date',date);
  var settings=await _getSettings();
  var facilityAddr=settings.facilityAddress||settings.address||'大阪府豊中市小曽根1丁目10-23';
  var candidates=[];
  for(var i=0;i<userIds.length;i++){
    var u=null;for(var j=0;j<allUsers.length;j++){if(String(allUsers[j].id)===String(userIds[i])){u=allUsers[j];break;}}
    if(!u)continue;
    var addr=(u.prefecture||'')+(u.city||'')+(u.address||'');if(!addr||addr.length<3)continue;
    var rec=null;for(var ai=0;ai<att.length;ai++){if(String(att[ai].userId)===String(u.id)){rec=att[ai];break;}}
    var sTime=(rec&&rec.startTime)?rec.startTime:(u.scheduleStart||'10:00');
    var eTime=(rec&&rec.endTime)?rec.endTime:(u.scheduleEnd||'16:00');
    var timeKey=pattern==='morning'?sTime:eTime;
    var tp=timeKey.split(':');var timeMin=Number(tp[0])*60+Number(tp[1]||0);
    candidates.push({id:u.id,name:u.name,address:addr,startTime:sTime,endTime:eTime,timeKey:timeKey,timeMin:timeMin});
  }
  candidates.sort(function(a,b){return a.timeMin-b.timeMin;});
  if(candidates.length===0)return{trips:[],pattern:pattern};
  // グループ分け：到着/退勤時間が30分以内の利用者を同じ便にまとめる
  var trips=[];var cur=[candidates[0]];
  for(var ci=1;ci<candidates.length;ci++){
    var diff=candidates[ci].timeMin-candidates[ci-1].timeMin;
    // 前の人との時間差が30分以内なら同じ便
    if(diff<=30){cur.push(candidates[ci]);}
    else{trips.push(cur);cur=[candidates[ci]];}
  }
  trips.push(cur);
  // 各トリップの結果
  var results=[];
  for(var ti=0;ti<trips.length;ti++){
    var trip=trips[ti];var routeMin=trip.length*10+15;
    var targetMin=trip[0].timeMin;
    var departTime,arriveTime;
    if(pattern==='morning'){
      var depMin=targetMin-routeMin;if(depMin<0)depMin=0;
      departTime=String(Math.floor(depMin/60)).padStart(2,'0')+':'+String(depMin%60).padStart(2,'0');
      arriveTime=trip[0].timeKey;
    }else{
      departTime=trip[0].timeKey;
      var arrMin=targetMin+routeMin;
      arriveTime=String(Math.floor(arrMin/60)).padStart(2,'0')+':'+String(arrMin%60).padStart(2,'0');
    }
    results.push({tripIndex:ti+1,users:trip,
      userIds:trip.map(function(t){return t.id;}),
      userNames:trip.map(function(t){return t.name;}),
      departTime:departTime,arriveTime:arriveTime,
      totalMinutes:routeMin,drivingMinutes:trip.length*8,
      facilityAddress:facilityAddr,
      mapsUrl:_buildMapsUrl(facilityAddr,trip,pattern),
      timeSlots:trip.map(function(t){return{name:t.name,time:pattern==='morning'?t.startTime:t.endTime};})
    });
  }
  return{trips:results,pattern:pattern,facilityAddress:facilityAddr};
}
// ═══ 帳票計算ヘルパー ═══
function _calcNetH(rec){
  if(!rec.startTime||!rec.endTime)return 0;
  var sp=String(rec.startTime).split(':'),ep=String(rec.endTime).split(':');
  return Math.max(0,(Number(ep[0])*60+Number(ep[1])-Number(sp[0])*60-Number(sp[1])-(Number(rec.breakMin)||0)))/60;
}
function _findWt(wts,amId,pmId){
  var wtAm=null,wtPm=null;
  for(var w=0;w<wts.length;w++){if(String(wts[w].id)===String(amId))wtAm=wts[w];if(String(wts[w].id)===String(pmId))wtPm=wts[w];}
  if(!wtAm&&!wtPm&&wts.length>0){wtAm=wts[0];wtPm=wts[0];}
  else if(!wtAm&&wtPm)wtAm=wtPm;
  else if(wtAm&&!wtPm)wtPm=wtAm;
  return{am:wtAm,pm:wtPm};
}
function _calcRecWage(rec,wts){
  var netH=_calcNetH(rec);if(netH<=0)return{netH:0,wage:0};
  var wt=_findWt(wts,rec.workTypeId||'',(rec.workTypeIdPm&&String(rec.workTypeIdPm)!=='')?rec.workTypeIdPm:rec.workTypeId||'');
  if(!wt.am||String(wt.am.id)===String(wt.pm.id)){return{netH:netH,wage:netH*(wt.am?Number(wt.am.rate):0)};}
  var half=netH/2;return{netH:netH,wage:half*(Number(wt.am.rate)||0)+half*(Number(wt.pm.rate)||0)};
}
function _isBento(rec){return rec.bento&&String(rec.bento)!=='0'&&String(rec.bento)!=='false'&&String(rec.bento)!==''&&String(rec.bento)!=='なし';}
function _isAttend(rec){return['出席','遅刻','早退'].indexOf(rec.status)>=0;}
function _checkKaikin(user,allAtt,ym){
  var recs=allAtt.filter(function(a){return String(a.userId)===String(user.id);});
  var sd=(user.scheduleDays||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
  if(sd.length===0)return false;
  var dowMap={'月':1,'火':2,'水':3,'木':4,'金':5,'土':6,'日':0};
  var p=ym.split('-');var y=Number(p[0]),m=Number(p[1]);
  var dim=new Date(y,m,0).getDate();
  for(var d=1;d<=dim;d++){
    var dt=new Date(y,m-1,d);var dow=['日','月','火','水','木','金','土'][dt.getDay()];
    if(sd.indexOf(dow)<0)continue;
    var ds=ym+'-'+String(d).padStart(2,'0');
    var found=false;for(var i=0;i<recs.length;i++){if(String(recs[i].date)===ds&&_isAttend(recs[i])){found=true;break;}}
    if(!found)return false;
  }
  return true;
}

async function _calcAttendanceList(ym){
  var us=await _getAll('利用者');var wts=await _getAll('作業種別');var att=await _getLike('出欠','date',ym);
  var settings=await _getSettings();var bentoPrice=Number(settings.bentoPrice)||100;var KAIKIN_BONUS=3000;
  var result=[];
  us.forEach(function(user){
    var recs=att.filter(function(a){return String(a.userId)===String(user.id)&&_isAttend(a);});
    if(recs.length===0)return;
    var tWM=0,tBM=0,tW=0,bc=0;
    recs.forEach(function(rec){
      if(!rec.startTime||!rec.endTime)return;
      var sp=String(rec.startTime).split(':'),ep=String(rec.endTime).split(':');
      var wm=Number(ep[0])*60+Number(ep[1])-Number(sp[0])*60-Number(sp[1]);var brk=Number(rec.breakMin)||0;
      tWM+=wm;tBM+=brk;tW+=_calcRecWage(rec,wts).wage;
      if(_isBento(rec))bc++;
    });
    var net=Math.max(0,tWM-tBM);var kk=_checkKaikin(user,att,ym);var bonus=kk?KAIKIN_BONUS:0;
    result.push({id:user.id,name:user.name,serviceType:user.serviceType||'Ｂ型',days:recs.length,workMin:tWM,breakMin:tBM,netMin:net,avgNetMin:recs.length>0?Math.round(net/recs.length):0,bonus:bonus,wage:Math.round(tW),bentoCount:bc,bentoDed:bc*bentoPrice,total:Math.round(tW)+bonus-bc*bentoPrice});
  });
  return{users:result,bentoPrice:bentoPrice};
}

async function _calcWageDetailPerUser(ym){
  var us=await _getAll('利用者');var wts=await _getAll('作業種別');var att=await _getLike('出欠','date',ym);
  var settings=await _getSettings();var bentoPrice=Number(settings.bentoPrice)||100;var KAIKIN_BONUS=3000;
  var companyName=settings.companyName||settings.facilityName||'事業所';
  var payDay=settings.payDay||'翌月23日';
  var yy=Number(ym.split('-')[0]),mm=Number(ym.split('-')[1]);
  var pM=mm+1,pY=yy;if(pM>12){pM=1;pY++;}
  var pD=23;try{pD=Number(payDay.replace(/[^0-9]/g,''))||23;}catch(e){}
  var payDateStr=pY+'年'+pM+'月'+pD+'日';
  var result=[];
  us.forEach(function(user){
    var recs=att.filter(function(a){return String(a.userId)===String(user.id)&&_isAttend(a);});
    if(recs.length===0)return;
    var byWt={},bc=0;
    recs.forEach(function(rec){
      var netH=_calcNetH(rec);if(netH<=0)return;
      var wt=_findWt(wts,rec.workTypeId||'',(rec.workTypeIdPm&&String(rec.workTypeIdPm)!=='')?rec.workTypeIdPm:rec.workTypeId||'');
      if(!wt.am||String(wt.am.id)===String(wt.pm.id)){
        var nm=wt.am?wt.am.name:'未設定';var rt=wt.am?Number(wt.am.rate):0;
        if(!byWt[nm])byWt[nm]={hours:0,rate:rt,wage:0};byWt[nm].hours+=netH;byWt[nm].wage+=netH*rt;
      }else{var hh=netH/2;
        if(!byWt[wt.am.name])byWt[wt.am.name]={hours:0,rate:Number(wt.am.rate)||0,wage:0};byWt[wt.am.name].hours+=hh;byWt[wt.am.name].wage+=hh*(Number(wt.am.rate)||0);
        if(!byWt[wt.pm.name])byWt[wt.pm.name]={hours:0,rate:Number(wt.pm.rate)||0,wage:0};byWt[wt.pm.name].hours+=hh;byWt[wt.pm.name].wage+=hh*(Number(wt.pm.rate)||0);
      }
      if(_isBento(rec))bc++;
    });
    var items=[],wSub=0;Object.keys(byWt).forEach(function(k){var w=byWt[k];var rw=Math.round(w.wage);items.push({name:k,hours:Math.round(w.hours*100)/100,rate:w.rate,wage:rw});wSub+=rw;});
    var kk=_checkKaikin(user,att,ym);var bonus=kk?KAIKIN_BONUS:0;
    result.push({id:user.id,name:user.name,days:recs.length,items:items,workSubtotal:wSub,kaikin:kk,bonus:bonus,bentoCount:bc,bentoDed:bc*bentoPrice,bentoPrice:bentoPrice,total:wSub+bonus-bc*bentoPrice});
  });
  return{ym:ym,companyName:companyName,payDate:payDateStr,users:result,bentoPrice:bentoPrice};
}

async function _calcWorkTypeSummary(ym){
  var us=await _getAll('利用者');var wts=await _getAll('作業種別');var att=await _getLike('出欠','date',ym);
  var p=ym.split('-');var year=Number(p[0]),month=Number(p[1]);
  var dim=new Date(year,month,0).getDate();
  var dowNames=['日','月','火','水','木','金','土'];
  var dayDows=[];for(var d=1;d<=dim;d++)dayDows.push(dowNames[new Date(year,month-1,d).getDay()]);
  var users=[],gWD=new Array(dim).fill(0),gHD=new Array(dim).fill(0),gWT=0,gHT=0,gWC=0;
  us.forEach(function(user){
    var recs=att.filter(function(a){return String(a.userId)===String(user.id)&&_isAttend(a);});
    if(recs.length===0)return;
    var byWt={},uWD=new Array(dim).fill(0),uHD=new Array(dim).fill(0),uWT=0,uHT=0,uWC=0;
    recs.forEach(function(rec){
      var day=Number(String(rec.date).split('-')[2]);if(day<1||day>dim)return;
      var netH=_calcNetH(rec);if(netH<=0)return;
      var wt=_findWt(wts,rec.workTypeId||'',(rec.workTypeIdPm&&String(rec.workTypeIdPm)!=='')?rec.workTypeIdPm:rec.workTypeId||'');
      if(!wt.am||String(wt.am.id)===String(wt.pm.id)){
        var nm=wt.am?wt.am.name:'未設定';var rt=wt.am?Number(wt.am.rate):0;
        if(!byWt[nm])byWt[nm]={wageByDay:new Array(dim).fill(0),hoursByDay:new Array(dim).fill(0),wageTotal:0,hoursTotal:0,count:0};
        byWt[nm].wageByDay[day-1]+=netH*rt;byWt[nm].hoursByDay[day-1]+=netH;byWt[nm].wageTotal+=netH*rt;byWt[nm].hoursTotal+=netH;byWt[nm].count++;
      }else{var hh=netH/2;
        [wt.am,wt.pm].forEach(function(w){var n=w?w.name:'未設定';var r=w?Number(w.rate):0;
          if(!byWt[n])byWt[n]={wageByDay:new Array(dim).fill(0),hoursByDay:new Array(dim).fill(0),wageTotal:0,hoursTotal:0,count:0};
          byWt[n].wageByDay[day-1]+=hh*r;byWt[n].hoursByDay[day-1]+=hh;byWt[n].wageTotal+=hh*r;byWt[n].hoursTotal+=hh;byWt[n].count++;
        });
      }
      var wage=_calcRecWage(rec,wts).wage;
      uWD[day-1]+=wage;uHD[day-1]+=netH;uWT+=wage;uHT+=netH;uWC++;
      gWD[day-1]+=wage;gHD[day-1]+=netH;gWT+=wage;gHT+=netH;gWC++;
    });
    users.push({id:user.id,name:user.name,serviceType:user.serviceType||'Ｂ型',byWt:byWt,wageByDay:uWD,hoursByDay:uHD,wageTotal:Math.round(uWT),hoursTotal:Math.round(uHT*100)/100,workCount:uWC});
  });
  return{ym:ym,daysInMonth:dim,dayDows:dayDows,users:users,grandWageByDay:gWD,grandHoursByDay:gHD,grandWageTotal:Math.round(gWT),grandHoursTotal:Math.round(gHT*100)/100,grandWorkCount:gWC};
}

async function _calcUtilizationData(ym){
  var settings=await _getSettings();var capacity=Number(settings.capacity)||20;
  var p=ym.split('-');var curY=Number(p[0]),curM=Number(p[1]);
  var months=[];for(var mi=14;mi>=0;mi--){var tm=curM-mi,ty=curY;while(tm<1){tm+=12;ty--;}while(tm>12){tm-=12;ty++;}months.push(ty+'-'+String(tm).padStart(2,'0'));}
  var result=[];
  for(var i=0;i<months.length;i++){
    var mym=months[i];var mp=mym.split('-');var myr=Number(mp[0]),mmo=Number(mp[1]);
    var dim2=new Date(myr,mmo,0).getDate();
    var closed=[];try{var cs=settings['closedDays_'+mym];if(cs)closed=JSON.parse(cs);}catch(e){}
    var openDays=dim2-closed.length;
    var mAtt=[];try{mAtt=await _getLike('出欠','date',mym);}catch(e){}
    var totalAttend=0;mAtt.forEach(function(a){if(_isAttend(a))totalAttend++;});
    var maxCap=capacity*openDays;var rate=maxCap>0?Math.round(totalAttend/maxCap*1000)/10:0;
    result.push({ym:mym,label:mym.replace('-','/'),capacity:capacity,openDays:openDays,totalAttend:totalAttend,rate:rate});
  }
  for(var ri=0;ri<result.length;ri++){result[ri].avg3=ri>=2?Math.round((result[ri].rate+result[ri-1].rate+result[ri-2].rate)/3*10)/10:null;}
  return{months:result,facilityName:settings.facilityName||'',facilityType:settings.facilityType||'就労継続支援B型'};
}

async function _calcServiceRecordData(srYm){
  var srAtt=await _getLike('出欠','date',srYm);var srUsers=await _getAll('利用者');var srSettings=await _getSettings();
  var srFn=srSettings.facilityName||'';var srFNum=srSettings.facilityNumber||'';
  var srParts=srYm.split('-');var srY=Number(srParts[0]);var srM=Number(srParts[1]);
  var srDays=new Date(srY,srM,0).getDate();var srDow=['日','月','火','水','木','金','土'];
  var srReiwa='令和'+(srY-2018)+'年'+srM+'月分';var srResult=[];
  srUsers.forEach(function(user){
    var recs=srAtt.filter(function(a){return String(a.userId)===String(user.id);});
    var attendRecs=recs.filter(function(a){return _isAttend(a);});
    if(attendRecs.length===0)return;
    var days=[],totalDays=0,pickupCount=0,dropoffCount=0,mealCount=0;
    for(var d=1;d<=srDays;d++){
      var ds=srYm+'-'+String(d).padStart(2,'0');var dow=srDow[new Date(srY,srM-1,d).getDay()];
      var rec=null;for(var ri=0;ri<recs.length;ri++){if(String(recs[ri].date)===ds){rec=recs[ri];break;}}
      var dd={day:d,dow:dow,status:'',startTime:'',endTime:'',pickup:false,dropoff:false,meal:false,notes:'',signUrl:''};
      if(rec&&_isAttend(rec)){
        totalDays++;dd.status='1';dd.startTime=rec.startTime||'';dd.endTime=rec.endTime||'';
        var pu=String(rec.pickup||'');
        if(pu.indexOf('往')>=0||pu.indexOf('迎')>=0||pu==='往復'||pu==='あり'||pu==='送迎あり'){dd.pickup=true;pickupCount++;}
        if(pu.indexOf('復')>=0||pu.indexOf('送')>=0||pu==='往復'||pu==='あり'||pu==='送迎あり'){dd.dropoff=true;dropoffCount++;}
        if(_isBento(rec)){dd.meal=true;mealCount++;}
        dd.notes=rec.notes||'';dd.signUrl=rec.signature||'';
      }
      days.push(dd);
    }
    srResult.push({id:user.id,name:user.name,recipientNumber:user.recipientNumber||'',contractDays:user.supportDays||'',startDate:user.enrollDate||user.supportStartDate||'',serviceType:user.serviceType||'Ｂ型',days:days,totalDays:totalDays,pickupCount:pickupCount,dropoffCount:dropoffCount,mealCount:mealCount});
  });
  return{ym:srYm,reiwa:srReiwa,facilityName:srFn,facilityNumber:srFNum,users:srResult,daysInMonth:srDays};
}

async function _calcAnnualWageDetail(fiscalYear){
  var fy=Number(fiscalYear);
  var us=await _getAll('利用者');var wts=await _getAll('作業種別');
  var months=[];
  for(var m=4;m<=12;m++)months.push(fy+'-'+String(m).padStart(2,'0'));
  for(var m2=1;m2<=3;m2++)months.push((fy+1)+'-'+String(m2).padStart(2,'0'));
  // 全月の出欠を一括取得
  var allAtt=[];
  for(var mi=0;mi<months.length;mi++){try{var ma=await _getLike('出欠','date',months[mi]);allAtt=allAtt.concat(ma);}catch(e){}}
  var attByMonth={};months.forEach(function(ym){attByMonth[ym]=allAtt.filter(function(a){return String(a.date).indexOf(ym)===0;});});
  var result=[];
  us.forEach(function(user){
    var monthData=[],yearDays=0,yearHours=0,yearWage=0;
    months.forEach(function(ym){
      var att=attByMonth[ym]||[];
      var recs=att.filter(function(a){return String(a.userId)===String(user.id)&&_isAttend(a);});
      var days=recs.length,hours=0,wage=0;
      recs.forEach(function(rec){var cw=_calcRecWage(rec,wts);hours+=cw.netH;wage+=cw.wage;});
      monthData.push({ym:ym,days:days,hours:Math.round(hours*100)/100,wage:Math.round(wage)});
      yearDays+=days;yearHours+=hours;yearWage+=wage;
    });
    if(yearDays===0)return;
    var initials='';var fn=user.furigana||'';
    if(fn){var parts=fn.replace(/\s+/g,' ').trim().split(' ');initials=parts.map(function(p){return p.charAt(0).toUpperCase();}).join('.');}
    result.push({name:user.name,initials:initials,months:monthData,totalDays:yearDays,totalHours:Math.round(yearHours*100)/100,totalWage:Math.round(yearWage)});
  });
  var monthTotals=[];
  for(var mi2=0;mi2<months.length;mi2++){
    var td=0,th=0,tw=0;
    result.forEach(function(u){td+=u.months[mi2].days;th+=u.months[mi2].hours;tw+=u.months[mi2].wage;});
    var mAtt=attByMonth[months[mi2]]||[];
    var uniqueDates={};mAtt.forEach(function(a){if(_isAttend(a))uniqueDates[a.date]=1;});
    monthTotals.push({ym:months[mi2],bizDays:Object.keys(uniqueDates).length,totalDays:td,totalHours:Math.round(th*100)/100,totalWage:Math.round(tw)});
  }
  return{fiscalYear:fy,users:result,monthTotals:monthTotals};
}
