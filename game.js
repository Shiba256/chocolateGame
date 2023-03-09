const WIDTH = 540;          //仮想画面の横
const HEIGHT = 800;         //仮想画面の縦

let rWidth;                         //実画面の横
let rHeight;                        //実画面の縦
let vScreen;                       //仮想画面
let ratio = 1;                      //仮想画面と実画面の比率

var mouse_x = 0;               //マウスのx座標
var mouse_y = 0;               //マウスのy座標
var mosueFlag = 0;           //マウスが押されているかのフラグ

let fallObj = [];                  //落下物
var score = 0;                   //スコア
var hiScore = 0;                //ハイスコア

let imgBack;                      //背景画像
let imgMenu;                    //メニュー画像
let imgCho;                       //チョコの画像
let imgMan;                      //男の子
let imgWoman;                 //女の子

var wavBgm;                     //BGM
var wavClear;                    //クリア
var wavSelect;                  //選択
var wavGet;                      //ゲット
var wavStart;                    //スタート

var gameScreen = 0;         //ゲーム画面の遷移
var gameChara = 0;          //操作キャラの種類

var IsLoadMusic = false;    //一度だけ音楽を読み込むフラグ
var second = 0;                 //ゲーム内での秒数

let start = Date.now();      //日時の取得

//ブラウザ起動時の処理
window.onload = function () {
    //画像の読み込み
    imgBack = new Image();
    imgMenu = new Image();
    imgCho = new Image();
    imgMan = new Image();
    imgWoman = new Image();

    imgBack.src = "img/map.png";
    imgMenu.src = "img/menu.png";
    imgCho.src = "img/drop.png";
    imgMan.src = "img/man.GIF";
    imgWoman.src = "img/woman.GIF";

    //音楽の読み込み
    wavSelect = new Audio();
    wavSelect.src = "music/Select.wav"

    //仮想画面の作成
    vScreen = document.createElement("canvas");
    vScreen.width = WIDTH;
    vScreen.height = HEIGHT;

    //画面サイズの変更
    ChangeSize();

    //オブジェクトの生成
    CreateFallObj();

    //仮想画面のコンテキストの取得
    const v = vScreen.getContext("2d");

    //フォントの設定
    v.font = 'bold 24px serif';

    //ブラウザ変更時の処理
    window.addEventListener("resize", function () { ChangeSize(); });

    //60fpsでゲームループを呼び出す
    setInterval(function () { main(); }, 14);

    //秒数カウント
    setInterval(SecondCount, 100);
}

//ミリ秒の取得
const run = () => {
    return Date.now() - start;
}

//ウィンドウの変更
function ChangeSize() {
    //キャンバスの要素を取得
    const ctx = document.getElementById("main");

    //表示画面サイズの取得
    ctx.width = window.innerWidth;
    ctx.height = window.innerHeight;

    //実画面サイズの取得
    rWidth = ctx.width;
    rHeight = ctx.height;

    //アスペクト比を維持してサイズ変更
    if (rWidth / WIDTH < rHeight / HEIGHT) {
        rHeight = rWidth * HEIGHT / WIDTH;
        ratio = rWidth / WIDTH;
    } else {
        rWidth = rHeight * WIDTH / HEIGHT;
        ratio = rHeight / HEIGHT;
    }
}

//オブジェクトの生成
function CreateFallObj(){
    let obj = {
        x: Math.floor(Math.random() * (WIDTH - 30)),
        y: 100,
        count: 0,
        second: 0,
        flag: true,
    };
    fallObj.push(obj);
}

//メイン関数
function main() {
    switch (gameScreen) {
        case 0:
            MenuDraw();
            MenuUpdate();
            break;
        case 1:
            GameDraw();
            GameUpdate();
            break;
    }
}

//秒数カウント
function SecondCount(e = 0) {    
    if (e != 0) {
        second = run();
    }
    return Math.floor((run() - second)/10);
}

//メニューの描画
function MenuDraw() {
    //キャンバスの要素を取得
    const ctx = document.getElementById("main");

    //仮想画面のコンテキストの取得
    const v = vScreen.getContext("2d");

    //	2D描画コンテキストの取得
    const c = ctx.getContext("2d");				

    //画像の表示
    v.drawImage(imgMenu, 0, 0, WIDTH, HEIGHT);

    //文字列の出力
    v.fillText("START!!", WIDTH / 2 - 50, HEIGHT / 3 + 45);
    v.fillText("High Score : " + hiScore, WIDTH / 2 - 90, HEIGHT * 2 / 3 + 45);
    v.fillText("Previous Score :" + score, WIDTH / 2 - 90, HEIGHT * 2 / 3 + 75);
    v.drawImage(imgMan, WIDTH / 2 - 150, HEIGHT * 2 / 3 + 90, 100, 100);
    v.drawImage(imgWoman, WIDTH / 2 + 50, HEIGHT * 2 / 3 + 90, 100, 100);

    //選択の表示
    if (gameChara == 0) {
        v.beginPath();
        v.strokeRect(WIDTH / 2 - 150, HEIGHT * 2 / 3 + 90, 100, 100);
        v.fill();
        v.closePath();
    }
    else {
        v.beginPath();
        v.strokeRect(WIDTH / 2 + 50, HEIGHT * 2 / 3 + 90, 100, 100);
        v.fill();
        v.closePath();
    }

    //実画面へ転送
    c.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);	//	仮想画面のイメージを実画面へ転送
}

//メニューの更新
function MenuUpdate() {

    //クリックされた時に反応
    //タッチ操作
    document.ontouchstart = function (e) {
        if (!IsLoadMusic) {
            wavBgm = new Audio();
            wavClear = new Audio();
            wavGet = new Audio();
            wavStart = new Audio();

            wavBgm.src = "music/BGM.wav"
            wavClear.src = "music/clear.wav"
            wavGet.src = "music/get.wav"
            wavStart.src = "music/detect.wav"
            IsLoadMusic = true;
        }
        var touchElement = e.target;
        mouse_x = e.touches[0].clientX/ratio;
        mouse_y = e.touches[0].clientY / ratio;
    }
    //マウス操作
    document.onmousedown = function (e) {
        if (!IsLoadMusic) {
            wavBgm = new Audio();
            wavClear = new Audio();
            wavGet = new Audio();
            wavStart = new Audio();

            wavBgm.src = "music/BGM.wav"
            wavClear.src = "music/clear.wav"
            wavGet.src = "music/get.wav"
            wavStart.src = "music/detect.wav"
            IsLoadMusic = true;
        }
        wavSelect.play();
        wavSelect.currentTime = 1000;
        if (!e) e = window.event;
        mouse_x = e.clientX/ratio;
        mouse_y = e.clientY / ratio;
    }

    //ボタンがクリックされたら反応
    if (WIDTH / 2 - 200 < mouse_x && mouse_x < WIDTH / 2 + 200 && HEIGHT / 3 - 10 < mouse_y && mouse_y < HEIGHT / 3 + 70) {
        wavStart.play();
        wavBgm.play();
        gameScreen = 1;
        SecondCount(1);
        score = 0;
        for (let i = 0; i < fallObj.length; i++) {
            fallObj[i] = 0;
        }
    }
    if (120 < mouse_x && mouse_x < 220 && 620 < mouse_y && mouse_y < 720) {
        if (gameChara != 0) {
            wavSelect.currentTime = 0;
            wavSelect.play();
            gameChara = 0;
        }
    }
    if ( 320 < mouse_x && mouse_x < 420 && 620 < mouse_y && mouse_y < 720) {
        if (gameChara != 1) {
            wavSelect.currentTime = 0;
            wavSelect.play();
            gameChara = 1;
        }
    }


}

//ゲームの描画
function GameDraw() {
    //キャンバスの要素を取得
    const ctx = document.getElementById("main");

    //仮想画面のコンテキストの取得
    const v = vScreen.getContext("2d");

    //	2D描画コンテキストの取得
    const c = ctx.getContext("2d");				

    //背景の表示
    v.drawImage(imgBack, 0, 0, WIDTH, HEIGHT);

    //操作キャラの表示
    if (gameChara == 0) {
        v.drawImage(imgMan, mouse_x / ratio - 50, HEIGHT * 5 / 6, 100, 100);
    }
    else {
        v.drawImage(imgWoman, mouse_x / ratio - 50, HEIGHT * 5 / 6, 100, 100);
    }
    
    //スコアの表示
    v.fillText("score:" + score, 5, 20);

    //残り時間の表示
    v.fillText("time:" + (3000 - SecondCount()) / 100, 200, 20);

    //落下物のみ計算と描画を同時に行う
    for (let i = 0; i < fallObj.length; i++) {
        let object = fallObj[i];

        //オブジェクトが存在するなら
        if (object.flag) {

            //下に落とす
            object.y += 3 + score / 3000;

            //画像の表示
            v.drawImage(imgCho, object.x, object.y, 50, 50);
            
            //落下物をゲットしたら
            if (mouse_x / ratio - 70 <= object.x && object.x <= mouse_x / ratio + 70 && HEIGHT * 5 / 6 - 10 < object.y && object.y < HEIGHT * 5 / 6 + 10) {
                // 内部カウントの開始
                object.count++;

                //スコアの追加
                score += 100;

                //効果音を鳴らす
                wavGet.currentTime = 0;
                wavGet.play();
                //存在フラグを折る
                object.flag = false;
            }
        }

        //+100のエフェクトの描画
        if (0 < object.count && object.count < 25) {
            object.count++;
            v.fillText("+100", object.x, object.y - object.count);
        }
    }

    //実画面の転送
    c.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);	
}

//ゲームの更新
function GameUpdate() {

    //ランダムでオブジェクトを生成
    if (Math.random() * 50 < 1 + score / 2000) {
        CreateFallObj();
    }

    //触れた瞬間
    //タッチ操作
    document.ontouchstart = function (e) {
        var touchElement = e.target;
        mouse_x = e.touches[0].clientX;
        mouse_y = e.touches[0].clientY;
    }
    //マウス操作
    document.onmousedown = function (e) {
        wavSelect.play();
        wavSelect.currentTime = 1000;
        if (!e) e = window.event;
        mouseFlag = 1;
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    }

    //離した瞬間
    //タッチ操作
    document.ontouchend = function (e) {
        if (!e) e = window.event;
        mouseFlag = -1;
    }
    //マウス操作
    document.onmouseup = function (e) {
        if (!e) e = window.event;
        mouseFlag = -1;
    }

    //動いた時
    //タッチ操作
    document.ontouchmove = function (e) {
        wavSelect.play();
        wavSelect.currentTime = 1000;
        var touchElement = e.target;
        mouse_x = e.touches[0].clientX;
        mouse_y = e.touches[0].clientY;
    }
    //マウス操作
    document.onmousemove = function (e) {
        if (!e) e = window.event;
        if (mouseFlag == 1) {
            mouse_x = e.clientX;
            mouse_y = e.clientY;
        }
    }

    //終了時刻になったら
    if ((3000 - SecondCount()) / 100 <= 0) {
        gameScreen = 0;
        SecondCount(1);
        if (hiScore <= score) {
            wavClear.play();
            hiScore = score;
        }
    }
}