class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.stands = [
            "https://s3.bmp.ovh/imgs/2022/06/07/6053d4b2aa52c7a5.png",
            "https://s3.bmp.ovh/imgs/2022/06/07/d9f6f75c71605809.png",
            "https://s3.bmp.ovh/imgs/2022/06/07/44408c7472bbf0d1.png",
            "https://s3.bmp.ovh/imgs/2022/06/07/d638be64951e702c.png",
            "https://s3.bmp.ovh/imgs/2022/06/07/a7b53a17c687e365.png"];

        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field-item-skin">
        <img src="https://s3.bmp.ovh/imgs/2022/06/07/80905358da46ba5c.png" style="width: 100%; height: 100%" class="ac-game-menu-field-item-skin-rotate">
    </div>
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-instruction">
            游戏说明
        </div>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            退出
        </div>
    </div>  
    <div class="ac-game-menu-instruction">
        <div class="ac-game-menu-instruction-close">
        <img src="https://s3.bmp.ovh/imgs/2022/06/06/d8ef8402147f6219.png" style="width: 100%; height: 100%" class="ac-game-menu-instruction-close-img">
        </div>
        <h1 style="text-align: center;">操作说明</h1>
        <p>操作类似于英雄联盟的操作</p>
        <p>1.移动：鼠标右键点击移动</p>
        <p>2.攻击：先按键盘Q键，再点击鼠标左键发射技能攻击你的敌人</p>
        <p>3.闪现：先按键盘F键，再点击鼠标左键闪现到指定位置</p>
        <p>4. ......</p>
    </div>
    <div class="ac-game-menu-chooseSkin">
        <h1 style="color: white">选择你的替身</h>
        <ul>
            <li class="1"><img src="https://s3.bmp.ovh/imgs/2022/06/07/c6e163d021ffd9ad.png" style="width: 100%; height: 100%"></li>
            <li><img src="https://s3.bmp.ovh/imgs/2022/06/07/d8f47a28b93829c0.png" style="width: 100%; height: 100%"></li>
            <li><img src="https://s3.bmp.ovh/imgs/2022/06/07/27500229c614213f.png" style="width: 100%; height: 100%"></li>
            <li><img src="https://s3.bmp.ovh/imgs/2022/06/07/371060d33f458af5.png" style="width: 100%; height: 100%"></li>
            <li><img src="https://i.imgtg.com/2022/06/07/1qQMD.jpg" style="width: 100%; height: 100%"></li>
        </ul>
    </div>
</div>
`);

        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');
        this.$introduction = this.$menu.find('.ac-game-menu-field-item-instruction');
        this.$instruction_menu = this.$menu.find('.ac-game-menu-instruction');
        this.$instruction_close = this.$menu.find('.ac-game-menu-instruction-close-img');
        this.$skin = this.$menu.find('.ac-game-menu-field-item-skin');  //点击显示选择皮肤按钮
        this.$chooseSkin = this.$menu.find('.ac-game-menu-chooseSkin'); //选择皮肤界面
        this.$stand = this.$menu.find('.ac-game-menu-chooseSkin ul li'); //选择皮肤界面


        this.$instruction_menu.hide();
        this.$chooseSkin.hide();

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {     //点击单人模式触发的函数
            outer.hide();
            outer.root.playground.show("single mode");
        })

        this.$multi_mode.click(function () {  //点击多人模式触发的函数
            outer.hide();
            outer.root.playground.show("multi mode");
        })
        this.$settings.click(function () {    //点击设置（退出）触发的函数
            outer.root.settings.logout_on_remote();
        })

        this.$introduction.click(function () {  //点击说明触发的函数
            outer.$instruction_menu.show();
        })
        this.$instruction_close.click(function () {
            outer.$instruction_menu.hide();
        })

        this.$skin.click(function () {  //点击皮肤按钮，显示选择皮肤界面
            outer.$chooseSkin.show();
        })

        this.$stand.click(function () { //点击选择替身
            var a = $(".ac-game-menu-chooseSkin ul li").index(this);
            let standimg = outer.stands[a];
            let changename = outer.root.settings.username;
            $.ajax({
                url: "https://app2349.acapp.acwing.com.cn/settings/changeStand/",
                type: "GET",
                data: {
                    changename: changename,
                    standimg: standimg,
                },
                success: function (resp) {
                    if (resp.result === "success") {
                        console.log(resp.standimg);
                        console.log(resp.changename);
                        location.reload();
                    } else {
                        outer.$register_error_message.html(resp.result);
                    }
                }
            })
        });
    }

    show() {    //显示menu界面
        this.$menu.show();
    }

    hide() {    //关闭menu界面
        this.$menu.hide();
    }


}


let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false; //是否执行过start函数
        this.timedelta = 0; //当前帧距离上一帧的时间间隔
        this.uuid = this.create_uuid(); //为每一个创建的对象赋予一个位移id
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));   //[0, 10)
            res += x;
        }
        return res;
    }

    start() {    //只会在第一帧执行一次
    }

    update() {  //每一帧均会执行一次
    }

    on_destroy() {  //在被销毁前执行一次
    }

    destroy() { //删除掉该物体
        this.on_destroy();  //删除物体前调用一次

        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);   //从i开始移除，只移除一个
                break;
            }
        }
    }

}

let last_timestamp;
//实现每一帧更新，每一帧都会执行
let AC_GAME_ANIMATION = function (timestamp) {

    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start()
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class ChatField {
    constructor(playground) {
        this.playground = playground;

        this.$history = $(`<div class="ac-game-chat-field-history">历史记录</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$input.keydown(function (e) {
            if (e.which === 27) {   //esc
                outer.hide_input();
                return false;
            } else if (e.which === 13) {
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if (text) {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(text);    //向广播发送消息
                }
                return false;
            }
        })
    }

    //有关定时器的函数
    show_history() {
        let outer = this;
        this.$history.fadeIn();

        if (this.func_id) clearTimeout(this.func_id);
        this.func_id = setTimeout(function () {
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 3000)
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username, text) {
        this.show_history();
        let message = `[${username}] ${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_input() {
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $('<canvas tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

    }

    start() {
        this.$canvas.focus();
    }

    update() {
        //每一帧都执行画图函数
        this.render();
    }

    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    //绘制地图的函数
    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}

class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪：0人";
    }
    start() {
    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}class Particle extends AcGameObject {
        constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
                    super();
                    this.playground = playground;
                    this.ctx = this.playground.game_map.ctx;
                    this.x = x;
                    this.y = y;
                    this.radius = radius;
                    this.vx = vx;
                    this.vy = vy;
                    this.color = color;
                    this.speed = speed;
                    this.move_length = move_length;
                    this.friction = 0.9;
                    this.eps = 0.01;
                }

        start() {
                }

        update() {
                    if (this.move_length < this.eps || this.speed < this.eps) {
                          this.destroy();
                          return false;
                    }

                    let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                    this.x += this.vx * moved;
                    this.y += this.vy * moved;
                    this.speed *= this.friction;
                    this.move_length -= moved;
                    this.render();
                }

        render() {
            let scale = this.playground.scale;
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
}

class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        // console.log(character, username, photo)

        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0;    //x方向的速度
        this.vy = 0;    //y方向的速度
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.move_length = 0;   //需要移动的距离

        this.character = character; //判断角色类型
        this.username = username;
        this.photo = photo;

        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.beforeSpeed = speed;
        this.eps = 0.01;
        this.friction = 0.9;
        this.spent_time = 0;    //敌人开始攻击的时间
        this.beattacked = false;
        this.cur_skill = null;  //当前选择的技能
        this.fireballs = [];    //将每个人发送的火球都存下来
        this.snowballs = [];    //将每个人发送的冰球都存下来


        if (this.character !== "robot") {
            this.img = new Image();
            // console.log(this.photo);
            this.img.src = this.photo;
        }

        if (this.character === "me") {
            this.fireball_coldtime = 3;     //火球冷却时间3秒
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.blink_coldtime = 5;    //闪现的冷却时间
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";

        }
    }

    start() {
        this.playground.player_count++;
        this.playground.notice_board.write("已就绪：" + this.playground.player_count + "人");

        if (this.playground.player_count >= 2) {    //房间人数大于等于三人才能开始游戏
            this.playground.state = "fighting";
            this.playground.notice_board.write("Fighting");
        }

        if (this.character === "me") {
            this.add_listening_events();
        } else if (this.character === 'robot') {
            let tx = Math.random() * this.playground.width / this.playground.scale;
            let ty = Math.random() * this.playground.height / this.playground.scale;
            this.move_to(tx, ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (outer.playground.state !== "fighting")
                return true;

            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) { //3是鼠标右键，1是左键，2是中键
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                outer.move_to(tx, ty);

                //将本人移动的函数广播给全体玩家
                if (outer.playground.mode === 'multi mode') {
                    outer.playground.mps.send_move_to(tx, ty);
                }
            } else if (e.which === 1) {  //点击鼠标左键，选择技能
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;

                if (outer.cur_skill === "fireball") {    //q技能(伤害)
                    if (outer.fireball_coldtime > outer.eps)    //大于eps就不能释放技能
                        return false;

                    let fireball = outer.shoot_fireball(tx, ty);
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
                    outer.fireball_coldtime = 3;
                } else if (outer.cur_skill === "snowball") { //w技能(减速）
                    outer.shoot_snowball(tx, ty);
                } else if (outer.cur_skill === "blink") {
                    if (outer.fireball_coldtime > outer.eps)    //大于eps就不能释放技能
                        return false;

                    outer.blink(tx, ty);

                    if (outer.playground.mode === 'multi mode') {
                        outer.playground.mps.send_blink(tx, ty);
                    }
                }

                outer.cur_skill = null;
            }
        });

        this.playground.game_map.$canvas.keydown(function (e) {
            if (e.which === 13) {   //回车键,打开聊天框
                if (outer.playground.mode === "multi mode") {
                    outer.playground.chat_field.show_input();
                    return false;
                }
            } else if (e.which === 27) {    //esc键，退出聊天框
                if (outer.playground.mode === 'multi mode') {
                    outer.playground.chat_field.hide_input();
                    return false;
                }
            }

            if (outer.playground.state !== "fighting")
                return true;

            if (e.which === 81) { //q技能
                if (outer.fireball_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "fireball";
                return false;
            } else if (e.which === 87) { //w技能
                outer.cur_skill = "snowball";
                return false;
            } else if (e.which === 70) {    //f技能，闪现
                if (outer.blink_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "blink";
                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "red";
        let speed = 0.5;
        let move_length = 1;
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
        this.fireballs.push(fireball);

        this.fireball_coldtime = 3;

        return fireball;
    }

    destroy_fireball(uuid) {
        for (let i = 0; i < this.fireballs.length; i++) {
            let fireball = this.fireballs[i];
            if (fireball.uuid === uuid) {
                fireball.destroy();
                break;
            }
        }
    }

    shoot_snowball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let vx = Math.cos(angle), vy = Math.sin(angle);
        let color = "white";
        let speed = 0.5;
        let move_length = 1;
        let snowball = new SnowBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
        this.snowballs.push(snowball);

        this.fireball_coldtime = 3;

        return snowball;
    }

    destroy_snowball(uuid) {
        for (let i = 0; i < this.snowballs.length; i++) {
            let snowball = this.snowballs[i];
            if (snowball.uuid === uuid) {
                snowball.destroy();
                break;
            }
        }
    }

    blink(tx, ty) {
        let d = this.get_dist(this.x, this.y, tx, ty);
        d = Math.min(d, 0.5);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.blink_coldtime = 5;

        this.move_length = 0;   //闪现完停下来
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(angle, damage, skill) {
        if (skill === "fireball") {
            //碰撞产生离子效果
            for (let i = 0; i < 15 + Math.random() * 5; i++) {
                let x = this.x, y = this.y;
                let radius = this.radius * Math.random() * 0.1;
                let angle = Math.PI * 2 * Math.random();
                let vx = Math.cos(angle), vy = Math.sin(angle);
                let speed = this.speed * 10;
                let move_length = this.radius * Math.random() * 10;
                new Particle(this.playground, x, y, radius, vx, vy, this.color, speed, move_length);
            }

            this.radius -= damage;
            if (this.radius < this.eps) {
                this.destroy();
                return false;
            }
            this.damage_x = Math.cos(angle);
            this.damage_y = Math.sin(angle);
            this.damage_speed = damage * 100;
            this.speed *= 1.2;
        } else if (skill === "snowball") {
            let outer = this;
            if (this.beattacked == false) {
                this.speed *= 0.3;
                this.beattacked = true;
                setTimeout(function () {
                    outer.speed = outer.beforeSpeed;
                    outer.beattacked = false;
                }, 1500);
            }
        }
    }

    // #################################
    receive_attack(x, y, angle, damage, ball_uuid, attacker, cur_skill) {
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(angle, damage, cur_skill);
    }

    update() {
        this.spent_time += this.timedelta / 1000;

        if (this.character === "me" && this.playground.state === "fighting") {
            this.update_coldtime();
        }
        this.update_move();
        this.render();
    }

    update_coldtime() {
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(this.fireball_coldtime, 0);

        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(this.blink_coldtime, 0);
    }

    update_move() {
        //敌人随机攻击=
        if (this.character === "robot" && this.spent_time > 4 && Math.random() < 1 / 300.0) {
            let i = Math.floor(Math.random() * this.playground.players.length);
            let player = this.playground.players[i];    //设置robot攻击的人，若为0则只攻击玩家，若为i则为随机攻击
            if (Math.random() < 0.6) {
                this.shoot_fireball(player.x, player.y);
            } else {
                this.shoot_snowball(player.x, player.y);
            }
        }

        if (this.damage_speed > this.eps) {
            //this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        } else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character === "robot") {
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(tx, ty);
                }
            } else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
    }

    render() {
        let scale = this.playground.scale;
        if (this.character !== "robot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

        if (this.character === "me" && this.playground.state === "fighting") {
            this.render_skill_coldtime();
        }
    }

    render_skill_coldtime() {
        let scale = this.playground.scale;
        let x = 1.5, y = 0.9, r = 0.04;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.fireball_coldtime >= this.eps) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, 2 * Math.PI * (1 - this.fireball_coldtime / 3) - Math.PI / 2, false);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            this.ctx.fill();
        }

        //绘制闪现的图标
        x = 1.62, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.blink_coldtime >= this.eps) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, 2 * Math.PI * (1 - this.blink_coldtime / 5) - Math.PI / 2, false);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            this.ctx.fill();
        }
    }

    on_destroy() {
        if (this.character === 'me')
            this.playground.state = 'over';

        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
}

class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();

        if (this.player.character !== "enemy") {
            this.update_attack();
        }

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }
    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage, "fireball");

        if (this.playground.mode === 'multi mode') {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid, "fireball");
        }
        this.destroy();
    }


    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i++) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}

class SnowBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {
    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();
        this.update_atack();

        this.render();
    }

    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_atack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        if (distance < this.radius + player.radius)
            return true;
        return false;
    }
    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage, "snowball");
        this.destroy();
    }


    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let snowballs = this.player.snowballs;
        for (let i = 0; i < snowballs.length; i++) {
            if (snowballs[i] === this) {
                snowballs.splice(i, 1);
                break;
            }
        }
    }

}

class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        this.ws = new WebSocket("wss://app2349.acapp.acwing.com.cn/wss/multiplayer/")

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;
        this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data);  //将json变成字典
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            } else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if (event === 'shoot_fireball') {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            } else if (event === 'attack') {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid, data.cur_skill);
            } else if (event === 'blink') {
                outer.receive_blink(uuid, data.tx, data.ty);
            } else if (event === 'message') {
                outer.receive_message(data.username, data.text);
            }
        };
    }

    send_create_player(username, photo) {
        let outer = this;
        this.ws.send(JSON.stringify({   //将字典变成json
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    get_player(uuid) {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.uuid === uuid) {
                return player;
            }
        }
        return null;
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );
        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_move_to(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'move_to',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }



    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);
        if (player) {
            player.move_to(tx, ty);
        }
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid, cur_skill) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
            'cur_skill': cur_skill,
        }))
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid, cur_skill) {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);
        if (attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker, cur_skill);
        }
    }

    send_blink(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(uuid, tx, ty) {
        let player = this.get_player(uuid);
        if (player) {
            player.blink(tx, ty);
        }
    }

    send_message(text) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'username': outer.playground.root.settings.username,
            'text': text,
        }));
    }

    receive_message(username, text) {
        this.playground.chat_field.add_message(username, text);
    }
}class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $('<div class="ac-game-playground"></div>');

        this.hide();
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    get_random_color(i) {
        let colors = ["skyblue", "green", "pink", "grey", "violet"];
        //return colors[Math.floor(Math.random() * 5)];
        return colors[i];
    }

    start() {
        let outer = this;
        $(window).resize(function () {
            outer.resize();
        })
    }

    update() {
    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if (this.game_map) this.game_map.resize();
    }

    show(mode) {    //打开palyground界面
        let outer = this;
        this.$playground.show();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.mode = mode;
        this.state = "waiting"; //waiting -> fighting -> over
        this.notice_board = new NoticeBoard(this);
        this.player_count = 0;


        this.resize();

        this.players = [];
        //生成玩家
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.15, "me", this.root.settings.username, this.root.settings.photo));
        if (mode === "single mode") {   //生成敌人
            for (let i = 0; i < 7; i++) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(i), 0.15, "robot"));
            }
        } else if (mode === "multi mode") {
            this.chat_field = new ChatField(this);  //创建输入框
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;

            //连接创建成功会回调下面函数
            this.mps.ws.onopen = function () {
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };
        }
    }

    hide() {    //关闭playground界面
        this.$playground.hide();
    }
}

class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";
        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class = "ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app2349.acapp.acwing.com.cn/static/image/settings/acwing_logo.pn">
            <br>
            <div>一键登录</div>
        </div>
    </div>

    <div class="ac-game-settings-register">
       <div class="ac-game-settings-title">
            注册
       </div>
       <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
       </div>
       <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
       </div>
       <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
       </div>
       <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
            <div class="ac-game-settings-error-message">
            </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app2349.acapp.acwing.com.cn/static/image/settings/acwing_logo.pn">
            <br>
            <div>一键登录</div>
        </div>
    </div>
</div>
`)
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        } else {
            this.getinfo_web();
            this.add_listening_events();
        }
    }

    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function () {
            // outer.acwing_login();
        });
    }

    acwing_login() {
        $.ajax({
            url: "https://app2349.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        })
    }

    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function () {
            outer.register();   //跳到注册界面
        });

        this.$login_submit.click(function () {
            outer.login_on_remote();
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function () {
            outer.login();      //跳到登录界面
        })
        this.$register_submit.click(function () {    //点击注册按钮注册
            outer.register_on_remote();
        });
    }

    login_on_remote() {     //在远程服务器上登录
        let outer = this;
        let username = this.$login_username.val();  //取出输入框的值
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url: "https://app2349.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote() {  //在远程服务器上注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "https://app2349.acapp.acwing.com.cn/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function (resp) {
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        })
    }


    logout_on_remote() {
        if (this.platform === "ACAPP") {
            this.root.AcWingOS.api.window.close();
        } else {
            $.ajax({
                url: "https://app2349.acapp.acwing.com.cn/settings/logout/",
                type: "GET",
                success: function (resp) {
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            })
        }
    }

    register() {    //打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    login() {       //打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function (resp) {
            if (resp.result === "success") {
                outer.username = resp.username;
                outer.photo = resp.photo;
                outer.hide();
                outer.root.menu.show();
            }
        });
    }

    getinfo_acapp() {
        let outer = this;
        $.ajax({
            url: "https://app2349.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function (resp) {
                if (resp.result === "success") {
                    outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state);
                }
            }
        })
    }

    getinfo_web() {
        let outer = this;
        $.ajax({
            url: "https://app2349.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function (resp) {
                if (resp.result === "success") {    //登录成功，关闭登录界面，打开主菜单
                    outer.username = resp.username;
                    outer.photo = resp.photo;

                    outer.hide();
                    outer.root.menu.show();
                } else {
                    //outer.register();
                    outer.login();
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}

export class AcGame {
    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS;

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
    }

    start() {
    }
}

