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


