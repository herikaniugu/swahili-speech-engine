(function(window) {
    var speech = new Object();
    speech.NAME = "Chatbot Intelligence"
    speech.VERSION = "1.0.0";
    speech.AUTHOR = "Heri Kaniugu";
    speech.input = function(value) {
        var syllable = new Array(), index = 0;
        var item = (value || Type.EMPTY).toLowerCase().split(/\s+|(\d+)/).filter(Boolean);
        var each = item.map(function(value) { return value.split(/([^aeiou]*[aeiou])/).filter(Boolean); });
        each.forEach(function(array) { array.forEach(function(value) { syllable.push(value); }); }); speech.sound(syllable, index); return syllable;
    };
    speech.preload = function(callback) {
        var syllables = new Array();
        var vowels = ["a", "e", "i", "o", "u"];
		var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
		var digraphs = ["ch", "dh", "gh", "kw", "mb", "mbw", "bw", "mw", "ndw", "nd", "ngw", "ng'", "ng", "njw", "nj", "nyw", "ny", "nz", "shw", "sw", "sh", "th", "tw", "vy"];
        var phonetics = consonants.concat(digraphs);
        phonetics.forEach(function(phonetic) {
		    vowels.forEach(function(vowel) {
                if (["c", "q", "x", "bw", "sw"].indexOf(phonetic) < 0) syllables.push(phonetic + vowel); // no voice for "bw" and "sw"
            });
        });
        Preload(Resource(Path([App.VERSION, "audio"]), "mp3").files(vowels.concat(syllables))).audio(function(total, count, name, audio) {
            speech.audio[name] = audio;
            if (total == count && callback) callback(speech.audio);
        });
    };
    speech.sound = function(value, index) {
        var audio = speech.audio[[value[index], "mp3"].join(".")];
        if (audio) {
            var sound = Sound(new Audio(audio.src));
            sound.audio.loop = false;
            sound.ended(function() {
                index += 1;
                if (index < value.length) speech.sound(value, index);
            });
            sound.volume(0.5);
            sound.play();
        }
    };
    speech.audio = new Object();
    window.Extension("speech", speech);
}) (window);