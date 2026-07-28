/**
 * 国保連レセプト（CSV）出力モジュール
 * 障害福祉サービス（就労継続支援B型 / 居宅介護 / サービス提供実績記録票 等）対応
 * 
 * 参照仕様: 国保連レセプト仕様_コンテキスト.md (docs/kokuho_spec.md)
 * 文字コード: Shift-JIS (CP932)
 * 改行コード: CRLF (\r\n)
 */

(function (global) {
  'use strict';

  var KokuhoReceiptGenerator = {
    // サービス種類コード
    SERVICE_TYPES: {
      KYOTAKU: '11',        // 居宅介護
      JUTO_HOUMON: '12',    // 重度訪問介護
      SEIKATSU: '22',       // 生活介護
      TANKI_NYUSHO: '24',   // 短期入所
      GROUP_HOME: '33',     // 共同生活援助 (グループホーム)
      SHUUKO_IKOU: '43',    // 就労移行支援
      SHUUKO_B: '46',       // 就労継続支援B型
      KEIKAKU_SOUDAN: '52'  // 計画相談支援
    },

    // データ種別
    DATA_TYPES: {
      J11: 'J11', // 介護給付費・訓練等給付費等請求書 (様式461等)
      J21: 'J21', // 介護給付費・訓練等給付費等明細書 (様式462等)
      J61: 'J61', // サービス提供実績記録票 (様式473等)
      K11: 'K11'  // 障害児施設給付費請求書等
    },

    /**
     * 数値のゼロパディング (前ゼロ埋め)
     * @param {number|string} val 
     * @param {number} length 
     * @returns {string}
     */
    padZero: function (val, length) {
      var s = String(val === null || val === undefined ? '' : val).trim();
      while (s.length < length) {
        s = '0' + s;
      }
      return s;
    },

    /**
     * CSV項目エスケープ (ダブルクォーテーション処理)
     * @param {any} val 
     * @returns {string}
     */
    escapeCsvCell: function (val) {
      if (val === null || val === undefined) return '';
      var s = String(val);
      // カンマ、スペース、改行、ダブルクォーテーションを含む場合は囲む
      if (/[",\r\n\s]/.test(s) || /[\u3000-\u9FFF]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    },

    /**
     * (1) コントロールレコード (Record Type 1) 生成
     * @param {Object} opts
     * @param {number} opts.dataRecordCount データレコード(種別2)の総件数
     * @param {string} opts.dataType データ種別 (例: 'J11', 'J21', 'J61')
     * @param {string} opts.facilityNumber 事業所番号 (10桁)
     * @param {string} opts.targetYm 処理対象年月 (YYYYMM例: '202603')
     * @param {string} [opts.cityNumber='000000'] 市町村番号 (6桁)
     * @param {string} [opts.prefectureNumber='00'] 都道府県番号 (2桁)
     * @returns {string} CSV行 (CRLF前まで)
     */
    createControlRecord: function (opts) {
      var recordType = '1';
      var recordNo = this.padZero(1, 9);
      var volumeNo = '000';
      var dataCount = this.padZero(opts.dataRecordCount, 9);
      var dataType = (opts.dataType || 'J11').padEnd(3, ' ').substring(0, 3);
      var cityNo = this.padZero(opts.cityNumber || 0, 6);
      var facilityNo = this.padZero(opts.facilityNumber || '', 10);
      var prefNo = this.padZero(opts.prefectureNumber || 0, 2);
      var mediaType = '1'; // インターネット伝送
      var targetYm = String(opts.targetYm || '').replace(/[^0-9]/g, '').substring(0, 6);
      var reserve = '      '; // 6バイトブランク

      return [
        recordType,
        recordNo,
        volumeNo,
        dataCount,
        dataType,
        cityNo,
        facilityNo,
        prefNo,
        mediaType,
        targetYm,
        reserve
      ].join(',');
    },

    /**
     * (2) データレコード (Record Type 2) 行生成
     * @param {number} lineIndex レコード番号通番 (2から始まる数値)
     * @param {Array<any>} fields データ項目配列
     * @returns {string} CSV行
     */
    createDataRecordLine: function (lineIndex, fields) {
      var recordType = '2';
      var recordNo = this.padZero(lineIndex, 9);
      var escapedFields = (fields || []).map(this.escapeCsvCell.bind(this));
      return [recordType, recordNo].concat(escapedFields).join(',');
    },

    /**
     * (3) エンドレコード (Record Type 3) 生成
     * @param {number} totalLineCount ファイル全体の最終行番号 (全行数)
     * @returns {string} CSV行
     */
    createEndRecord: function (totalLineCount) {
      var recordType = '3';
      var recordNo = this.padZero(totalLineCount, 9);
      return [recordType, recordNo].join(',');
    },

    /**
     * コントロール・データ・エンドレコードをまとめた完全な国保連伝送用CSVテキスト文字列(CRLF)の生成
     * @param {Object} params
     * @param {string} params.dataType データ種別 (例: 'J11')
     * @param {string} params.facilityNumber 事業所番号 (10桁)
     * @param {string} params.targetYm 審査対象年月 (YYYYMM)
     * @param {Array<Array<any>>} params.dataRows データレコード配列
     * @param {string} [params.cityNumber='000000']
     * @param {string} [params.prefectureNumber='00']
     * @returns {string} CRLF改行のCSV文字列
     */
    buildReceiptCsvText: function (params) {
      var dataRows = params.dataRows || [];
      var dataRecordCount = dataRows.length;
      
      var lines = [];

      // 1. コントロールレコード (行番号: 1)
      var ctrlRec = this.createControlRecord({
        dataRecordCount: dataRecordCount,
        dataType: params.dataType || 'J11',
        facilityNumber: params.facilityNumber,
        targetYm: params.targetYm,
        cityNumber: params.cityNumber,
        prefectureNumber: params.prefectureNumber
      });
      lines.push(ctrlRec);

      // 2. データレコード (行番号: 2 ～ N-1)
      for (var i = 0; i < dataRows.length; i++) {
        var lineIndex = i + 2;
        var dataLine = this.createDataRecordLine(lineIndex, dataRows[i]);
        lines.push(dataLine);
      }

      // 3. エンドレコード (行番号: N = dataRecordCount + 2)
      var totalLineCount = dataRecordCount + 2;
      var endRec = this.createEndRecord(totalLineCount);
      lines.push(endRec);

      // CRLFで連結
      return lines.join('\r\n') + '\r\n';
    },

    /**
     * 就労継続支援B型（サービスコード 46）用サービス提供実績記録票データ行の組み立てサンプル
     * @param {Object} record
     * @returns {Array<any>}
     */
    formatShuukouBServiceRecordRow: function (record) {
      return [
        '4611',                                       // 交換情報識別 code
        this.padZero(record.recipientNumber || '', 10), // 受給者証番号 (10桁前ゼロ)
        record.userName || '',                         // 利用者氏名
        record.serviceType || '46',                   // サービス種類コード (46: 就労継続支援B型)
        record.date || '',                            // サービス提供年月日 (YYYYMMDD)
        record.startTime || '',                       // 開始時間 (HHMM)
        record.endTime || '',                         // 終了時間 (HHMM)
        record.actualHours || 0,                      // 算定時間
        record.pickupFlag ? '1' : '0',                // 送迎加算フラグ
        record.mealFlag ? '1' : '0',                  // 食事提供加算フラグ
        record.remarks || ''                          // 備考
      ];
    },

    /**
     * UTF-8文字列を Shift-JIS (CP932) ByteArray に変換
     * Browser / Node.js 両対応 (Encoding.js があれば最優先、次いで TextEncoder, またはフォールバック処理)
     * @param {string} str 
     * @returns {Uint8Array}
     */
    encodeShiftJIS: function (str) {
      if (typeof global.Encoding !== 'undefined' && global.Encoding.convert) {
        // Encoding.js が読み込まれている場合
        var unicodeArray = global.Encoding.stringToCode(str);
        var sjisBytes = global.Encoding.convert(unicodeArray, {
          to: 'SJIS',
          from: 'UNICODE'
        });
        return new Uint8Array(sjisBytes);
      }

      // Browser API: TextEncoder (Shift-JIS support via polyfill / browser capabilities if available)
      try {
        if (typeof TextEncoder !== 'undefined') {
          var encoder = new TextEncoder('shift-jis', { NONSTANDARD_allowLegacyEncoding: true });
          return encoder.encode(str);
        }
      } catch (e) {
        // Shift-JIS not directly built-in via TextEncoder
      }

      // ASCII / CP932 基本互換変換フォールバック
      var buf = new Uint8Array(str.length);
      for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        buf[i] = code < 128 ? code : 0x3F; // 非ASCII文字は'?'(0x3F)に変換
      }
      return buf;
    },

    /**
     * ブラウザ上で CSV ファイルのダウンロードを実行
     * @param {string} csvText 
     * @param {string} filename 
     */
    downloadCsv: function (csvText, filename) {
      var sjisUint8 = this.encodeShiftJIS(csvText);
      var blob = new Blob([sjisUint8], { type: 'text/csv;charset=shift-jis;' });
      var defaultFilename = filename || ('kokuho_receipt_' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '.CSV');

      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, defaultFilename);
      } else {
        var link = document.createElement('a');
        if (link.download !== undefined) {
          var url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', defaultFilename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    }
  };

  // Export module for Browser & Node
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KokuhoReceiptGenerator;
  } else {
    global.KokuhoReceiptGenerator = KokuhoReceiptGenerator;
  }

})(typeof window !== 'undefined' ? window : this);
