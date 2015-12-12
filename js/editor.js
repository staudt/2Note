
document.getElementById('content').onkeydown = function(e) {
    if(e.keyCode==9) {
        e.preventDefault();
        var sel = window.getSelection().getRangeAt(0);
        var tab = document.createTextNode('\t');
        sel.deleteContents();
        sel.insertNode(tab);
        sel.setStartAfter(tab);
    }
}
