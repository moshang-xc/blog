import $ from "jquery";

import './common/css/reset.css';
import './common/css/common.scss';
import "./index.scss";

import Router from './common/js/router';
import cfg from './routercfg/index';

let router = new Router(cfg);

//初始化导航栏操作
function initNav(){
    window.$nav = $("#nav-wrapper");

    $nav.off("click.nav-group").on("click.nav-group", ".nav-group", function(){
        let $this = $(this), 
            hash = $this.attr("data-hash"),
            $activeOne = $nav.find(".nav-group.active").not(this);

        $activeOne.children(".item-wrapper").slideUp(200);
            
        if(!$this.hasClass('singel')){
            let $child = $this.children(".item-wrapper");
            $child.slideToggle(200);
        }
        $this.hasClass('active') || (location.hash = hash);
        return false;
    });

    $nav.off("click.nav-item ").on("click.nav-item ", ".nav-item ", function(e){
        e.stopPropagation();
    });
}

let init = () => {
    initNav();
}

init();