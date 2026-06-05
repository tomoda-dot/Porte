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

// オブジェクトからテーブルに存在するカラムだけ抽出
async function _filterCols(table,obj){
  var cols=await _getCols(table);
  if(!cols)return obj; // キャッシュなし（空テーブル）→そのまま
  var filtered={};
  for(var i=0;i<cols.length;i++){
    var k=cols[i];
    if(obj[k]!==undefined)filtered[k]=obj[k];
  }
  return filtered;
}

// テーブルから全件取得
async function _getAll(table){var r=await supabase.from(table).select('*');if(r.error)_throwErr(r.error);return r.data||[];}

// テーブルからフィルタ取得
async function _getFiltered(table,col,val){var r=await supabase.from(table).select('*').eq(col,val);if(r.error)_throwErr(r.error);return r.data||[];}

// 前方一致フィルタ（日付のym検索用）
async function _getLike(table,col,prefix){var r=await supabase.from(table).select('*').like(col,prefix+'%');if(r.error)_throwErr(r.error);return r.data||[];}

// 以上フィルタ
async function _getGte(table,col,val){var r=await supabase.from(table).select('*').gte(col,val).order(col);if(r.error)_throwErr(r.error);return r.data||[];}

// 追加（カラムフィルタ付き）
async function _add(table,obj){var safe=await _filterCols(table,obj);var r=await supabase.from(table).insert([safe]).select();if(r.error)_throwErr(r.error);return(r.data&&r.data[0])||obj;}

// 更新（カラムフィルタ付き）
async function _update(table,obj){var id=obj.id;var safe=await _filterCols(table,obj);var r=await supabase.from(table).update(safe).eq('id',id).select();if(r.error)_throwErr(r.error);return(r.data&&r.data[0])||obj;}

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
  var r=await supabase.from('設定').select('id').eq('key',key).limit(1);
  if(r.data&&r.data.length>0){
    await supabase.from('設定').update({value:value}).eq('key',key);
  }else{
    await supabase.from('設定').insert([{id:_genId('st'),key:key,value:value}]);
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
    case 'getStaff': return _getAll('スタッフ');
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

    // ── 帳票系（クライアント側で計算）──
    case 'getAttendanceList': return a1?_getLike('出欠','date',a1):_getAll('出欠');
    case 'getServiceRecordData':
      var srAtt=await _getLike('出欠','date',a1);
      var srUsers=await _getAll('利用者');
      var srSettings=await _getSettings();
      return{attendance:srAtt,users:srUsers,settings:srSettings,reiwa:''};
    case 'getUtilizationData': return a1?_getLike('出欠','date',a1):_getAll('出欠');
    case 'getAnnualWageDetail': return _getLike('出欠','date',a1);
    case 'getWageDetailPerUser':
      var wdAtt=await _getLike('出欠','date',a2);
      return wdAtt.filter(function(x){return String(x.userId)===String(a1);});
    case 'getWageCSV': return a1?_getLike('出欠','date',a1):_getAll('出欠');
    case 'getWorkTypeSummary': return a1?_getLike('出欠','date',a1):_getAll('出欠');

    // ── ルート計算（要Maps API → 後日対応）──
    case 'calcFixedOrderRoute':
    case 'calcOptimalRoute':
    case 'calcSmartRoutes':
      throw new Error('ルート計算はSupabase移行後に別途対応が必要です');

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
