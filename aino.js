
this.Aino = window.Aino || (function($, window, undefined) {
    
    var
        document = window.document,
        
        $win = $(window),
        $doc = $(document),
        
        // The script’s path (it’s always the last found)
        PATH = (function(src) {
        
            var slices = src.split('/');
        
            if (slices.length == 1) {
                return '';
            }
        
            slices.pop();
            return slices.join('/') + '/';
        
        }( $('script:last').attr('src') )),
    
        // IE Detection
        IE = (function( div ) {
            
            var undef, v = 3;
            
            while (
                div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
                div.getElementsByTagName('i')[0]
            );
            
            return v > 4 ? v : undef;
            
        }( document.createElement('div') ))
        
    return {
        
        // the debug option
        DEBUG: true,
        
        // bring the IE object
        IE: IE,
        
        // the init
        init: function() {
            
            Aino.removeDottedBorders();
            
            if (Aino.DEBUG) {
                
                Aino.loadCSS( PATH + 'aino.error.css');
            
                Aino.prototyping();
            
                $doc.ajaxError(function(e, xhr, settings) {
                    Aino.raise( xhr.responseText );
                    Aino.raise( 'Ajax error from URL: ' + settings.url, true );
                });
            }
            
        },
        
        removeDottedBorders: function() {
            
            var style;
            
            $('a').live('mousedown', function() {
                $(this).css('outline','none');
            }).live('mouseout', function() {
                style = $(this).attr('style');
                if (/outline/.test(style)) {
                    style = style.replace(/outline:[^;]+;/g,'');
                    $(this).attr('style', style);
                }
            })
        },
        
        // slice array
        array: function( obj ) {
            return Array.prototype.slice.call( obj );
        },
        
        // timestamp abstraction
        timestamp: function() {
            return new Date().getTime();
        },
        
        // error handling
        raise: function( msg, fatal ) {

            var type = fatal ? 'Fatal error' : 'Error',
                error = $('#aino-error').length ? $('#aino-error') : $('<div>').attr('id','aino-error').appendTo( document.body );

            // if debug is on, display errors and throw exception if fatal
            if ( Aino.DEBUG ) {
                
                error.append( $('<div>').addClass( fatal ? 'fatal' : '').html( type + ': ' + msg ) );
                
                if ( fatal ) {
                    throw new Error(type + ': ' + msg);
                }
            }

        },
        
        // logging method
        log: function() {
            
            if ( !Aino.DEBUG ) {
                return;
            }
            
            try {
                window.console.log.apply(this, Aino.array( arguments ) )
            } catch(e) {}
            
        },
        
        // utility for executing a method when another method returns true
        wait : function(options) {
            options = $.extend({
                until : function() { return false; },
                success : function() {},
                error : function() { Aino.raise('Could not complete wait function.'); },
                timeout: 3000
            }, options);

            var start = Aino.timestamp(),
                elapsed,
                now,
                fn = function() {
                    now = Aino.timestamp();
                    elapsed = now - start;
                    if ( options.until( elapsed ) ) {
                        options.success();
                        return false;
                    }

                    if (now >= start + options.timeout) {
                        options.error();
                        return false;
                    }
                    window.setTimeout(fn, 2);
                };

            window.setTimeout(fn, 2);
        },
        
        // for HTML prototyping
        prototyping: function() {
            
            // placeholder image
            $('img[src="#"]').css({
                border: '1px solid #ddd'
            }).each(function() {
                $(this).css({
                    border: '1px solid #ddd',
                    display: 'inline-block',
                    background: '#fff url(' + PATH + 'placeholder.png' + ') no-repeat 50% 50%'
                }).width( this.width-2 ).height( this.height-2 );
            });
            
            // prevent page jump on #
            $('a[href="#"]').live('click', function(e) {
                e.preventDefault();
            });
            
        },
        
        loadCSS : function( href, id, callback ) {

            var link,
                ready = false,
                length;

            // look for manual css
            $('link[rel=stylesheet]').each(function() {
                if ( new RegExp( href ).test( this.href ) ) {
                    link = this;
                    return false;
                }
            });

            if ( typeof id === 'function' ) {
                callback = id;
                id = undef;
            }

            callback = callback || function() {}; // dirty

            // if already present, return
            if ( link ) {
                callback.call( link, link );
                return link;
            }

            // save the length of stylesheets to check against
            length = document.styleSheets.length;

            // add timestamp if DEBUG is true
            if ( Aino.DEBUG ) {
                href += '?' + Aino.timestamp();
            }

            // check for existing id
            if( $('#'+id).length ) {
                $('#'+id).attr('href', href);
                length--;
                ready = true;
            } else {
                link = $( '<link>' ).attr({
                    rel: 'stylesheet',
                    href: href,
                    id: id
                }).get(0);

                window.setTimeout(function() {
                    var styles = $('link[rel="stylesheet"], style');
                    if ( styles.length ) {
                        styles.get(0).parentNode.insertBefore( link, styles[0] );
                    } else {
                        DOM().head.appendChild( link );
                    }

                    if ( IE ) {

                        // IE has a limit of 31 stylesheets in one document
                        if( length >= 31 ) {
                            Aino.raise( 'You have reached the browser stylesheet limit (31)', true );
                            return;
                        }
                        
                        link.onreadystatechange = function(e) {
                            if ( !ready && (!this.readyState ||
                                this.readyState === 'loaded' || this.readyState === 'complete') ) {
                                ready = true;
                            }
                        };
                    } else {
                        
                        // final test via ajax if not local
                        if ( !( new RegExp('file://','i').test( href ) ) ) {
                            $.ajax({
                                url: href,
                                success: function() {
                                    ready = true;
                                },
                                error: function(e) {
                                    // pass if origin is rejected
                                    if( e.isRejected() ) {
                                        ready = true;
                                    }
                                }
                            });
                        } else {
                            ready = true;
                        }
                    }
                }, 10);
            }

            if ( typeof callback === 'function' ) {

                Aino.wait({
                    until: function() {
                        return ready && document.styleSheets.length > length;
                    },
                    success: function() {
                        window.setTimeout(function() {
                            callback.call( link, link );
                        }, 100);
                    },
                    error: function() {
                        Aino.raise( 'CSS at ' + href + ' could not load' );
                    },
                    timeout: 1000
                });
            }
            return link;
        },
        
        // parse anything into a number
        parseValue: function( val ) {
            if (typeof val === 'number') {
                return val;
            } else if (typeof val === 'string') {
                var arr = val.match(/\-?\d|\./g);
                return arr && arr.constructor === Array ? arr.join('')*1 : 0;
            } else {
                return 0;
            }
        }
        
    };
    
}(jQuery, this));
