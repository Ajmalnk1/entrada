(function($) {
    'use strict';

    /********************************
     ********** plugins**************
     *******************************/
      // main elements
    var $body = $('body');
    var $win = $(window);
    var $doc = $(document);
    
     // Apply Stellar Parallax
    $doc.ready(function() {
        $.stellar({
            horizontalScrolling: false,
            verticalOffset: 0
        });
    });

    // modal plugin script
    $('.gallery').modaal({
        type: 'image'
    });

    // modal plugin script
    $('.iframe-video').modaal({
        type: 'video',
        width: 700,
        height: 500
    });

    //  Overwrite Bootstrap Dropdown Feature
    $doc.on('click', '.dropdown', function(e) {
        e.stopPropagation();
    });
    
    // add active class to current state
    $(window).scroll(function() {

        var position = $(this).scrollTop();

        $('.content-box').each(function() {
            var target = $(this).offset().top - 1;
            var id = $(this).attr('id');
            
            if (position >= target) {
                $('#scroll-nav a').removeClass('active');
                $('#scroll-nav a[href=#' + id + ']').addClass('active');
            }
        });
    });

    /**
     * search screen plugin
     * @param {object} options
     */
    function Search(options) {
        this.options = $.extend({
            container: null,
            hideOnClickOutside: false,
            menuActiveClass: 'nav-active',
            menuOpener: '.nav-opener',
            menuDrop: '.nav-drop',
            toggleEvent: 'click.search',
            outsideClickEvent: 'click.search touchstart.search pointerdown.search MSPointerDown.search'
        }, options);
        this.initStructure();
        this.attachEvents();
    }

    Search.prototype = {
        initStructure: function() {
            this.page = $('html');
            this.container = $(this.options.container);
            this.opener = this.container.find(this.options.menuOpener);
            this.drop = this.container.find(this.options.menuDrop);
        },
        attachEvents: function() {
            var self = this;
            if (activateResizeHandler) {
                activateResizeHandler();
                activateResizeHandler = null;
            }
            this.outsideClickHandler = function(e) {
                if (self.isOpened()) {
                    var target = $(e.target);
                    if (!target.closest(self.opener)
                        .length && !target.closest(self.drop)
                        .length) {
                        self.hide();
                    }
                }
            };
            this.openerClickHandler = function(e) {
                e.preventDefault();
                self.toggle();
            };
            this.opener.on(this.options.toggleEvent, this.openerClickHandler);
        },
        isOpened: function() {
            return this.container.hasClass(this.options.menuActiveClass);
        },
        show: function() {
            this.container.addClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.on(this.options.outsideClickEvent,
                    this.outsideClickHandler);
            }
        },
        hide: function() {
            this.container.removeClass(this.options.menuActiveClass);
            if (this.options.hideOnClickOutside) {
                this.page.off(this.options.outsideClickEvent,
                    this.outsideClickHandler);
            }
        },
        toggle: function() {
            if (this.isOpened()) {
                this.hide();
            } else {
                this.show();
            }
        },
        destroy: function() {
            this.container.removeClass(this.options.menuActiveClass);
            this.opener.off(this.options.toggleEvent, this.clickHandler);
            this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
        }
    };

    var activateResizeHandler = function() {
        var win = $win,
            doc = $('html'),
            resizeClass = 'resize-active',
            flag, timer;
        var removeClassHandler = function() {
            flag = false;
            doc.removeClass(resizeClass);
        };
        var resizeHandler = function() {
            if (!flag) {
                flag = true;
                doc.addClass(resizeClass);
            }
            clearTimeout(timer);
            timer = setTimeout(removeClassHandler, 500);
        };
        win.on('resize orientationchange', resizeHandler);
    };

    $.fn.search = function(options) {
        return this.each(function() {
            var params = $.extend({}, options, {
                    container: this
                }),
                instance = new Search(params);
            $.data(this, 'Search', instance);
        });
    };

     // apply search plugin
    $body.search({
        hideOnClickOutside: true,
        menuActiveClass: 'nav-active',
        menuOpener: '.nav-trigger a',
        menuDrop: '.nav-wrap li'
    });
     
}(jQuery));