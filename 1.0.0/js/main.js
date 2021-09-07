App.source.main = function() {
    // CLEAR
    Clear();
    // DEFINE
    App.value = {
        title: "SPEECH",
        button: "SPEAK",
        extension: "speech",
        hint: "Type message...",
        border: "1px solid #bfbfbf",
        elevation: "0 10px 20px rgba(0, 0, 0, 0.4)"
    };
    // EXTENSION
    var speech = Extension(App.value.extension);
    // PRELOAD
    speech.preload();
    // APPLICATION
    var application = Main().width(Type.FILL).height(Type.FILL).align(Align.MIDDLE).back(Color.WHITE).add();
    // ON
    Device.changed = function() {
        if (Mobile()) application.width(Type.FILL).height(Type.FILL).radius(0).border(0).elevation(0);
            else application.width(360).height(Height() * 0.8).radius(24).border(App.value.border).elevation(App.value.elevation);
    };
    // ALIGN
    Device.changed();
    // HEAD
    Layout().width(Type.FILL).height(Type.FILL).padding(15).borderBottom(App.value.border).into(application).weight(0).include(function(view) {
        Block().text(App.value.title).into(Layout().width(Type.FILL).align(Align.CENTER).size(14).select(Type.NONE).into(view));
    });
    // MAIN
    App.view.main = Layout().width(Type.FILL).height(Type.FILL).overflowY(Type.AUTO).padding(4, 8).into(application).weight(1);
    // SEND
    App.view.send = function(value) {
        Layout().width(Type.FILL).padding(4, 8).into(App.view.main).include(function(view) {
            Block().align(Align.RIGHT).back(Color.WHITE).color(Color.SHADOW).padding(8, 12).radius(24, 24, 0, 24).text(value).border(App.value.border).into(view);
        });
    };
    // RECEIVE
    App.view.receive = function(value) {
        Layout().width(Type.FILL).padding(4, 8).into(App.view.main).include(function(view) {
            var main = App.view.main.get();
            Block().align(Align.LEFT).back(Color.value(0xEEEEEE)).color(Color.SHADOW).padding(8, 12).radius(24, 24, 24, 0).text(value).border(App.value.border).into(view).include(function() {
                if (main.scrollTo) main.scrollTo(0, main.scrollHeight);
            });
        });
    };
    // BOTTOM
    Inline().width(Type.FILL).back(Color.WHITE).radius(24).padding(12, 16).border(App.value.border).into(Layout().width(Type.FILL).height(Type.FILL).padding(12).into(application).weight(0)).include(function(view) {
        // INPUT
        var input = Input().width(Type.FILL).back(Color.WHITE).color(Color.SHADOW).hint(App.value.hint).into(view).weight(1);
        // BUTTON
        var button = Button().width(Type.FILL).back(Color.WHITE).color(Color.SHADOW).text(App.value.button).into(view).weight(0).clicked(function() {
            var value = input.value() || Type.DOT;
            input.value(Type.EMPTY); App.view.send(value); speech.input(value);
        });
        // KEYUP
        input.keyup(function(event) {
            if (event.keyCode === 13) button.click();
        });
    });
};