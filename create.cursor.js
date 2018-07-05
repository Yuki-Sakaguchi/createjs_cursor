/**
 * create.jsのライブラリ
 * カーソル追従クラス
 * jQueryには依存していません
 */
var Cursor = function(options) {
    // デフォルトのオプション
    this.options = {
        canvasId: 'canvas',
        fps: 60,
        defaultPointer: true,
        callback_init: null,
        callback_update: null,
    };

    // オプションを継承
    if (options) {
        Object.keys(options).forEach(function(key) {
            this.options[key] = options[key];
        }.bind(this));
    }

    // canvasのelement
    this.elCanvas = document.getElementById(this.options.canvasId);

    // create.jsのstageオブジェクト
    this.stage = new createjs.Stage(this.options.canvasId);

    // マウスがcanvas内にない時の初期位置の設定
    this.stage.mouseX = this.stage.canvas.width / 2;
    this.stage.mouseY = this.stage.canvas.height * 1 / 3;

    // さっきまでのマウスポインターの位置
    this.oldPoint = {
        x: 0,
        y: 0,
    };

    // コールバックがあるか、ある場合使えるか
    this.isCallback = {
        init: this.options.callback_init && typeof this.options.callback_init === 'function',
        update: this.options.callback_update && typeof this.options.callback_update === 'function',
    };

    // デフォルトのポインターを消す
    if (!this.options.defaultPointer) {
        document.getElementsByTagName('body')[0].style.cursor = 'none';
    }

    // 初期化
    this.init();
};


/**
 * 初期化
 */
Cursor.prototype.init = function() {
    // canvasを画面に固定
    this.elCanvas.style.position = 'fixed';
    this.elCanvas.style.top = '0';
    this.elCanvas.style.right = '0';
    this.elCanvas.style.bottom = '0';
    this.elCanvas.style.left = '0';
    this.elCanvas.style.margin = 'auto';
    this.elCanvas.style.zIndex = '1000';
    this.elCanvas.style.pointerEvents = 'none';

    // canvasサイズセット
    this.setCanvasSize();

    // リサイズ完了時にcanvasサイズを変更
    var resizeTimer = 0;
    window.addEventListener('resize', function() {
        if (resizeTimer) clearTimeout(resizeTimer);
        setTimeout(function() {
            this.setCanvasSize();
        }.bind(this), 200);
    }.bind(this));

    // タッチ操作がサポートされていれば有効にする
    if (createjs.Touch.isSupported()) createjs.Touch.enable(stage);

    // マウスの位置を監視
    createjs.Ticker.setFPS(this.options.fps);
    createjs.Ticker.addEventListener('tick', function() {
        this.update();
    }.bind(this));

    // コールバックがあれば実行
    if (this.isCallback.init) {
        this.options.callback_init(this);
    }
};

// canvasのサイズをセット
Cursor.prototype.setCanvasSize = function() {
    this.elCanvas.width = document.documentElement.clientWidth;
    this.elCanvas.height = document.documentElement.clientHeight;
};

// 更新
Cursor.prototype.update = function() {
    // 画面更新
    this.stage.update();

    // 位置を保存
    this.oldPoint.x = this.stage.mouseX;
    this.oldPoint.y = this.stage.mouseY;

    // コールバックがあれば実行
    if (this.isCallback.update) {
        this.options.callback_update(this);
    }
};

// // スマホ判定
// Cursor.prototype.isMobile = function() {};