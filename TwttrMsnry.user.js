// ==UserScript==
// @name         TwttrMsnry
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Apply a Masonry layout to Twitter.com.
// @author       Micah Craig (@micahcraig)
// @match        https://twitter.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require      https://unpkg.com/masonry-layout@4.2.0/dist/masonry.pkgd.js
// ==/UserScript==



(function() {
    'use strict';

    addGlobalStyle(
        '#page-container { width: 100% !important; } ' +
        '.dashboard { width: 15%; } ' +
        '.content-main .stream>.stream-items:not(.recap-module)>.stream-item { float: left; width: 32%; border-radius: 0.25em; margin: 0.25em; } ' +
        '.dashboard-right { position: absolute; top: 60em; } ' +
        '.content-main { width: 83%; } ' +
        '.content-main-wide { width: 98%; } ' +
        '.content-main .twt-msnry-ctrl a { font-size:1.5em; font-weight: bold; z-index: 100; } ' +
        '.content-main .twt-msnry-ctrl a:hover {text-decoration: none; cursor: pointer; } ' +
        '.content-main .twt-msnry-ctrl #increase-columns {position: fixed; right: 1em; top: 1.75em; z-index: 1000; } ' +
        '.content-main .twt-msnry-ctrl #toggle-dash {position: fixed; left: 15.95%; top: 50%;} ' +
        '.content-main .twt-msnry-ctrl #decrease-columns {position: fixed; left: 16%; top: 1.08em; z-index: 1000; font-size: 2em; } ' +
        '.content-main-wide .twt-msnry-ctrl #toggle-dash { left: 1%; } ' +
        '.content-main-wide .twt-msnry-ctrl #decrease-columns { left: 1%; } ' +
        '.content-main .ProfileTweet-actionList { overflow-y: hidden; overflow-x: auto; } ' +
        '.content-main .stream-item.WtfLargeCarouselStreamItem { height: 23em;} ' +
        '.Icon--subtract:before { content: \"\\2012\" } ' );
    $('.stream-container').append("<div class='twt-msnry-ctrl'><a id='increase-columns' class='Icon Icon--medium Icon--add'></a><a id='toggle-dash' class='Icon Icon--medium Icon--dotsVertical'></a><a id='decrease-columns' class='Icon Icon--medium Icon--subtract '></a></div>");

    var COLUMNS_VALUE   = "COLUMNS_VALUE",
        DEFAULT_COLUMNS = 3,
        DASH_VALUE      = "DASH_VALUE",
        numColumns      = GM_getValue(COLUMNS_VALUE, DEFAULT_COLUMNS),
        dashVisible     = GM_getValue(DASH_VALUE, true),
        $grid = $('.stream>.stream-items:not(.conversation-module):not(.recap-module)').masonry({});

    if(! dashVisible) { toggleDash(); }
    if(numColumns != DEFAULT_COLUMNS) { updateColumns(numColumns); }

    $grid.on("DOMNodeInserted", throttle(function() {
        console.log(arguments);
        $grid.masonry('reloadItems').masonry('layout');
    }, 1000));

    $('#toggle-dash').click(function() { toggleDash(! dashVisible); });
    $('#increase-columns').click(function() {
        updateColumns(numColumns + 1);
    });
    $('#decrease-columns').click(function() {
        updateColumns(numColumns - 1);
    });

    function toggleDash(newVal) {
        dashVisible = newVal;
        $('.dashboard').toggle();
        $('.content-main').toggleClass('content-main-wide');
        $grid.masonry('layout');
        //dashVisible = (! dashVisible);
        GM_setValue(DASH_VALUE, dashVisible);
    }

    function updateColumns(num) {
        numColumns = Math.max(0, num);
        var wdth = Math.floor(100/numColumns) - 0.75;
        addGlobalStyle('.content-main .stream>.stream-items:not(.recap-module)>.stream-item { width:' + wdth + '%; }' );
        $grid.masonry('layout');
        GM_setValue(COLUMNS_VALUE, numColumns);
    }

    // Thanks https://remysharp.com/2010/07/21/throttling-function-calls
    function throttle(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

})();
