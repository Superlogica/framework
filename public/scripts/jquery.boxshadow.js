/* **
* jquery-boxshadow.js
*
* $(object).boxshadow({
*     hOffset : 3,
*     vOffset : 3,
*     shadowblur : 3,
*     color : '#808080'
* })
*
* If you are using this with IE, you should set your object's background-color,
* otherwise the shadow is applied to all objects within your object as well.
*
*/
(function($){

    $.fn.boxshadow = function(optionsOrXOffset, yOffset, blurRadius, shadowColor) {

        var css3Attr = 'box-shadow';
        var options = optionsOrXOffset;
        var $elementSelected = $(this);
        var cssPrefix = {
            "webkit" : "-webkit-",
            "mozilla" : '-moz-'
        };
        
        if (typeof optionsOrXOffset != 'object' ){
            options = {
                "xOffset" : optionsOrXOffset,
                "yOffset" : yOffset,
                "shadowblur" : blurRadius,
                "color" : shadowColor
            }
        }

        var defaults = {
            xOffset : 3,
            yOffset : 3,
            shadowblur : 3,
            color : '#808080'
        }

        // Extend our default options with those provided.
        var opts = $.extend(defaults, options);

        

        function applyNativeCss(){

            var shadowVal = opts['xOffset'] + "px "+ opts['yOffset'] + "px " + opts['shadowblur'] + "px " + opts['color'];
            var cssAttr = css3Attr;

            if ( $.browser.webkit ) {
                cssAttr = cssPrefix['webkit']+css3Attr;
            } else if ( $.browser.mozilla ) {
                cssAttr = cssPrefix['mozilla']+css3Attr;
            }
            return $elementSelected.css( cssAttr, shadowVal );
        }

        function applyFilterCss(){

            var strength = opts['xOffset'];
            var direction = 45;

            if ((opts['xOffset'] < 0) && (opts['yOffset'] > 0)) {

                direction = -145;
                strength = opts['xOffset'] * -1;

            }else if ((opts['xOffset'] > 0) && (opts['yOffset'] > 0)) {

                direction = 145;

            }else if ((opts['xOffset'] < 0) && (opts['yOffset'] < 0)) {

                direction = -45;
                strength = opts['xOffset'] * -1;

            }

            var filterVal = "progid:DXImageTransform.Microsoft.Shadow(color='" + opts['color'] + "', Direction=" + direction + ", Strength=" + strength + ")"
            return $elementSelected.css( "filter", filterVal );

        }

        return $.browser.msie ? applyFilterCss() :  applyNativeCss();

    }

})(jQuery);