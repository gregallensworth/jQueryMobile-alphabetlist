/*
 * Alphabetlist "plugin" for jQuery Mobile. Attach it to a UL[data-role="listview"]
 * and it will generate an alphabet list down the side, for navigating the list.
 * This is designed for jQuery Mobile, mostly assumptions about the scrolling and headers
 *
 * REQUIREMENT/PREREQUISITE:
 * This uses jquery.viewport.js to determine whether there is a page header within scrolling.
 * You will need that loaded so the :in-viewport pseudo-selector works.
 * 
 * Basic usage:
 * $('ul[data-role="listview"][data-alphabet="true"]').alphabetlist();
 * This creates an alphabetlist, and loads it from the LIs present in the ul listview.
 *
 * For CSS purposes, the alphabetlist is:
 * ul[data-role="alphabetlist"]
 *
 * Other things that can be done:
 * 
 * listview.alphabetlist('refresh')
 * Re-generate the listview's correspnding alphabetlist
 * 
 * listview.alphabetlist('click','W')
 * Trigger a click on a specific letter
 * 
 * listview.data('alphabetlist')
 * Fetch the alphabetlist UL which corresponds to the given listview
 * 
 * alphabetlist.data('listview')
 * Fetch the UL listview which corresponds to the given alphabetlist
 */

(function( $ ){
    // the core logic for a jQuery plugin: a structure of methods and a simple "if" to call the appropriate one
    var methods = {};
    $.fn.alphabetlist = function(method) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.alphabetlist' );
        }
    }

    // method: init
    // accepts an object of config params, presently unused
    methods.init = function(options) {
        // this plugin is only valid to call on UL listview elements
        if (this.attr('data-role') != "listview") throw "alphabetlist: only applicable to data-role=listview elements";

        // initialize a UL for our alphabetlist
        // set up reciprocal .data() references so the listview can fetch the alphabetlist and vice versa
        var alphabetlist = $('<ul></ul>').attr('data-role','alphabetlist');
        this.data('alphabetlist',alphabetlist);
        alphabetlist.data('listview',this);

        // add the alphabetlist UL to the DOM
        this.before(alphabetlist);

        // call refresh() to "re"build the content of the alphabetlist
        methods.refresh.apply(this);

        // done!
        return this;
    };

    // method: refresh
    // re-examine the listview's LIs and re-populate the alphabetlist
    methods.refresh = function() {
        // step 1: compose a list of the first letter of the .text() of all my child LIs
        // this will be letters, as opposed to lettahz which is the (temporary) hash for uniqueness
        var lettahz = {};
        var letters = [];
        this.children('li').each(function () {
            var l = $(this).text().substr(0,1).toUpperCase();
            lettahz[l] = true;
        });
        for (var l in lettahz) letters[letters.length] = l;
        letters.sort();

        // step 2: empty the alphabetlist and repopulate it
        var al = this.data('alphabetlist');
        al.empty();
        for (var i=0, l=letters.length; i<l; i++) {
            $('<li></li>').text(letters[i]).appendTo(al).click(function () {
                var letter   = $(this).text().substr(0,1).toUpperCase();
                var listview = $(this).closest('ul').data('listview'); // this letter's, parent UL's, corresponding listview
                listview.alphabetlist('click',letter);
            });
        }

        // done; call redraw in case the height has changed
        return this.alphabetlist('redraw');
    };

    // method: redraw
    // re-position the alphabetlist onto the screen, along the right-hand side of the screen
    methods.redraw = function() {
        if (typeof $.mobile.activePage === 'undefined') return; // some timing issue during startup

        var alphabetlist = this.data('alphabetlist');

        // find our scroll position, offset the alphabetlist to match
        var top     = $(window).scrollTop();
        var header  = $.mobile.activePage.children('div[data-role="header"]:in-viewport');
        if (header.length) top += header.height() + 10;
        alphabetlist.offset({ top:top });

        // set the line-height such that the letters are evenly spaced and the alphabet bar extends top to bottom
        var height = $(window).height() - 10;
        if (header.length) height -= header.height();
        var howmany = alphabetlist.children('li').length;
        var line_height = Math.round(height / howmany);
        alphabetlist.children('li').css({ 'line-height':line_height+'px' });

        // done!
        return this;
    };

    // method: click
    // parameter: string, the Letter on which to trigger a click
    // re-examine the listview's LIs and re-populate the alphabetlist
    methods.click = function(letter) {
        // look over the listview LIs, for one whose text starts with the selected letter
        var target = null;
        this.children('li').each(function () {
            if (target) return; // already got one, it's very nice
            if ($(this).text().substr(0,1).toUpperCase() != letter) return; // not a match
            target = $(this); // bingo!
        });
        if (! target) return;

        // scroll the listview to that item
        var offset = target.offset();
        $.mobile.silentScroll(offset.top);

        // the scroll is asynchronous, so may or may not happen yet, so use async
        // to reposition the alphabetlist UL in the upper-right corner again
        var myself = this;
        setTimeout(function () {
            myself.alphabetlist('redraw');
        },100);

        // done!
        return this;
    }

    // done!
    return this;
})( jQuery );