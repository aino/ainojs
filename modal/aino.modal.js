
if (!'Aino' in this) {
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
            duration: 400,
            className: '',
            opacity: .8
        },
        
        // internal options
        options = $.extend(defaults, {}),
        
        // cache some values
        width = 0,
        height = 0,
        scroll = 0;

    
    // build
    $('modal overlay modal-box modal-content modal-close'.split(' ')).each(function() {
        el[this.replace(/modal-/,'')] = Aino.create('#aino-' + this);
    });
    
    el.close.hide().html('&#215;').click(function() {
        modal.close();
    });
    
    el.box.append( el.content, el.close );
    el.modal.hide().append( el.overlay, el.box );
    el.overlay.css('opacity', options.opacity);
    
    // attach public methods
    return $.extend(modal, {
        
        init: function() {
            
            initialized = true;
            var append = function() {
                el.modal.appendTo( document.body );
            }
            
            if ( options.loadCSS ) {
                Aino.loadCSS( path + 'aino.modal.css', append );
            } else {
                append();
            }
            
            return modal;
        },
        
        close: function() {
            el.box.attr('class', '');
            el.close.hide();
            el.box.stop().css('visibility','hidden');
            el.content.css('visibility','hidden').empty();
            height = 0;
            width = 0;
            scroll = 0;
            el.overlay.stop().fadeOut(options.duration);
            Aino.log('closed');
        },
        
        insert: function( html ) {
            el.content.html( html );
        },
        
        append: function( html ) {
            el.content.append( html );
        },
        
        prepend: function( html ) {
            el.content.prepend( html );
        },
        
        open: function( html, opts ) {
            
            if (opts) {
                modal.config( opts );
            }
            
            if (!initialized) {
                modal.init();
            }
            
            el.overlay.show();
            el.box.css('visibility','hidden').addClass( options.className );
            
            el.modal.show();
            
            el.content.append( html );
            
            Aino.when(function() {
                
                // watch for change
                return el.content.outerHeight() > height || el.content.outerWidth() > width;
                
            }, function() {
                
                height = el.content.outerHeight();
                width = el.content.outerWidth();
                
                scroll = $(window).scrollTop();
                
                el.content.css('visibility', 'hidden');
                
                el.box.css({
                    visibility: 'visible',
                    opacity:0,
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
                },
                {
                    duration: options.duration,
                    complete:function() {
                        el.box.css('height','auto');
                        el.content.css('visibility','visible');
                        el.close.show();
                    }
                });
                
            }, function() {
                Aino.raise('Modal size not found');
            }, 1000);
            
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