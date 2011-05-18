
if (!('Aino' in this)) {
    throw new Error('Aino not defined');
}

this.Aino.modal = (function($, window, undefined) {
    
    var 
        // the "constructor"
        modal = function() {
            return modal.open.apply(modal, Aino.array( arguments ));
        },
        
        // elements holder
        el = {},
        
        // flag the init
        initialized = false,
        
        // cache path
        path = Aino.getScriptPath(),
        
        // default options
        defaults = {
            loadCSS: true,
            duration: 200,
            className: '',
            opacity: .6,
            focus: true
        },
        
        // internal options
        options = $.extend(defaults, {}),
        
        // cache some values
        width = 0,
        height = 0,
        scroll = 0,
        
        // get meassures
        getHeight = function() {
            return el.content.outerHeight();
        },
        getWidth = function() {
            return el.content.outerWidth()
        };
    
    // build
    $('modal overlay modal-box modal-content modal-close modal-preload modal-inner'.split(' ')).each(function() {
        el[this.replace(/modal-/,'')] = Aino.create('#aino-' + this);
    });
    el.close.hide().html('&#215;').click(function() {
        modal.close();
    });
    el.content.append( el.inner );
    el.box.append( el.content, el.close );
    el.modal.hide().append( el.overlay.hide(), el.preload.hide(), el.box );
    el.overlay.css('opacity', options.opacity);
    
    // attach public methods
    return $.extend(modal, {
        
        init: function( ready ) {
            initialized = true;
            var append = function() {
                el.modal.appendTo( document.body );
                if (typeof ready == 'function') {
                    ready.call( modal );
                }
            } 
            if ( options.loadCSS ) {
                Aino.loadCSS( path + 'aino.modal.css', append );
            } else {
                $(append);
            }
            return modal;
        },
        
        close: function() {
            el.box.attr('class', '');
            el.close.hide();
            el.box.stop().css({
                top: 0,
                left: 0
            });
            el.inner.empty();
            el.content.css('visibility', 'hidden');
            el.preload.hide();
            height = 0;
            width = 0;
            scroll = 0;
            el.overlay.stop().fadeOut(options.duration, function() {
                el.modal.hide();
            });
        },
        
        insert: function( html ) {
            el.inner.html( html );
        },
        
        append: function( html ) {
            el.inner.append( html );
        },
        
        prepend: function( html ) {
            el.inner.prepend( html );
        },
        
        get: function( url ) {
            $.get( url, function( data ) {
                modal.open( data );
            });
            modal.preload();
        },
        
        preload: function() {
            if (!initialized) {
                modal.init();
            }
            el.modal.add( el.preload ).show();
            el.overlay.show().css('opacity', options.opacity);
        },
        
        open: function( html, opts ) {
            
            if (opts) {
                modal.config( opts );
            }
            
            var ready = function() {
            
                el.modal.show();
                
                el.box.css('visibility','hidden').addClass( options.className );
                
                el.preload.fadeOut( options.duration/2 );
                el.overlay.show().css('opacity', options.opacity);
                el.inner.append( html );

                Aino.when(function(time) {
                    // watch for change
                    return getHeight() > height || getWidth() > width;
                }, function() {
                    height = getHeight();
                    width = getWidth();
                    scroll = $(window).scrollTop();
                    el.box.css({
                        top: '50%',
                        left: '50%',
                        visibility: 'visible',
                        opacity: 0,
                        marginLeft: width/2*-1 + 20,
                        marginTop: height/2*-1 + scroll + 20,
                        width: width - 40,
                        height: height - 40
                    }).animate({
                        opacity:1,
                        width: width,
                        height: height,
                        marginLeft: width/2*-1,
                        marginTop: height/2*-1 + scroll
                    },{
                        duration: options.duration,
                        complete:function() {
                            el.box.css('height','auto');
                            el.close.show();
                            el.content.css('visibility', 'visible');
                            if (options.focus) {
                                el.inner.find('input:visible,textarea:visible').eq(0).focus();
                            }
                        }
                    });
                }, function() {
                    Aino.raise('Modal size not found');
                }, 1000);
            }
            
            initialized ? ready() : modal.init( ready );
            
            return modal;
        },
        
        config: function( opts ) {
            $.extend(options, opts);
            return modal;
        },
        
        reset: function() {
            options = $.extend(defaults, {});
        }
    });
    
    
}(jQuery, this));