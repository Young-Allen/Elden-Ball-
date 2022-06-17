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

