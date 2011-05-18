
this.Aino = window.Aino || (function($, window, undefined) {
    
    var
        document = window.document,
        
        $win = $(window),
        $doc = $(document),
        
        // The script’s path (it’s always the last found)
        getPath = function() {
            var src = $('script:last').attr('src'),
                slices = src.split('/');
            if (slices.length == 1) {
                return '';
            }
            slices.pop();
            return slices.join('/') + '/';
        },
        
        // cache this script’s path
        PATH = getPath(),
    
        // IE Detection
        IE = (function( div ) {
            var undef, v = 3;
            while (
                div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
                div.getElementsByTagName('i')[0]
            );
            return v > 4 ? v : undef;
        }( document.createElement('div') ));
    
    // add a js class
    document.documentElement.className+=' js';
        
    return {
        
        // the debug option
        DEBUG: true,
        
        // bring the IE object
        IE: IE,
        
        // the init
        init: function() {
            Aino.removeDottedBorders();
            if ( Aino.DEBUG ) {
                Aino.loadCSS( PATH + 'aino.error.css');
                Aino.prototyping();
                $doc.ajaxError(function(e, xhr, settings) {
                    Aino.raise( xhr.responseText );
                    Aino.raise( 'Ajax error from URL: ' + settings.url, true );
                });
            }
            return this;
        },
        
        // remove dotted borders on links without disturbing accessibility
        removeDottedBorders: function() {
            $('a').live('mousedown mouseup', function(e) {
                if ('hideFocus' in this) { // IE
                    this.hideFocus = e.type == 'mousedown';
                }
                this.blur();
            });
            return this;
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
            return this;
        },
        
        // logging method
        log: function() {
            if ( Aino.DEBUG ) {
                try {
                    window.console.log.apply(this, Aino.array( arguments ) )
                } catch(e) {}
            }
            return this;
        },
        
        // bodyclass views
        views: function( views ) {
            $( ['_global'].concat( document.body.className.split(' ') ) ).each( function(i, name) {
                if ( typeof views[ name ] == 'function' ) {
                    views[ name ].call( Aino );
                }
            });
        },
        
        // utility for executing a method when another method returns true
        when : function( until, success, err, timeout) {
            timeout = timeout || 10000;
            if (typeof err == 'number') {
                timeout = err;
            }
            success = success || function(){};
            var start = Aino.timestamp(),
                elapsed,
                now,
                fn = function() {
                    now = Aino.timestamp();
                    elapsed = now - start;
                    if ( until( elapsed ) ) {
                        success.call( Aino, elapsed );
                        return false;
                    }
                    if (now >= start + timeout) {
                        if (typeof err == 'function') {
                            err.call( Aino, elapsed );
                        }
                        return false;
                    }
                    window.setTimeout(fn, 2);
                };
            window.setTimeout(fn, 2);
            return this;
        },
        
        // for HTML prototyping
        prototyping: function() {
            // placeholder image
            $('img[src="#"]').each(function() {
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
            return this;
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
                id = undefined;
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
                        $('head').append( link );
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
                Aino.when(function() {
                    return ready && document.styleSheets.length > length;
                }, function() {
                    window.setTimeout(function() {
                        callback.call( link, link );
                    }, 100);
                }, function() {
                    Aino.raise( 'CSS at ' + href + ' could not load' );
                }, 5000 );
            }
            return this;
        },
        
        getScriptPath: getPath,
        
        create: function( selector, type ) {
            var elem = $(document.createElement( type || 'div')),
                reg = /\#/;
            if (selector) {
                if( reg.test(selector) ) {
                    return elem.attr('id', selector.replace(reg,'') );
                }
                return elem.addClass( selector );
            }
            return elem;
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
