const WIDTH = 540;          //���z��ʂ̉�
const HEIGHT = 800;         //���z��ʂ̏c

let rWidth;                         //����ʂ̉�
let rHeight;                        //����ʂ̏c
let imgBack;                      //�w�i�摜
let imgMenu;                    //���j���[�摜
let imgCho;
let imgMan;
let imgWoman;
let vScreen;                       //���z���
let ratio = 1;                      //���z��ʂƎ���ʂ̔䗦

var mouse_x = 0;               //�}�E�X��x���W
var mosue_y = 0;               //�}�E�X��y���W
var mosueFlag = 0;           //�}�E�X��������Ă��邩�̃t���O

let fallObj = [];                  //������
var score = 0;                   //�X�R�A
var hiScore = 0;                //�n�C�X�R�A

var gameScreen = 0;         //�Q�[����ʂ̑J��
var gameChara = 0;

var second = 0;                 //�Q�[�����ł̕b��

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
    setInterval(SecondCount, 1000);
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
        second = 0;
    } else {
        second++;
    }
    return second;
}

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
    v.drawImage(imgMan, WIDTH / 2 - 150, HEIGHT * 2 / 3 + 90, 100, 100);
    v.drawImage(imgWoman, WIDTH / 2 + 50, HEIGHT * 2 / 3 + 90, 100, 100);

    //�I���̕\��
    if (gameChara == 0) {
        v.beginPath();
        v.strokeRect(WIDTH / 2 - 150, HEIGHT * 2 / 3 + 90, 100, 100);
        v.fill();
        v.closePath();
    } else {
        v.beginPath();
        v.strokeRect(WIDTH / 2 + 50, HEIGHT * 2 / 3 + 90, 100, 100);
        v.fill();
        v.closePath();
    }

    //����ʂ֓]��
    c.drawImage(vScreen, 0, 0, vScreen.width, vScreen.height, 0, 0, rWidth, rHeight);	//	���z��ʂ̃C���[�W������ʂ֓]��
}

function MenuUpdate() {

    //�N���b�N���ꂽ���ɔ���
    //�^�b�`����
    document.ontouchstart = function (e) {
        if (!e) e = window.event;
        var touchElement = e.target;
        mouse_x = e.touches[0].clientX;
        mouse_y = e.touches[0].clientY;
    }
    //�}�E�X����
    document.onmousedown = function (e) {
        if (!e) e = window.event;
        mouse_x = e.clientX;
        mouse_y = e.clientY;
    }

    //�{�^�����N���b�N���ꂽ�甽��
    if (WIDTH/2 - 170< mouse_x && mouse_x < WIDTH/2 + 270 && HEIGHT/3 + 20< mouse_y && mouse_y < HEIGHT/3 + 150) {
        gameScreen = 1;
        SecondCount(1);
        score = 0;
        for (let i = 0; i < fallObj.length; i++) {
            fallObj[i] = 0;
        }
    }
    if (WIDTH / 2 - 150 < mouse_x && mouse_x < WIDTH / 2 - 50 && HEIGHT * 5 / 6 + 120 < mouse_y && mouse_y < HEIGHT * 5 / 6 + 240) {
        gameChara = 0;
    }
    if (WIDTH / 2 + 150 < mouse_x && mouse_x < WIDTH / 2 + 250 && HEIGHT * 5 / 6 + 120 < mouse_y && mouse_y < HEIGHT * 5 / 6 + 240) {
        gameChara = 1;
    }


}

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
    } else {
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
            if (mouse_x / ratio - 100 <= object.x && object.x <= mouse_x / ratio + 100 && HEIGHT * 5 / 6 - 10 < object.y && object.y < HEIGHT * 5 / 6 + 10) {
                // �����J�E���g�̊J�n
                object.count++;

                //�X�R�A�̒ǉ�
                score += 100;

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

function GameUpdate() {

    //�����_���ŃI�u�W�F�N�g�𐶐�
    if (Math.random() * 50 < 1 + score / 2000) {
        CreateFallObj();
    }

    //�G�ꂽ�u��
    //�^�b�`����
    document.ontouchstart = function (e) {
        if (!e) e = window.event;
        mouseFlag = 1;
        mouse_x = e.clientX;
        mosue_y = e.clientY;
    }
    //�}�E�X����
    document.onmousedown = function (e) {
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
        if (!e) e = window.event;
        if (mouseFlag == 1) {
            mouse_x = e.clientX;
            mouse_y = e.clientY;
        }
    }
    //�}�E�X����
    document.onmousemove = function (e) {
        if (!e) e = window.event;
        if (mouseFlag == 1) {
            mouse_x = e.clientX;
            mouse_y = e.clientY;
        }
    }

    if ((3000 - SecondCount()) / 100 <= 0) {
        gameScreen = 0;
        SecondCount(1);
        if (hiScore <= score) {
            hiScore = score;
        }
    }
}