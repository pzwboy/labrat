/*
 * jQuery history plugin
 *
 * Copyright (c) 2006 Taku Sano (Mikage Sawatari)
 * Copyright (c) 2010 AF83
 * Copyright (c) 2010 Sammy Js
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
 * for msie when no initial hash supplied.
 * API rewrite by Lauris Bukðis-Haberkorns
 */

(function($) {

function History()
{
    this._curHash = '';
    this._callback = function(hash){};
};

$.extend(History.prototype, {
    init: function(callback) {
        this._callback = callback;
        this._curHash = location.hash;
        // check for native hash support
        if ('onhashchange' in window) {
            this._callback(this._curHash.replace(/^#/, ''));
            $(window).bind('hashchange', function() {
                               var current_hash = location.hash.replace(/\?.*$/, '');
                               $.history._curHash = current_hash;
                               $.history._callback(current_hash.replace(/^#/, ''));
                           });
        } else {
            var proxy = this;
            if (!this._interval) {
                var every = 100;
                var hashCheck = function() {
                    var current_location = proxy.getLocation();
                    if (!this._last_location ||
                        current_location != this._last_location) {
                        setTimeout(function() {
                                       proxy._curHash = current_location;
                                       proxy._callback(current_location.replace(/^#/, ''));
                                   }, 1);
                             }
                             this._last_location = current_location;
                         };
                         hashCheck();
                         this._interval = setInterval(hashCheck, every);
                         $(window).bind('beforeunload', function() {
                                            clearInterval(proxy._interval);
                                        });
            }
        }
    },

    getLocation: function()
    {
        var matches = window.location.toString().match(/^([^#])*(#.+)$/);
        return matches ? matches[2] : '';
    },

    load: function(hash) {
        var matches = window.location.toString().match(/^([^#])*(#.+)$/);
        var new_location = matches[1] +'#'+hash;
        window.location = new_location;
        this._callback(hash);
    },

    getCurrentHash : function()
    {
        return this._curHash;
    }
});

$(document).ready(function() {
    $.history = new History(); // singleton instance
});

})(jQuery);
