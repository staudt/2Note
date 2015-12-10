(function () {
  "use strict";

    document.getElementById('content').onkeydown = function(e) {
        if(e.keyCode==9) {
            e.preventDefault();
            /*
                TODO: When it is a selection, ident with (maybe):
                document.execCommand('styleWithCSS',true,null);
                document.execCommand('indent',true,null);
            */
            var sel = window.getSelection().getRangeAt(0);
            var tab = document.createTextNode('\t');
            sel.deleteContents();
            sel.insertNode(tab);
            sel.setStartAfter(tab);
        }
    }

})();
