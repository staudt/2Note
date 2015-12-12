function newUuid() {
    function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16) .substring(1); }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

(function () {
    "use strict";

    var NoteModel = (function(){

        function NoteModel(title, content, uuid) {
            Object.call(this);
            this.uuid = uuid ? uuid : 'note:' + newUuid();
            this.title = title ? title : 'New note';
            this.content = content ? content : '';
        }; NoteModel.prototype = Object.create(Object.prototype);

        return NoteModel;    
    })();

    var NoteCollection = (function() {
        
        function NoteCollection() {
            Object.call(this);
            this.currentIndex = 0;
            this.notes = [];
        }; NoteCollection.prototype = Object.create(Object.prototype);

        NoteCollection.prototype.setup = function() {
            if (typeof(localStorage) == "undefined") {
                return false;
            } 
            /* first timer? */
            if (!localStorage.getItem('notes')) {
                this.addNote(new NoteModel('First note!', 'Start writing here'));
            }
            var uuids = JSON.parse(localStorage.getItem('notes'));
            var note, rawnote;
            for (var i=0;i<uuids.length;i++) {
                note = new NoteModel();
                note.uuid = uuids[i];
                rawnote = JSON.parse(localStorage.getItem(note.uuid));
                if (rawnote) {
                    note.title = rawnote.title;
                    note.content = rawnote.content;
                } else {
                    note.title = "?";
                }
                this.notes.push(note);
            }
            return true;
        }

        NoteCollection.prototype.addNote = function(note) {
            this.notes.push(note);
            var uuids = [];
            for (var i=0;i<this.notes.length;i++) {
                uuids.push(this.notes[i].uuid);
            }
            localStorage.setItem('notes', JSON.stringify(uuids));
            this.updateNote(note);
        }

        NoteCollection.prototype.updateNote = function(note) {
            localStorage.setItem(note.uuid, JSON.stringify(note));
        }

        NoteCollection.prototype.getCurrentNote = function() {
            return this.notes[this.currentIndex];
        }

        return NoteCollection;
    })();

    var NoteView = (function () {

        function NoteView() {
            Object.call(this);
            this.collection = new NoteCollection();
            if (!this.collection.setup()) {
                this.setContent('Error! Could not retrieve data', 'Are you using an old browser?');
            }
            this.setupTabs();
            this.setupEvents();
            this.setContent(
                this.collection.getCurrentNote().title,
                this.collection.getCurrentNote().content
            );
        }; NoteView.prototype = Object.create(Object.prototype);

        NoteView.prototype.setupEvents = function() {
            $('#title').on('keyup focusout', function (e) {
                var note = noteView.collection.getCurrentNote();
                note.title = $('#title').html();
                noteView.collection.updateNote(note);
            });
            $('#content').on('keyup focusout', function (e) {
                var note = noteView.collection.getCurrentNote();
                note.content = $('#content').html();
                noteView.collection.updateNote(note);
            });
        }

        NoteView.prototype.setupTabs = function() {
            $.each(this.collection.notes, function (i, note) {
                $('<div class="tab"/>').html(note.title).insertBefore("#addtab");;
            });
        }

        NoteView.prototype.setContent = function(title, content) {
            $('#title').html(title);
            $('#content').html(content ? content : '');
        }

        return NoteView;
    })();

    var noteView = new NoteView();
})();