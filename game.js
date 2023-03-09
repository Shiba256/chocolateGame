const WIDTH = 540;          //���z��ʂ̉�
const HEIGHT = 800;         //���z��ʂ̏c

let rWidth;                         //����ʂ̉�
let rHeight;                        //����ʂ̏c
let vScreen;                       //���z���
let ratio = 1;                      //���z��ʂƎ���ʂ̔䗦

var mouse_x = 0;               //�}�E�X��x���W
var mouse_y = 0;               //�}�E�X��y���W
var mosueFlag = 0;           //�}�E�X��������Ă��邩�̃t���O

let fallObj = [];                  //������
var score = 0;                   //�X�R�A
var hiScore = 0;                //�n�C�X�R�A

let imgBack;                      //�w�i�摜
let imgMenu;                    //���j���[�摜
let imgCho;                       //�`���R�̉摜
let imgMan;                      //�j�̎q
let imgWoman;                 //���̎q

var wavBgm;                     //BGM
var wavClear;                    //�N���A
var wavSelect;                  //�I��
var wavGet;                      //�Q�b�g
var wavStart;                    //�X�^�[�g

var gameScreen = 0;         //�Q�[����ʂ̑J��
var gameChara = 0;          //����L�����̎��

var IsLoadMusic = false;    //��x�������y��ǂݍ��ރt���O
var second = 0;                 //�Q�[�����ł̕b��

let start = Date.now();      //�����̎擾

//�u���E�U�N�����̏���
window.onload = function () {
    //�摜�̓ǂݍ���
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

    //���y�̓ǂݍ���
    wavSelect = new Audio();
    wavSelect.src = "music/Select.wav"

    //���z��ʂ̍쐬
    vScreen = document.createElement("canvas");
    vScreen.width = WIDTH;
    vScreen.height = HEIGHT;

    //��ʃT�C�Y�̕ύX
    ChangeSize();

    //�I�u�W�F�N�g�̐���
    CreateFallObj();

    //���z��ʂ̃R���e�L�X�g�̎擾
    const v = vScreen.getContext("2d");

    //�t�H���g�̐ݒ�
    v.font = 'bold 24px serif';

    //�u���E�U�ύX���̏���
    window.addEventListener("resize", function () { ChangeSize(); });

    //60fps�ŃQ�[�����[�v���Ăяo��
    setInterval(function () { main(); }, 14);

    //�b���J�E���g
    setInterval(SecondCount, 100);
}

//�~���b�̎擾
const run = () => {
    return Date.now() - start;
}

//�E�B���h�E�̕ύX
function ChangeSize() {
    //�L�����o�X�̗v�f���擾
    const ctx = document.getElementById("main");

    //�\����ʃT�C�Y�̎擾
    ctx.width = window.innerWidth;
    ctx.height = window.innerHeight;

    //����ʃT�C�Y�̎擾
    rWidth = ctx.width;
    rHeight = ctx.height;

    //�A�X�y�N�g����ێ����ăT�C�Y�ύX
    if (rWidth / WIDTH < rHeight / HEIGHT) {
        rHeight = rWidth * HEIGHT / WIDTH;
        ratio = rWidth / WIDTH;
    } else {
        rWidth = rHeight * WIDTH / HEIGHT;
        ratio = rHeight / HEIGHT;
    }
}

//�I�u�W�F�N�g�̐���
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

//���C���֐�
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

//�b���J�E���g
function SecondCount(e = 0) {    
    if (e != 0) {
        second = run();
    }
    return Math.floor((run() - second)/10);
}

//���j���[�̕`��
function MenuDraw() {
    //�L�����o�X�̗v�f���擾
    const ctx = document.getElementById("main");

    //���z��ʂ̃R���e�L�X�g�̎擾
    const v = vScreen.getContext("2d");

    //	2D�`��R���e�L�X�g�̎擾
    const c = ctx.getContext("2d");				

    //�摜�̕\��
    v.drawImage(imgMenu, 0, 0, WIDTH, HEIGHT);

    //������̏o��
    v.fillText("START!!", WIDTH / 2 - 50, HEIGHT / 3 + 45);
    v.fillText("High Score : " + hiScore, WIDTH / 2 - 90, HEIGHT * 2 / 3 + 45);
    v.fillText("Previous Score :" + score, WIDTH / 2 - 90, HEIGHT * 2 / 3 + 75);
    v.drawImage(imgMan, WIDTH / 2 - 150, HEIGHT * 2 / 3 + 90, 100, 100);
    v.drawImage(imgWoman, WIDTH / 2 + 50, HEIGHT * 2 / 3 + 90, 100, 100);

    //�I���̕\��
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

    //����ʂ֓]��
    c.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);	//	���z��ʂ̃C���[�W������ʂ֓]��
}

//���j���[�̍X�V
function MenuUpdate() {

    //�N���b�N���ꂽ���ɔ���
    //�^�b�`����
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
    //�}�E�X����
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

    //�{�^�����N���b�N���ꂽ�甽��
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

//�Q�[���̕`��
function GameDraw() {
    //�L�����o�X�̗v�f���擾
    const ctx = document.getElementById("main");

    //���z��ʂ̃R���e�L�X�g�̎擾
    const v = vScreen.getContext("2d");

    //	2D�`��R���e�L�X�g�̎擾
    const c = ctx.getContext("2d");				

    //�w�i�̕\��
    v.drawImage(imgBack, 0, 0, WIDTH, HEIGHT);

    //����L�����̕\��
    if (gameChara == 0) {
        v.drawImage(imgMan, mouse_x / ratio - 50, HEIGHT * 5 / 6, 100, 100);
    }
    else {
        v.drawImage(imgWoman, mouse_x / ratio - 50, HEIGHT * 5 / 6, 100, 100);
    }
    
    //�X�R�A�̕\��
    v.fillText("score:" + score, 5, 20);

    //�c�莞�Ԃ̕\��
    v.fillText("time:" + (3000 - SecondCount()) / 100, 200, 20);

    //�������̂݌v�Z�ƕ`��𓯎��ɍs��
    for (let i = 0; i < fallObj.length; i++) {
        let object = fallObj[i];

        //�I�u�W�F�N�g�����݂���Ȃ�
        if (object.flag) {

            //���ɗ��Ƃ�
            object.y += 3 + score / 3000;

            //�摜�̕\��
            v.drawImage(imgCho, object.x, object.y, 50, 50);
            
            //���������Q�b�g������
            if (mouse_x / ratio - 70 <= object.x && object.x <= mouse_x / ratio + 70 && HEIGHT * 5 / 6 - 10 < object.y && object.y < HEIGHT * 5 / 6 + 10) {
                // �����J�E���g�̊J�n
                object.count++;

                //�X�R�A�̒ǉ�
                score += 100;

                //���ʉ���炷
                wavGet.currentTime = 0;
                wavGet.play();
                //���݃t���O��܂�
                object.flag = false;
            }
        }

        //+100�̃G�t�F�N�g�̕`��
        if (0 < object.count && object.count < 25) {
            object.count++;
            v.fillText("+100", object.x, object.y - object.count);
        }
    }

    //����ʂ̓]��
    c.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);	
}

//�Q�[���̍X�V
function GameUpdate() {

    //�����_���ŃI�u�W�F�N�g�𐶐�
    if (Math.random() * 50 < 1 + score / 2000) {
        CreateFallObj();
    }

    //�G�ꂽ�u��
    //�^�b�`����
    document.ontouchstart = function (e) {
        var touchElement = e.target;
        mouse_x = e.touches[0].clientX;
        mouse_y = e.touches[0].clientY;
    }
    //�}�E�X����
    document.onmousedown = function (e) {
        wavSelect.play();
        wavSelect.currentTime = 1000;
        if (!e) e = window.event;
        mouseFlag = 1;
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    }

    //�������u��
    //�^�b�`����
    document.ontouchend = function (e) {
        if (!e) e = window.event;
        mouseFlag = -1;
    }
    //�}�E�X����
    document.onmouseup = function (e) {
        if (!e) e = window.event;
        mouseFlag = -1;
    }

    //��������
    //�^�b�`����
    document.ontouchmove = function (e) {
        wavSelect.play();
        wavSelect.currentTime = 1000;
        var touchElement = e.target;
        mouse_x = e.touches[0].clientX;
        mouse_y = e.touches[0].clientY;
    }
    //�}�E�X����
    document.onmousemove = function (e) {
        if (!e) e = window.event;
        if (mouseFlag == 1) {
            mouse_x = e.clientX;
            mouse_y = e.clientY;
        }
    }

    //�I�������ɂȂ�����
    if ((3000 - SecondCount()) / 100 <= 0) {
        gameScreen = 0;
        SecondCount(1);
        if (hiScore <= score) {
            wavClear.play();
            hiScore = score;
        }
    }
}