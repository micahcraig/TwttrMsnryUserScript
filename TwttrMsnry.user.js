// ==UserScript==
// @name         TwttrMsnry
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apply as Masonry layout to Twitter.com.
// @author       Micah Craig (@micahcraig)
// @match        https://twitter.com/
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://unpkg.com/masonry-layout@4.2.0/dist/masonry.pkgd.js
// ==/UserScript==



(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(
        '#page-container { width: 100% !important; } ' +
        '.dashboard { width: 15%; } ' +
        '.content-main .stream-items .stream-item { float: left; width: 32%; border-radius: 0.25em; margin: 0.25em; } ' +
        '.dashboard-right { position: absolute; top: 60em; } ' +
        '.content-main { width: 83%; } ' +
        '.content-main-wide { width: 98%; } ' +
        '.content-main .twt-msnry-ctrl a { font-size:1.5em; font-weight: bold; z-index: 100; } ' +
        '.content-main .twt-msnry-ctrl a:hover {text-decoration: none; cursor: pointer; } ' +
        '.content-main .twt-msnry-ctrl #increase-columns {position: absolute; left: 98%; top: -0.5em;} ' +
        '.content-main .twt-msnry-ctrl #toggle-dash {position: fixed; left: 15.25%; top: 50%;} ' +
        '.content-main .twt-msnry-ctrl #decrease-columns {position: absolute; left: .5em; top: -0.5em;} ' +
        '.content-main-wide .twt-msnry-ctrl #toggle-dash { left: 1%; } ' +
        '.content-main .ProfileTweet-actionList { overflow-y: hidden; overflow-x: auto; } ' +
        '.content-main .stream-item.WtfLargeCarouselStreamItem { height: 23em;} ' );

    var numColumns = 3;

    $('.stream-container').append("<div class='twt-msnry-ctrl'><a id='increase-columns' class='Icon Icon--medium Icon--add'></a><a id='toggle-dash' class='Icon Icon--medium Icon--dotsVertical'></a><a id='decrease-columns' class='Icon Icon--medium '>&#8210;</a></div>");

    var $grid = $('.stream-items:not(.conversation-module)').masonry({
        itemSelector: '.stream-item'
    });

    $grid.on("DOMNodeInserted",function() {
        $grid.masonry('reloadItems').masonry('layout');
    });

    $('#toggle-dash').click(function() {
        $('.dashboard').toggle();
        $('.content-main').toggleClass('content-main-wide');
        $grid.masonry('layout');
    });
    $('#increase-columns').click(function() {
        updateColumns(numColumns + 1);
    });
    $('#decrease-columns').click(function() {
        updateColumns(numColumns - 1);
    });

    function updateColumns(num) {
        numColumns = Math.max(0, num);
        var wdth = Math.floor(100/numColumns) - 0.75;
        addGlobalStyle('.content-main .stream-items .stream-item { width:' + wdth + '%; }' );
        $grid.masonry('layout');
    }

})();
