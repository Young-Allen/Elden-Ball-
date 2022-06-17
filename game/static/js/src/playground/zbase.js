class AcGamePlayground {
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

