
/**
 * Hyperbox Engine 2.0
 * Written by Heri Kaniugu
 */

(function(window) {
    function Engine() {
        var engine = new Object();
        engine.Width = function() {
            return window.innerWidth;
        };
        engine.Height = function() {
            return window.innerHeight;
        };
        engine.Back = function() {
            return null == window.history.back();
        };
        engine.Go = function(value) {
            return null == window.history.go(value);
        };
        engine.Title = function(value) {
            return value != undefined ? document.title = value : document.title;
        };
        engine.Link = function(link, title) {
            try { return link ? window.history.pushState(null, title, link) : window.location.href; } catch(error) { return false; }
        };
        engine.Density = function(density) {
            return density ? window.devicePixelRatio = density : window.devicePixelRatio;
        };
        engine.Wait = function(callback, duration) {
            var id = window.setTimeout(callback, duration == undefined ? 1500 : duration); return function() { window.clearInterval(id); id == null; };
        };
        engine.Repeat = function(callback, duration, max) {
            var index = 0, id = window.setInterval(function() { if (callback) callback(index); if (++index === max) window.clearInterval(id); }, duration ? duration : 1500);
            return function() { window.clearInterval(id); id == null; };
        };
        engine.Import = function(value) {
            for (var key in value) if (value.hasOwnProperty(key)) window[key] = value[key]; return value;
        };
        engine.Extension = function(name, source) {
            if (source) extension[name] = source; return extension[name];
        };
        engine.Include = function(value) {
            var include = new Object();
            include.tag = document.createElement("IFRAME"); if (value) include.tag.src = value; document.head.appendChild(include.tag);
            include.response = function(callback) {
                include.tag.onload = function(event) {
                    if (callback) callback(this.contentWindow || this.contentDocument, this, event);
                };
                return include.tag;
            };
            return include;
        };
        engine.On = function(tag, value) {
            var on = new Object();
            on.response = function(callback) {
                var selector = tag || window; for (var index = 0; index < value.split(" ").length; index++) selector["on" + value.split(" ") [index]] = callback;
                return selector;
            };
            return on;
        };
        engine.Random = function(min, max) {
            return max != undefined ? Math.random() * (max - min) + min : (min != undefined ? Math.random() * min : Math.random());
        };
        engine.Step = function(min, max, interval) {
            var a = [min], b = min; while (b < max) a.push(b += interval || 1); return (b > max) ? a.slice(0, -1) : a;
        };
        engine.Callback = function(callback) {
            if (callback) callback(); return true;
        };
        engine.Identity = function() {
            return identity++;
        };
        engine.Merge = function(item) {
            var merge = new Object();
            merge.array = function(value) {
                return item && value.indexOf(item) >= 0 ? value.concat(item) : value;
            };
            merge.object = function(value) {
                for (var key in value) if (item && value.hasOwnProperty(key)) item[key] = value[key]; return item;
            };
            return merge;
        };
        engine.Async = function(callback) {
            return function() {
                window.setTimeout(function(parameters) {
                    callback.apply(this, parameters);
                }, 0, arguments);
            };
        };
        engine.Task = function() {
            var task = new Object();
            task.time = 1500;
            task.state = false;
            task.active = function() { return true; };
            task.interval = function(time) {
                task.time = time; return task;
            };
            task.condition = function(callback) {
                task.state = true; task.active = callback; return task;
            };
            task.stop = function() {
                window.clearInterval(task.id); task.id = null; return task;
            };
            task.response = function(callback) {
                task.id = window.setInterval(function() { if (task.active() && task.state) task.stop(); if (task.active() && callback) callback(); }, task.time); return task;
            };
            return task;
        };
        engine.Resource = function(folder, extension) {
            return {
                files: function(array) {
                    var data = new Array(); for (var index = 0; index < array.length; index++) 
                        data.push((folder ? folder.replace(/[\/]+$/g, none) + engine.Type.BACKSLASH : none) + array[index] + (extension ? engine.Type.DOT + extension + (engine.App.DEBUG ? engine.Type.QUERY + engine.Random() : none) : none));
                    return data;
                }
            };
        };
        engine.Params = function(value) {
            var array = new Array(); for (var key in value) if (value.hasOwnProperty(key)) array.push(encodeURIComponent(key) + engine.Value(0x3D) + encodeURIComponent(value[key]));
            return typeof value === "string" ? value : array.join("&");
        };
        engine.Path = function(folders, filename) {
            if (folders) return folders.join("/") + (filename ? "/" + filename : none);
        };
        engine.Do = function() {
            var p = true, q = true;
            return {
                case: function(a, b) {
                    if (q && a) q = a;
                    if (q && a && b) b(a);
                    if (q && a) p = false;
                    if (q && a) q = false;
                    return this;
                },
                otherwise: function(a) {
                    if (p && a) a();
                    if (p) p = false;
                    if (q) q = false;
                    return this;
                }
            };
        };
        engine.Pixel = function(a, b, c, d) {
            var f = function(value) { return isNaN(value) ? value : new Number(value) + engine.Value(0x70) + engine.Value(0x78); };
            var array = new Array(); array.push(f(a)); array.push(f(b)); array.push(f(c)); array.push(f(d)); return array.join(" ").replace(/^\s*([\s\S]*?)\s*$/, function(m, value) { return value; });
        };
        engine.Value = function(value) {
            return String.fromCharCode(value);
        };
        engine.Parse = {
            xml: function(value) {
                return new DOMParser().parseFromString(value, "text/xml");
            },
            html: function(value) {
                return new DOMParser().parseFromString(value, "text/html");
            },
            json: function(value) {
                try { return value && typeof value === "string" ? JSON.parse(value) : value || new Array(); } catch(error) { return new Array(); }
            },
            url: function(value) {
                var array = value.split("&"), item = new Object();
                array.forEach(function(key) { key = key.split("="); if (key[1]) item[key[0]] = window.decodeURIComponent(key[1]); });
                return engine.Parse.json(JSON.stringify(item));
            }
        };
        engine.Cache = {
            get: function(value) {
                try { if (value && window.localStorage.getItem(window.btoa(value))) return window.atob(window.localStorage.getItem(window.btoa(value))); } catch(error) { } return none;
            },
            set: function(key, value) {
                try { if (key) window.localStorage.setItem(window.btoa(key), (value != undefined ? window.btoa(value) : none)); return true; } catch(error) { } return false;
            },
            clear: function(value) {
                try { if (value) window.localStorage.removeItem(window.btoa(value)); return true; } catch(error) { } return false;
            }
        };
        engine.Media = {
            image: function(item) {
                return item ? engine.View("IMG").alternative(none).source(item.src ? item.src : item) : engine.View("IMG").alternative(none);
            },
            audio: function(item) {
                return item ? engine.View("AUDIO").source(item.src ? item.src : item) : engine.View("AUDIO");
            },
            video: function(item) {
                return item ? engine.View("VIDEO").source(item.src ? item.src : item) : engine.View("VIDEO");
            }
        };
        engine.Sound = function(audio) {
            var sound = new Object();
            sound.volume = function(volume) {
                if (this.audio) this.audio.volume = volume; return sound;
            };
            sound.play = function() {
                var play = this.audio ? this.audio.play() : undefined; if (play) play.then(function() { }).catch(function(error) { }); return sound;
            };
            sound.stop = function() {
                if (this.audio) this.audio.currentTime = 0; if (this.audio) this.audio.pause(); this.audio = null; return sound;
            };
            sound.ended = function(callback) {
                if (this.audio) this.audio.addEventListener("ended", function() { if (callback) callback(); }, false); return sound;
            };
            sound.loop = function(callback) {
                if (this.audio) if (typeof this.audio.loop == "boolean") this.audio.loop = true; else
                    this.audio.addEventListener("ended", function() { this.currentTime = 0; this.play(); if (callback) callback(); }, false); return sound;
            };
            sound.audio = audio;
            return sound;
        };
        engine.Web = {
            audio: function(arraybuffer) {
                var audio = new Object();
                audio.context = new (AudioContext || webkitAudioContext || mozAudioContext || msAudioContext) ();
                audio.source = audio.context.createBufferSource(); audio.buffer = arraybuffer; audio.loop = false;
                audio.play = function(from) {
                    if (audio.buffer && audio.buffer.byteLength > 0) audio.context.decodeAudioData(audio.buffer, function (buffer) {
                        audio.source.buffer = buffer; audio.source.connect(audio.context.destination);
                        audio.source.loop = audio.loop; audio.source.start(from || 0);
                    });
                    return audio;
                };
                audio.stop = function() {
                    audio.context.close().then(function() { }); return audio;
                };
                audio.loop = function(value) {
                    audio.loop = value || true; return audio;
                };
                return audio;
            },
            oscillator: function() {
                var oscillator = new Object();
                oscillator.context = new (AudioContext || webkitAudioContext || mozAudioContext || msAudioContext) ();
                oscillator.source = oscillator.context.createOscillator(); oscillator.gain = oscillator.context.createGain(); 
                oscillator.gain.connect(oscillator.context.destination);
                oscillator.scale = {
                    c1: 32.70, d1: 36.71, e1: 41.21, f1: 43.65, g1: 49.00, a1: 55.00, b1: 61.74, 
                    C1: 35, D1: 39, F1: 46, G1: 56, A1: 58, 
                    c2: 65.41, d2: 73.42, e2: 82.41, f2: 87.31, g2: 98.00, a2: 110.00, b2: 123.74, 
                    C2: 69, D2: 78, F2: 93, G2: 104, A2: 117, 
                    c3: 130.81, d3: 146.83, e3: 164.81, f3: 174.61, g3: 196.00, a3: 220.00, b3: 246.94, 
                    C3: 139, D3: 156, F3: 185, G3: 208, A3: 233, 
                    c4: 261.63, d4: 293.65, e4: 329.63, f4: 349.23, g4: 392.00, a4: 440.00, b4: 493.88, 
                    C4: 277, D4: 311, F4: 370, G4: 415, A4: 466, 
                    c5: 523.25, d5: 587.33, e5: 659.26, f5: 698.46, g5: 783.99, a5: 880.00, b5: 987.77, 
                    C5: 554, D5: 622, F5: 740, G5: 831, A5: 932, 
                    c6: 1046.50, d6: 1174.70, e6: 1318.50, f6: 1396.90, g6: 1568.00, a6: 1760.00, b6: 1975.50, 
                    C6: 1109, D6: 1245, F6: 1480, G6: 1661, A6: 1865, 
                    c7: 2093.00, d7: 2349.30, e7: 2637.00, f7: 2793.80, g7: 3126.00, a7: 3520.00, b7: 3951.10, 
                    C7: 2217, D7: 2481, F7: 2960, G7: 3322, A7: 3729, 
                    c8: 4186.00, d8: 4699.00, e8: 5274.00, f8: 5588.00, g8: 6272.00, a8: 7040.00, b8: 7902.13, 
                    C8: 4434, D8: 4978, F8: 5919, G8: 6644, A8: 7458
                };
                oscillator.type = function(value) {
                    oscillator.source.type = value || "square"; return oscillator;
                };
                oscillator.frequency = function(value, time) {
                    oscillator.source.frequency.setValueAtTime(value || 0, oscillator.context.currentTime + (time || 0)); return oscillator;
                };
                oscillator.volume = function(value, time) {
                    oscillator.gain.gain.setValueAtTime(value || 0, oscillator.context.currentTime + (time || 0)); return oscillator;
                };
                oscillator.connect = function() {
                    oscillator.source.connect(oscillator.gain); return oscillator;
                };
                oscillator.start = function(from) {
                    oscillator.source.start(oscillator.context.currentTime + (from || 0)); return oscillator;
                };
                oscillator.stop = function(to) {
                    oscillator.source.stop(oscillator.context.currentTime + (to || 0)); return oscillator;
                };
                oscillator.end = function(callback) {
                    oscillator.source.onended = function() { oscillator.source.disconnect(oscillator.gain); if (callback) callback(); }; return oscillator;
                };
                return oscillator;
            },
            note: function(note) {
                var raw = note.split(/\>/).map(function(value) { return value ? value.trim() : value; }), type = raw[0], loop = raw[1] == "true", volume = parseFloat(raw[2]);
                var notes = raw[3].split(/\//).map(function(note) { var output = new Object(), array = note.split(/\:/).map(function(value) {
                    return parseFloat(value); }); output.frequency = array[0]; output.wait = array[1]; output.delay = array[2]; return output; });
                var play = function(position) {
                    var value = notes[position]; if (value) engine.Web.oscillator().type(type).volume(volume).frequency(value.frequency).connect().start(value.wait).stop(value.wait + value.delay).end(function() {
                        if (position < notes.length - 1) play(position += 1); else if (loop) play(0);
                    });
                }; play(0); return { type: type, volume: volume, loop: loop, notes: notes };
            }
        };
        engine.Preload = function(resources) {
            var preload = new Object();
            preload.index = 0;
            preload.request = function(callback) {
                var request = new (XMLHttpRequest || ActiveXObject) ("Microsoft.XMLHTTP");
                var total = resources.length, count = preload.index + 1;
                request.open("GET", resources[preload.index], true); request.responseType = "blob"; request.send();
                request.onload = request.onerror = function(event) {
                    if (preload.index < total) {
                        var name = resources[preload.index].replace(/^.*[\/]/, none).replace(/[\?].*$/, none);
                        if (callback) callback(total, count, name, event); preload.index++;
                        if (count < total) preload.request(callback);
                    }
                };
                return preload;
            };
            preload.image = function(callback) {
                var image = new Image(); image.src = resources[preload.index];
                var total = resources.length, count = preload.index + 1;
                image.onload = image.onerror = function(event) {
                    if (preload.index < total) {
                        var name = resources[preload.index].replace(/^.*[\/]/, none).replace(/[\?].*$/, none);
                        if (callback) callback(total, count, name, event); preload.index++;
                        if (count < total) preload.image(callback);
                    }
                };
                return preload;
            };
            preload.audio = function(callback) {
                var audio = new Audio(); audio.src = resources[preload.index]; audio.preload = true;
                var total = resources.length, count = preload.index + 1;
                if (preload.index < total) {
                    var name = resources[preload.index].replace(/^.*[\/]/, none).replace(/[\?].*$/, none);
                    if (callback) callback(total, count, name, audio); preload.index++;
                    if (count < total) preload.audio(callback);
                }
                return preload;
            };
            preload.script = function(callback) {
                var script = document.createElement("SCRIPT"); script.src = resources[preload.index] + (engine.App.DEBUG ? engine.Type.QUERY + engine.Random() : none);
                var total = resources.length, count = preload.index + 1;
                script.onload = script.onerror = function(event) {
                    if (preload.index < total) {
                        var name = resources[preload.index].replace(/^.*[\/]/, none).replace(/[\?].*$/, none);
                        if (callback) callback(total, count, name, event); preload.index++;
                        if (count < total) preload.script(callback);
                    }
                };
                document.documentElement.appendChild(script); return preload;
            };
            preload.source = function(callback) {
                var request = new (XMLHttpRequest || ActiveXObject) ("Microsoft.XMLHTTP");
                var total = resources.length, count = preload.index + 1;
                request.open("GET", resources[preload.index], true); request.responseType = "blob"; request.send();
                request.onload = request.onerror = function(event) {
                    var source = document.createElement("SCRIPT"), url = window.URL.createObjectURL(event.target.response);
                    source.onload = source.onerror = function() {
                        if (preload.index < total) {
                            var name = resources[preload.index].replace(/^.*[\/]/, none).replace(/[\?].*$/, none);
                            if (callback) callback(total, count, name, event); preload.index++;
                            if (count < total) preload.source(callback);
                        }
                    };
                    source.src = url; document.head.appendChild(source);
                };
                return preload;
            };
            return preload;
        };
        engine.Device = {
            media: function(constraints, callback, error) {
                navigator.mediaDevices.getUserMedia(constraints).then(callback).catch(error ? error : function(err) { }); return this;
            },
            leave: function() {
                document.body.onkeydown = function(event) {
                    if (event.key == "Backspace") {
                        event.preventDefault(); window.close();
                    }
                };
            },
            touch: function(target) {
                var input = new Object();
                input.move = function(callback) {
                    engine.On(target, "mousemove touchmove").response(function(event) {
                        event.preventDefault();
                        var touches = event.changedTouches, rectangle = event.target.getBoundingClientRect();
                        for (var position = 0; position < (touches ? touches.length : 1); position++) {
                            var id = (touches ? touches[position].identifier : 0), value = input.each[id];
                            var x = (touches ? touches[position].pageX - rectangle.left : event.offsetX);
                            var y = (touches ? touches[position].pageY - rectangle.top : event.offsetY);
                            if (!value) value = { id: id, active: true, click: false, move: true, left: false, right: false, up: false, down: false, x: x, y: y, dx: x, dy: y };
                            var dx = value.dx - x, dy = value.dy - y, offset = Math.abs(dx) + Math.abs(dy) > 10; value.move = true; value.click = false;
                            value.x = x; value.y = y; value.left = false; value.right = false; value.up = false; value.down = false;
                            if (Math.abs(dx) > Math.abs(dy)) dx > 0 ? value.left = true : value.right = true;
                                else if (offset) dy > 0 ? value.up = true : value.down = true; if (offset) value.dx = value.x; if (offset) value.dy = value.y; input.each[id] = value;
                        }
                        if (callback) callback(event, input);
                    }, false);
                    return input;
                };
                input.down = function(callback) {
                    engine.On(target, "mousedown touchstart").response(function(event) {
                        event.preventDefault();
                        var touches = event.changedTouches, rectangle = event.target.getBoundingClientRect();
                        for (var position = 0; position < (touches ? touches.length : 1); position++) {
                            var id = (touches ? touches[position].identifier : 0);
                            var x = (touches && touches[position] ? touches[position].pageX - rectangle.left : event.offsetX), y = (touches ? touches[position].pageY - rectangle.top : event.offsetY);
                            input.each[id] = { id: id, active: true, click: true, move: false, left: false, right: false, up: false, down: false, x: x, y: y, dx: x, dy: y };
                        }
                        if (callback) callback(event, input);
                    }, false);
                    return input;
                };
                input.up = function(callback) {
                    engine.On(target, "mouseup mouseleave touchend touchcancel").response(function(event) {
                        event.preventDefault();
                        var touches = event.changedTouches;
                        for (var position = 0; position < (touches ? touches.length : 1); position++) input.clear(touches ? touches[position].identifier : 0);
                        if (callback) callback(event, input);
                    }, false);
                    return input;
                };
                input.clear = function(id) { input.each[id] = { id: id, active: false, click: false, move: false }; };
                input.each = new Array();
                return input;
            },
            key: function(target) {
                var input = new Object();
                input.down = function() {
                    (target || window).addEventListener("keydown", function (event) {
                        event.preventDefault(); var id = event.which || event.keyCode; input.each[id] = { id: id, active: true };
                    });
                    return input;
                };
                input.up = function() {
                    (target || window).addEventListener("keyup", function (event) {
                        event.preventDefault(); var id = event.which || event.keyCode; input.each[id] = { id: id, active: false };
                    });
                    return input;
                };
                input.clear = function(id) { input.each[id] = { id: id, active: false }; };
                input.each = new Array();
                return input;
            },
            pad: function() {
                var input = new Object();
                input.connection = function(callback) {
                    var update;
                    window.addEventListener("gamepadconnected", function(event) {
                        event.preventDefault(); if (callback) callback(event);
                        var id = event.gamepad.index, name = event.gamepad.id;
                        input.each[id] = { id: id, name: name, active: true, axe: new Array(), button: new Array() };
                        update = window.setInterval(function() {
                            var gamepad = navigator.getGamepads() [id ? id : 0];
                            if (gamepad) {
                                var axes = gamepad.axes, buttons = gamepad.buttons, axe = Math.round(axes[9] * 10) / 10;
                                ([axes[0] == 1, axes[1] == 1, axes[0] == -1, axes[1] == -1, axes[5] == 1, axes[2] == 1, axes[5] == -1, axes[2] == -1, 
                                    axe == -0.4, axe == 0.1, axe == 0.7, axe == -1]).forEach(function(value, index) {
                                    input.each[id].axe[index] = { id: index, active: value };
                                });
                                buttons.forEach(function(value, index) {
                                    input.each[id].button[index] = { id: index, active: value.pressed };
                                });
                            }
                        }, input.time || 100);
                    });
                    window.addEventListener("gamepaddisconnected", function(event) {
                        event.preventDefault(); window.clearInterval(update); update = undefined;
                        var id = event.gamepad.index, name = event.gamepad.id;
                        input.each[id] = { id: id, name: name, active: false, axe: new Array(), button: new Array() };
                    });
                    return input;
                };
                input.clear = function(id) {
                    input.each.forEach(function(pad) {
                        if (pad.id == id) {
                            pad.axe.forEach(function(axe) { axe.active = false; });
                            pad.button.forEach(function(button) { button.active = false; });
                        }
                    });
                };
                input.sensitivity = function(value) { input.time = value; return input; };
                input.each = new Array();
                return input;
            }
        };
        engine.Script = function() {
            var script = new Object();
            script.get = function(params, callback) {
                var worker = new Worker(document.head.getAttribute("bridge:source")); worker.addEventListener("message", function(event) { if (callback) callback(event.data); }, false);
                if (params) worker.postMessage(params); return script;
            };
            script.preload = function(resources) {
                var preload = new Object();
                preload.index = 0;
                preload.response = function(callback) {
                    var request = new (XMLHttpRequest || ActiveXObject) ("Microsoft.XMLHTTP");
                    var total = resources.length, count = preload.index + 1;
                    request.open("GET", resources[preload.index], true); request.send();
                    request.onload = request.onerror = function(event) {
                        script.source(this.response, function() {
                            if (preload.index < total) {
                                var name = resources[preload.index].replace(/^.*[\/]/, none).replace(/[\?].*$/, none);
                                if (callback) callback(total, count, name, event); preload.index++;
                                if (count < total) preload.response(callback);
                            }
                        });
                    };
                    return preload;
                };
                return preload;
            };
            script.data = function(data, callback) {
                if (data) script.get({ data: data }, function(data) { engine.Execute(data.source).response(callback); }); return script;
            };
            script.source = function(source, callback) {
                if (source) script.get({ source: source }, function(data) { engine.Execute(data.source).response(callback); }); return script;
            };
            script.compile = function(source, callback) {
                if (source) script.get({ source: source }, function(data) { if (callback) callback(data.data, data.source); }); return script;
            };
            script.execute = function(source) {
                if (source) script.get({ source: source }, function(data) { new Function(data.source) (); }); return script;
            };
            script.bridge = function(callback) {
                script.get({ bridge: true }, callback); return script;
            };
            script.create = function() {
                var source = document.querySelectorAll("script[type=\"text\/bridge\"]"); script.execute(document.body.getAttribute("bridge:execute"));
                for (var index = 0; index < source.length; index++) script.source(source[index].innerText); return script;
            };
            return script;
        };
        engine.Font = function(name, file, callback, error) {
            (new FontFace(name, "url(\""  + file + "\")")).load().then(function(face) {
                if (callback) callback(face); document.fonts.add(face);
            }).catch(function(e) {
                if (callback) callback(false); if (error) error(e); engine.Style("@font-face").add("font-family", name).add("src", "url(\"" + file + "\")");
            }); return this;
        };
        engine.Style = function(query) {
            var style = new Object();
            style.text = function(value) {
                (query || document.querySelector("STYLE") || document.head.appendChild(document.createElement("STYLE"))).textContent += value; return style;
            };
            style.data = function(selector) {
                if (document.styleSheets) {
                    if (document.styleSheets.length < 1) engine.View("STYLE").head();
                    for (var index = 0; index < document.styleSheets.length; index++) {
                        var sheet = document.styleSheets[index], rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
                        for (var index = 0; index < rules.length; index++)
                            if (rules[index].selectorText == selector) return { active: true, index: index, size: rules.length, sheet: sheet, rule: rules[index] };
                        return { active: false, size: rules.length, sheet: sheet, rules: rules };
                    }
                }
            };
            style.add = function(key, value) {
                query.split(/(?:\s*\,\s*)/).forEach(function(selector) {
                    var data = style.data(selector); if (data && data.active == false) { try { data.sheet.addRule(selector, none, data.size); data = style.data(selector); } catch(error) { } }
                    if (data && data.rule && data.active == true) data.rule.style.setProperty(key, value); }); return this;
            };
            style.get = function(key) {
                var array = new Array(); query.split(/(?:\s*\,\s*)/).forEach(function(selector) {
                    var item = ((style.data(selector) || {}).rule || {}).style; if (item && key) array.push({ key: key, value: item.getPropertyValue(key) }); else if (item) array.push(item); }); return array;
            };
            style.remove = function(key) {
                query.split(/(?:\s*\,\s*)/).forEach(function(selector) { var item = ((style.data(selector) || {}).rule || {}).style; if (item != undefined) item.removeProperty(key); }); return this;
            };
            style.delete = function() {
                query.split(/(?:\s*\,\s*)/).forEach(function(selector) { var data = style.data(selector) || {}; if (data.matches) data.sheet.deleteRule(data.index); }); return this;
            };
            return style;
        };
        engine.Socket = function(source) {
            var socket = new Object(), websocket = new WebSocket(source);
            socket.open = function(callback) {
                if (websocket) websocket.onopen = function() { if (callback) callback(websocket); }; return socket;
            };
            socket.message = function(callback) {
                if (websocket) websocket.onmessage = function(message) { if (callback) callback(message); }; return socket;
            };
            socket.error = function(callback) {
                if (websocket) websocket.onerror = function(error) { if (callback) callback(error); }; return socket;
            };
            socket.close = function(callback) {
                if (websocket) websocket.onclose = function() { if (callback) callback(); }; return socket;
            };
            socket.send = function(message) { if (websocket) websocket.send(message); return socket; };
            socket.get = function() { if (websocket) return websocket; };
            return socket;
        };
        engine.Execute = function(source) {
            var execute = new Object();
            execute.response = function(callback) {
                var script = document.createElement("SCRIPT"), blob = new Blob([source], { type: "text/plain" }), object = window.URL.createObjectURL(blob);
                script.onload = function() { window.URL.revokeObjectURL(object); if (callback) callback(source); };
                script.src = object; document.head.appendChild(script); return execute;
            }
            return execute;
        }
        engine.Read = function(array, type) {
            var read = new Object();
            read.response = function(callback, error) {
                var data = new Array(), total = array.length, count = 1;
                for (var index = 0; index < total; index++) {
                    data[index] = new FileReader();
                    data[index].onerror = function(event) { if (error) error(event); };
                    data[index].onload = function() {
                        if (callback) callback(total, count, this); count++;
                    };
                    data[index].readAsArrayBuffer(type ? new Blob([array[index]], { "type": type }) : array[index]);
                }
                return array;
            };
            return read;
        };
        engine.Files = function(array) {
            var files = new Object();
            files.response = function(callback, error) {
                var data = new Array(), total = array.length, count = 1;
                for (var index = 0; index < total; index++) {
                    data[index] = new (XMLHttpRequest || ActiveXObject) ("Microsoft.XMLHTTP");
                    data[index].open("GET", array[index], true); data[index].responseType = "arraybuffer";
                    data[index].onerror = function(event) { if (error) error(event); };
                    data[index].onload = function(file) {
                        var buffer = this.response, name = array[count].replace(/^.*[\\\/]/, none);
                        if (callback) callback(total, count, name, buffer); count++;
                    };
                    data[index].send();
                }
                return array;
            };
            return files;
        };
        engine.Request = function(input, params, headers) {
            var request = new Object();
            request.response = function(callback, error) {
                var server = new (XMLHttpRequest || ActiveXObject) ("Microsoft.XMLHTTP");
                var data = (typeof input === "string" ? { source: input } : input), source = data.source;
                try {
                    if (data.title) document.title = data.title;
                    if (data.title) window.history.pushState(null, data.title, source);
                    if (data.type) server.responseType = data.type;
                    if (params) server.open("POST", source, true); else server.open("GET", source, true);
                    if (params) server.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    if (headers) headers.forEach(function(header) { server.setRequestHeader(header.key, header.value); });
                    if (params) server.send(engine.Params(params)); else server.send();
                    server.onload = function() {
                        if (this.readyState == 4 && (this.status == 200 || this.status == 304)) {
                            var response = this.response;
                            if (callback) callback(data.type == "json" && typeof response !== "object" ? engine.Parse.JSON(response) : response, source);
                        }
                    };
                } catch(event) { if (error) error(event); }
                return server;
            };
            return request;
        };
        engine.Speech = {
            recognizer: function(item) {
                var recognizer =  new Object();
                recognizer.response = function(callback) {
                    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition) ();
                    recognition.interimResults = item && item.interim ? item.interim : false; if (item && item.max) recognition.maxAlternatives = item.max; 
                    recognition.lang = item && item.lang ? item.lang : "en-US"; if (item && item.continuous) recognition.continuous = item.continuous; if (item && item.grammars) recognition.grammars = item.grammars;
                    recognition.onresult = function(event) { if (callback) callback(event.results[0][0].transcript); }; recognition.start(); return recognition;
                };
                return recognizer;
            },
            synthesizer: function(value) {
                var synthesizer = new (window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance || window.mozSpeechSynthesisUtterance || window.msSpeechSynthesisUtterance) ();
                synthesizer.text = value && value.text ? value.text : value; synthesizer.pitch = value && value.pitch ? value.pitch : 2; synthesizer.rate = value && value.rate ? value.rate : 1;
                synthesizer.volume = value && value.volume ? value.volume : 1; synthesizer.lang = value && value.lang ? value.lang : "en-US";
                synthesizer.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == value && value.voice ? value.voice : "Agnes"; })[0];
                speechSynthesis.speak(synthesizer); return synthesizer;
            }
        };
        engine.Vector = function(width, height) {
            var vector = new Object();
            var tag = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            if (width != undefined) tag.setAttributeNS(null, "width", width);
            if (height != undefined) tag.setAttributeNS(null, "height", height);
            vector.attribute = function(key, value) {
                if (key && value != undefined) tag.setAttributeNS(null, key, value); return this;
            };
            vector.view = function(value) {
                vector.attribute("viewBox", value); return this;
            };
            vector.add = function() {
                document.body.appendChild(tag); return this;
            };
            vector.into = function(value) {
                value.get ? value.get().appendChild(tag) : value.appendChild(tag); return this;
            };
            vector.child = function(name, callback) {
                var child = document.createElementNS("http://www.w3.org/2000/svg", name);
                if (callback) callback(function(key, value) { child.setAttributeNS(null, key, value); }); tag.appendChild(child); return this;
            };
            vector.group = function(name, callback) {
                var group = document.createElementNS("http://www.w3.org/2000/svg", "g"); 
                var child = document.createElementNS("http://www.w3.org/2000/svg", name); tag.appendChild(group);
                if (callback) callback(function(key, value) { child.setAttributeNS(null, key, value); }); group.appendChild(child); return this;
            };
            vector.get = function() {
                return tag;
            };
            return vector;
        };
        engine.Draw = function() {
            var draw = new Object();
            draw.canvas = document.createElement("canvas");
            draw.create = function(width, height) {
                draw.width = width;
                draw.height = height;
                draw.canvas.width = width;
                draw.canvas.height = height;
                draw.canvas.height = height;
                draw.viewport = { x: 0, y: 0, width: width, height: height, density: 1 };
                draw.context = draw.canvas.getContext("2d");
                draw.each = new Array(); draw.value = new Object(); draw.item = new Object(); draw.input = new Object(); draw.button = new Object();
                draw.resource = new Object({ image: new Object(), audio: new Object(), video: new Object() }); return draw;
            };
            draw.into = function(tag) {
                if (tag && draw.canvas) (tag.get ? tag.get().appendChild(draw.canvas) : tag.appendChild(draw.canvas)); return draw;
            };
            draw.add = function() {
                if (draw.canvas) document.body.appendChild(draw.canvas); return draw;
            };
            draw.full = function() {
                document.body.scrollTop = 0; document.body.style.overflow = "hidden"; return draw;
            };
            draw.open = function(source, variable) {
                var now = 0, previous = 0, vendors = ["ms", "moz", "webkit", "o"], script = (source ? new source(variable) : new Object()); draw.frames = 0; draw.now = 0; draw.time = 0;
                var loop = function() {
                    previous = now; now = performance.now(); draw.frames = 1000 / (now - previous); draw.delta = 1 / draw.frames; draw.interpolation = 60 / draw.frames; draw.now += (now - previous) / 1000; draw.time += (now - previous) / 1000 / draw.interpolation;
                    previous = now; draw.id = window.requestAnimationFrame(loop, draw.canvas);
                    if (script.input) script.input(); if (script.update) script.update(); if (script.render) script.render(); if (script.end) script.end(); draw.frame += 1;
                };
                for (var index = 0; index < vendors.length && window.requestAnimationFrame == undefined; ++index) window.requestAnimationFrame = window[vendors[index] + "RequestAnimationFrame"];
                for (var index = 0; index < vendors.length && window.cancelAnimationFrame == undefined; ++index) window.cancelAnimationFrame = window[vendors[index] + "RequestAnimationFrame"];
                if (draw.id) window.cancelAnimationFrame(draw.id); draw.id = undefined; draw.reset(); if (script.create) script.create(); draw.id = window.requestAnimationFrame(loop);
            };
            draw.reset = function() {
                draw.width = draw.canvas.width; draw.height = draw.canvas.height; draw.viewport.x = 0; draw.viewport.y = 0; draw.each = new Array(); draw.frame = 0;
            };
            draw.collision = function(item, a) {
                var left = (item.x + item.width / 2) - (a.x + a.width / 2), top = (item.y + item.height / 2) - (a.y + a.height / 2);
                var right = item.width / 2 + a.width / 2, bottom = item.height / 2 + a.height / 2; var direction = null;
                if (Math.abs(left) < right && Math.abs(top) < bottom) {
                    var dx = right - Math.abs(left), dy = bottom - Math.abs(top);
                    if (dx < dy) {
                        if (left > 0) { direction = "left"; item.x += dx; } else { direction = "right"; item.x -= dx; }
                    } else {
                        if (top > 0) { direction = "top"; item.y += dy; } else { direction = "bottom"; item.y -= dy; }
                    }
                }
                return direction;
            };
            draw.intersection = function(a, b) {
                return a && a.radius >= 0 || b && b.radius >= 0 ? Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)) < (a.radius || 0) + (b.radius || 0) : 
                    !(a.x + (a.width || 0) < b.x || a.x > b.x + (b.width || 0) || a.y + (a.height || 0) < b.y || a.y > b.y + (b.height || 0));
            };
            draw.click = function(touch, item) {
                if (draw.intersection(item, { x: (draw.viewport.x + touch.x / draw.viewport.density), y: (draw.viewport.y + touch.y / draw.viewport.density) })) return true; return false;
            };
            draw.vector = function(x, y) {
                var vector = { x: x, y: y };
                vector.set = function(x, y) { vector.x = x; vector.y = y; return vector; };
                vector.add = function(v) { vector.x += v.x; vector.y += v.y; return vector; };
                vector.minus = function(v) { vector.x = vector.x - v.x; vector.y = vector.y - v.y; return vector; };
                vector.multiply = function(x) { vector.x *= x; vector.y *= x; return vector; };
                vector.divide = function(x) { vector.x /= x; vector.y /= x; return vector; };
                vector.direction = function(direction) {
                    if (direction == undefined) {
                        return Math.atan2(vector.y, vector.x);
                    } else {
                        var magnitude = vector.magnitude();
                        vector.x = Math.cos(angle) * magnitude;
                        vector.y = Math.sin(angle) * magnitude;
                        return vector;
                    }
                };
                vector.magnitude = function(magnitude) {
                    if (magnitude == undefined) {
                        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
                    } else {
                        var direction = vector.direction();
                        vector.x = Math.cos(direction) * magnitude;
                        vector.y = Math.sin(direction) * magnitude;
                        return vector;
                    }
                };
                vector.normalize = function() {
                    var magnitude = vector.magnitude(); if (magnitude > 0) vector.divide(magnitude); return vector;
                };
                return vector;
            };
            draw.radians = function(degrees) {
                return degrees * (Math.PI / 180);
            };
            draw.random = function(max) {
                return Math.floor(Math.random() * max);
            };
            draw.direction = function(angle) {
                return draw.vector(Math.cos(angle), Math.sin(angle));
            };
            draw.map = function(value, start1, stop1, start2, stop2) {
                return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
            };
            draw.clamp = function(value, min, max) {
                return value < min ? min : value > max ? max : value;
            };
            draw.neighbours = function(points, max) {
                points.sort(function(a, b) { return draw.distance(a) - draw.distance(b); }); return points.slice(0, max);
            };
            draw.distance = function(point, destination) {
                if (destination) return Math.sqrt(Math.pow(point.x - destination.x, 2) + Math.pow(point.y - destination.y, 2));
                    else return (point.x * point.x) + (point.y * point.y);
            };
            draw.scale = function(width, height) {
                draw.viewport.width = width; draw.viewport.height = height;
                draw.viewport.density = Math[width > height ? "max" : "min"] (draw.canvas.width / draw.viewport.width, draw.canvas.height / draw.viewport.height);
                if (draw.width < draw.canvas.width / draw.viewport.density) draw.width = draw.canvas.width / draw.viewport.density;
                if (draw.height < draw.canvas.height / draw.viewport.density) draw.height = draw.canvas.height / draw.viewport.density; return draw;
            };
            draw.camera = function(target, x, y) {
                draw.viewport.x = -draw.clamp(-target.x + (x == undefined ? draw.canvas.width / 2 : x), draw.canvas.width / draw.viewport.density - draw.width, 0);
                draw.viewport.y = -draw.clamp(-target.y + (y == undefined ? draw.canvas.height / 2 : y), draw.canvas.height / draw.viewport.density - draw.height, 0);
                draw.context.setTransform(draw.viewport.density, 0, 0, draw.viewport.density, 0, 0); draw.context.translate(-draw.viewport.x, -draw.viewport.y);
            };
            draw.center = function(item) {
                item.x = draw.viewport.x + (draw.canvas.width / draw.viewport.density) / 2 - item.width / 2;
                item.y = draw.viewport.y + (draw.canvas.height / draw.viewport.density) / 2 - item.height / 2; return draw;
            };
            draw.top = function(item, top) {
                item.y = draw.viewport.y + (top || 0); return draw;
            };
            draw.left = function(item, left) {
                item.x = draw.viewport.x + (left || 0); return draw;
            };
            draw.right = function(item, right) {
                item.x = draw.viewport.x + draw.canvas.width / draw.viewport.density - (right || 0); return draw;
            };
            draw.bottom = function(item, bottom) {
                item.y = draw.viewport.y + draw.canvas.height / draw.viewport.density - (bottom || 0); return draw;
            };
            draw.wait = function(value) {
                if (draw.frame == 1 || (draw.frame / value) % 1 == 0) return true; return false;
            };
            draw.clear = function() {
                draw.context.clearRect(0, 0, draw.width, draw.height); return draw;
            };
            draw.view = function(x, y) {
                draw.context.setTransform(draw.viewport.density, 0, 0, draw.viewport.density, 0, 0); draw.context.translate(x || -draw.viewport.x, y || -draw.viewport.y); return draw;
            };
            draw.transform = function(x, y, sx, sy, kx, ky) {
                draw.context.setTransform(sx, kx, ky, sy, x, y); return draw;
            };
            draw.opacity = function(value) {
                if (value != undefined) draw.context.globalAlpha = value; return value != undefined ? draw : draw.context.globalAlpha;
            };
            draw.quality = function(value) {
                if (value != undefined) draw.context.imageSmoothingQuality = value; return value != undefined ? draw : draw.context.imageSmoothingQuality;
            };
            draw.composite = function(value) {
                if (value) draw.context.globalCompositeOperation = value; return value ? draw : draw.context.globalCompositeOperation;
            };
            draw.translate = function(x, y) {
                draw.context.translate(x, y); return draw;
            };
            draw.rotate = function(value) {
                draw.context.rotate(value); return draw;
            };
            draw.begin = function() {
                draw.context.beginPath(); return draw;
            };
            draw.close = function() {
                draw.context.closePath(); return draw;
            };
            draw.save = function() {
                draw.context.save(); return draw;
            };
            draw.restore = function() {
                draw.context.restore(); return draw;
            };
            draw.size = function(value) {
                draw.context.lineWidth = value; return draw;
            };
            draw.len = function(value) {
                return draw.context.measureText(value).width;
            };
            draw.cap = function(value) {
                if (value) draw.context.lineCap = value; return draw;
            };
            draw.stroke = function(value) {
                value ? draw.context.strokeStyle = value : draw.context.stroke(); return draw;
            };
            draw.fill = function(value) {
                value ? draw.context.fillStyle = value : draw.context.fill(); return draw;
            };
            draw.from = function(x, y) {
                draw.context.moveTo(x, y); return draw;
            };
            draw.to = function(x, y) {
                draw.context.lineTo(x, y); return draw;
            };
            draw.rectangle = function(x, y, width, height) {
                draw.context.fillRect(x, y, width, height); return draw;
            };
            draw.border = function(x, y, width, height) {
                draw.context.strokeRect(x, y, width, height); return draw;
            };
            draw.arc = function(x, y, radius, sAngle, eAngle, counterclockwise) {
                draw.context.arc(x, y, radius, sAngle, eAngle, counterclockwise); return draw;
            };
            draw.font = function(value) {
                if (value) draw.context.font = value; return value ? draw : draw.context.font;
            };
            draw.baseline = function(value) {
                if (value) draw.context.textBaseline = value; return value ? draw : draw.context.textBaseline;
            };
            draw.align = function(value) {
                if (value) draw.context.textAlign = value; return value ? draw : draw.context.textAlign;
            };
            draw.circle = function(x, y, radius) {
                draw.context.arc(x, y, radius, 0, 2 * Math.PI); return draw;
            };
            draw.text = function(x, y, value) {
                if (Array.isArray(value)) value.forEach(function(k, v) { draw.context.fillText(v, x, y + (k * (parseInt(draw.context.font) + 5))); });
                    else draw.context.fillText(value, x, y); return draw;
            };
            draw.image = function(image, x, y, width, height) {
                if (width != undefined && height != undefined) draw.context.drawImage(image.get ? image.get() : image, 0, 0, image.width, image.height, x, y, width, height); 
                    else draw.context.drawImage(image.get ? image.get() : image, x || 0, y || 0); return draw;
            };
            draw.data = function(x, y, width, height) {
                return draw.context.getImageData(x || 0, y || 0, width == undefined ? draw.canvas.width : width, height == undefined ? draw.canvas.height : height).data;
            };
            draw.shadow = function(item) {
                if (item.color != undefined) draw.context.shadowColor = item.color;
                if (item.size != undefined) draw.context.shadowBlur = item.size; else draw.context.shadowBlur = 0;
                if (item.x != undefined) draw.context.shadowOffsetX = item.x; if (item.y != undefined) draw.context.shadowOffsetY = item.y; return draw;
            };
            draw.gradient = function(x, y, r) {
                var gradient = new Object(); gradient.context = draw.context; gradient.index = 0;
                gradient.linear = function(x1) { gradient.item = gradient.context.createLinearGradient(x, y, r, x1); return gradient; };
                gradient.radial = function(x1, y1, r1) { gradient.item = gradient.context.createRadialGradient(x, y, r, x1, y1, r1); return gradient; };
                gradient.color = function(color) { if (gradient.item) gradient.item.addColorStop(gradient.index, color); if (gradient.item) gradient.index++; return gradient; };
                gradient.get = function() { return gradient.item; }; return gradient;
            };
            draw.render = function(item) {
                draw.context.save();
                if (item.opacity) draw.context.globalAlpha = item.opacity;
                if (item.size) draw.context.lineWidth = item.size;
                if (item.color) draw.context.fillStyle = item.color;
                if (item.border) draw.context.strokeStyle = item.border;
                if (item.font) draw.context.font = item.font;
                if (item.cap) draw.context.lineCap = item.cap;
                if (item.radius) draw.context.beginPath();
                if (item.color) draw.context.fillRect(item.x, item.y, item.width, item.height);
                if (item.border) draw.context.strokeRect(item.x, item.y, item.width, item.height);
                if (item.radius) draw.context.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
                if (item.text) draw.context.fillText(item.text, item.x, item.y);
                if (item.image) draw.context.drawImage(item.image, 0, 0, item.image.width, item.image.height, item.x, item.y, item.width, item.height); 
                if (item.color) draw.context.fill();
                if (item.border) draw.context.stroke();
                draw.context.restore();
            };
            draw.lines = function(text, width) {
                var lines = new Array(), paragraphs = text.split("\n");
                for (var i = 0; i < paragraphs.length; i++) {
                    var words = paragraphs[i].split(" "), line = words[0];
                    for (var j = 1; j < words.length; j++) {
                        if (context.measureText(line + " " + words[j]).width <= width) line += " " + words[j]; 
                            else if (width) lines.push(line); line = words[j];
                    }
                    if (width) lines.push(line); else lines.push(paragraphs[i]);
                }
                return lines;
            };
            draw.angle = function(dx, dy) {
                var angle = Math.atan2(dy, dx) * 180 / Math.PI; return angle < 0 ? angle + 360 : angle;
            };
            draw.vibrate = function(value, callback) {
                var x = Math.random() * value, y = Math.random() * value;
                if (callback) context.save(); draw.context.translate(x, y); if (callback) callback(draw); if (callback) context.restore(); return draw;
            };
            draw.rotation = function(angle, x, y, width, height, callback) {
                draw.context.save();
                draw.context.translate(x + width / 2, y + height / 2);
                draw.context.rotate(angle * Math.PI / 180);
                if (callback) callback({ x: -width / 2, y: -height / 2, width: width, height: height });
                draw.context.restore();
            };
            draw.print = function() {
                var print = new Object();
                print.x = 0;
                print.y = 0;
                print.size = 1;
                print.width = 0;
                print.height = 0;
                print.padding = 0;
                print.opacity = 1;
                print.value = null;
                print.each = new Array();
                print.canvas = document.createElement("canvas");
                print.context = print.canvas.getContext("2d");
                print.color = engine.Color.BLACK;
                print.update = function() {
                    var value = (print.value ? print.value.toString().toUpperCase().split(none) : []);
                    print.each = new Array(); print.width = 0; print.height = 0;
                    for (var index = 0; index < value.length; index++) {
                        var position = character.indexOf(value[index]);
                        if (position >= 0) {
                            var width = 0, height = 0;
                            (matrix[position] || []).forEach(function(row, y, rows) {
                                width = print.size * row.length; height = print.size * rows.length;
                                row.forEach(function(id, x) {
                                    if (id) print.each.push({ x: x * print.size + print.width, y: y * print.size, height: print.size, width: print.size });
                                });
                            });
                            print.width = print.width + width + (index < value.length - 1 ? print.size : 0); print.height = height;
                        }
                    }
                    print.canvas.width = print.width; print.canvas.height = print.height;
                    if (print.opacity < 1) print.context.globalAlpha = print.opacity;
                    print.each.forEach(function(each) {
                        print.context.fillStyle = print.color;
                        print.context.fillRect(each.x, each.y, each.width, each.height);
                    });
                };
                print.render = function() {
                    draw.context.drawImage(print.canvas, 0, 0, print.canvas.width, print.canvas.height, print.x, print.y, print.width, print.height); 
                };
                return print;
            };
            draw.polygon = function() {
                var polygon = new Object();
                polygon.x = 0;
                polygon.y = 0;
                polygon.width = 0;
                polygon.height = 0;
                polygon.opacity = 1;
                polygon.left = false;
                polygon.id = 0;
                polygon.index = 0;
                polygon.frame = 0;
                polygon.frames = [0];
                polygon.compare = [0];
                polygon.duration = 20;
                polygon.size = { width: 0, height: 0 };
                polygon.each = new Array();
                polygon.data = new Array();
                polygon.canvas = document.createElement("canvas");
                polygon.context = polygon.canvas.getContext("2d");
                polygon.source = function(source) {
                    var width = new Array(), height = new Array();
                    var point = function(value) {
                        var vector = value.split(/\:/);
                        return { x: polygon.size.width * parseFloat(vector[0]), y: polygon.size.height * parseFloat(vector[1]) };
                    };
                    source.split(/\>/).forEach(function(data, id) {
                        polygon.data[id] = new Array();
                        data.split(/\//).forEach(function(item) {
                            var color = engine.Color.BLACK, opacity = 1, vector = new Array();
                            item.split(/\s+/).forEach(function(value, index) {
                                if (index == 0) color = engine.Type.HASHTAG + value;
                                if (index == 1) opacity = parseFloat(value);
                                if (index > 1) {
                                    var dot = point(value); width.push(dot.x); height.push(dot.y);
                                    vector.push({ x: dot.x, y: dot.y });
                                }
                            });
                            polygon.data[id].push({ color: color, opacity: opacity, vector: vector });
                        });
                    });
                    if (polygon.width == 0) polygon.width = Math.max.apply(Math, width);
                    if (polygon.height == 0) polygon.height = Math.max.apply(Math, height);
                };
                polygon.animate = function() {
                    if (polygon.frames.join(none) != polygon.compare.join(none)) { polygon.compare = polygon.frames; polygon.frame = 0; polygon.index = 0; }
                    if ((polygon.frame / polygon.duration) % 1 == 0) polygon.id = polygon.frames[++polygon.index % polygon.frames.length]; polygon.frame += 1;
                };
                polygon.update = function() {
                    polygon.each = new Array();
                    if (polygon.data[polygon.id]) polygon.data[polygon.id].forEach(function(value) {
                        var vector = new Array();
                        value.vector.forEach(function(point) {
                            vector.push({ x: (polygon.left ? polygon.width - point.x : point.x), y: point.y });
                        });
                        polygon.each.push({ color: value.color, opacity: value.opacity, vector: vector });
                    });
                    polygon.canvas.width = polygon.width; polygon.canvas.height = polygon.height;
                    if (polygon.opacity < 1) polygon.context.globalAlpha = polygon.opacity;
                    polygon.each.forEach(function(value) {
                        polygon.context.beginPath();
                        polygon.context.fillStyle = value.color;
                        polygon.context.globalAlpha = value.opacity;
                        value.vector.forEach(function(point, index) {
                            if (index == 0) polygon.context.moveTo(point.x, point.y);
                            if (index > 0) polygon.context.lineTo(point.x, point.y);
                        });
                        polygon.context.fill();
                        polygon.context.closePath();
                    });
                };
                polygon.render = function() {
                    draw.context.drawImage(polygon.canvas, 0, 0, polygon.canvas.width, polygon.canvas.height, polygon.x, polygon.y, polygon.width, polygon.height);
                };
                return polygon;
            };
            draw.colorset = function() {
                var colorset = new Object();
                colorset.x = 0;
                colorset.y = 0;
                colorset.width = 0;
                colorset.height = 0;
                colorset.opacity = 1;
                colorset.left = false;
                colorset.id = 0;
                colorset.index = 0;
                colorset.frame = 0;
                colorset.frames = [0];
                colorset.compare = [0];
                colorset.duration = 20;
                colorset.each = new Array();
                colorset.data = new Array();
                colorset.color = new Object();
                colorset.canvas = document.createElement("canvas");
                colorset.context = colorset.canvas.getContext("2d");
                colorset.size = { width: 1, height: 1 };
                colorset.source = function(source) {
                    var color = source.split(/\>/).reduce(function(value) { return value; }).split(/\//).map(function(value) { return value.split(/\s+/); });
                    var data = source.split(/\>/).map(function(value, index) { if (value && index > 0) return value.split(/\//); }).filter(Boolean);
                    for (var index in color) if (color.hasOwnProperty(index)) colorset.color[color[index][0]] = engine.Type.HASHTAG + color[index][1];
                    for (var index in data) if (data.hasOwnProperty(index)) colorset.data[index] = data[index].map(function(value) { return value.split(/\s+/).map(function(v) { return new Number(v).valueOf(); }); });
                };
                colorset.animate = function() {
                    if (colorset.frames.join(none) != colorset.compare.join(none)) { colorset.compare = colorset.frames; colorset.frame = 0; colorset.index = 0; }
                    if ((colorset.frame / colorset.duration) % 1 == 0) colorset.id = colorset.frames[++colorset.index % colorset.frames.length]; colorset.frame += 1;
                };
                colorset.update = function() {
                    var data = colorset.data[colorset.id]; colorset.width = 0; colorset.height = 0; colorset.each = new Array();
                    if (colorset.opacity < 1) colorset.context.globalAlpha = colorset.opacity;
                    if (data) {
                        var width = colorset.size.width, height = colorset.size.height;
                        colorset.cols = data.reduce(function(value) { return value; }).length; colorset.rows = data.length;
                        colorset.width = colorset.cols * width; colorset.height = colorset.rows * height;
                        colorset.canvas.width = colorset.width; colorset.canvas.height = colorset.height;
                        data.forEach(function(value, y) {
                            value.forEach(function(id, x) {
                                var color = colorset.color[id];
                                if (color) {
                                    var transformation = x * width; if (colorset.left) transformation = (colorset.width - width) - x * width;
                                    colorset.each.push({ id: id, color: color, x: colorset.x + transformation, y: colorset.y + y * height, width: width, height: height });
                                    colorset.context.fillStyle = color; colorset.context.fillRect(transformation, y * height, width, height);
                                }
                            });
                        });
                    }
                };
                colorset.render = function() {
                    draw.context.drawImage(colorset.canvas, 0, 0, colorset.canvas.width, colorset.canvas.height, colorset.x, colorset.y, colorset.width, colorset.height);
                };
                return colorset;
            };
            draw.imageset = function() {
                var imageset = new Object();
                imageset.x = 0;
                imageset.y = 0;
                imageset.width = 0;
                imageset.height = 0;
                imageset.opacity = 1;
                imageset.left = false;
                imageset.id = 0;
                imageset.index = 0;
                imageset.frame = 0;
                imageset.frames = [0];
                imageset.compare = [0];
                imageset.duration = 20;
                imageset.resource = null;
                imageset.each = new Array();
                imageset.data = new Array();
                imageset.image = new Object();
                imageset.size = { width: 1, height: 1 };
                imageset.canvas = document.createElement("canvas");
                imageset.context = imageset.canvas.getContext("2d");
                imageset.source = function(source) {
                    var image = source.split(/\>/).reduce(function(value) { return value; }).split(/\//).map(function(value) { return value.split(/\s+/).map(function(v) { return new Number(v).valueOf(); }); });
                    var data = source.split(/\>/).map(function(value, index) { if (value && index > 0) return value.split(/\//); }).filter(Boolean);
                    for (var index in image) if (image.hasOwnProperty(index)) imageset.image[image[index][0]] = { x: image[index][1], y: image[index][2] };
                    for (var index in data) if (data.hasOwnProperty(index)) imageset.data[index] = data[index].map(function(value) { return value.split(/\s+/).map(function(v) { return new Number(v).valueOf(); }); });
                };
                imageset.animate = function() {
                    if (imageset.frames.join(none) != imageset.compare.join(none)) { imageset.compare = imageset.frames; imageset.frame = 0; imageset.index = 0; }
                    if ((imageset.frame / imageset.duration) % 1 == 0) imageset.id = imageset.frames[++imageset.index % imageset.frames.length]; imageset.frame += 1;
                };
                imageset.update = function() {
                    var data = imageset.data[imageset.id]; imageset.width = 0; imageset.height = 0; imageset.each = new Array();
                    if (imageset.opacity < 1) imageset.context.globalAlpha = imageset.opacity;
                    if (data) {
                        var width = imageset.size.width, height = imageset.size.height;
                        imageset.cols = data.reduce(function(value) { return value; }).length; imageset.rows = data.length;
                        imageset.width = imageset.cols * width; imageset.height = imageset.rows * height;
                        imageset.canvas.width = imageset.width; imageset.canvas.height = imageset.height; if (imageset.left) imageset.context.setTransform(-1, 0, 0, 1, imageset.width, 0);
                        data.forEach(function(value, y) {
                            value.forEach(function(id, x) {
                                var image = imageset.image[id];
                                if (image) {
                                    var transformation = x * width; if (imageset.left) transformation = (imageset.width - width) - x * width;
                                    imageset.each.push({ id: id, x: imageset.x + transformation, y: imageset.y + y * height, width: width, height: height });
                                    imageset.context.drawImage(imageset.resource, image.x, image.y, width, height, x * width, y * height, width, height);
                                }
                            });
                        });
                    }
                };
                imageset.render = function() {
                    draw.context.drawImage(imageset.canvas, 0, 0, imageset.canvas.width, imageset.canvas.height, imageset.x, imageset.y, imageset.width, imageset.height);
                };
                return imageset;
            };
            draw.particle = function() {
                var particle = new Object();
                particle.generation = 1;
                particle.each = new Array();
                particle.context = draw.context;
                particle.item = function() {
                    var item = new Object();
                    item.x = 0;
                    item.y = 0;
                    item.width = 0;
                    item.height = 0;
                    item.force = 0.0;
                    item.friction = 0.8;
                    item.gravity = 0.98;
                    item.color = engine.Color.BLACK;
                    item.velocity = { x: 0, y: 0 };
                    item.alive = { value: 0, range: 0 };
                    item.death = function() {
                        return item.alive.value <= 0;
                    };
                    item.update = function() {
                        item.x += item.velocity.x;
                        item.y += item.velocity.y;
                        item.velocity.x += item.force;
                        item.velocity.x *= item.friction;
                        item.velocity.y += item.gravity;
                        item.alive.value -= item.alive.range;
                    };
                    item.render = function() {
                        particle.context.save();
                        particle.context.globalAlpha = item.alive.value;
                        particle.context.fillStyle = item.color;
                        particle.context.fillRect(item.x, item.y, item.width, item.height);
                        particle.context.restore();
                    };
                    return item;
                };
                particle.create = function() {
                    for (var index = 0; index < particle.generation; index++) particle.each.push(particle.item());
                };
                particle.update = function() {
                    particle.each.forEach(function(value, index) {
                        value.update(); if (value.death()) particle.each.splice(index, 1);
                    });
                };
                particle.render = function() {
                    particle.each.forEach(function(value) { value.render(); });
                };
                return particle;
            };
            draw.platformer = function() {
                var platformer = new Object();
                platformer.x = 0;
                platformer.y = 0;
                platformer.width = 0;
                platformer.height = 0;
                platformer.opacity = 1;
                platformer.friction = 0.8;
                platformer.gravity = 0.98;
                platformer.color = engine.Color.BLACK;
                platformer.velocity = { x: 0, y: 0 };
                platformer.context = draw.context;
                platformer.update = function() {
                    platformer.x += platformer.velocity.x;
                    platformer.y += platformer.velocity.y;
                    platformer.velocity.x *= platformer.friction;
                    platformer.velocity.y += platformer.gravity;
                };
                platformer.render = function() {
                    platformer.context.save();
                    platformer.opacity < 1 ? platformer.context.globalAlpha = platformer.opacity : null;
                    platformer.context.fillStyle = platformer.color;
                    platformer.context.fillRect(platformer.x, platformer.y, platformer.width, platformer.height);
                    platformer.context.restore();
                };
                return platformer;
            };
            draw.raycast = function() {
                var raycast = new Object();
                raycast.width = draw.width;
                raycast.height = draw.height;
                raycast.data = new Array();
                raycast.wall = new Object();
                raycast.image = new Object();
                raycast.texture = new Array();
                raycast.wall = { texture: new Object() };
                raycast.step = { x: -1, y: 1 };
                raycast.plane = { x: 0, y: 0.66 };
                raycast.viewport = { x: 0, y: 0 };
                raycast.distance = { x: 0, y: 0 };
                raycast.direction = { x: 0, y: 0 };
                raycast.camera = { x: 0, y: 0, direction: { x: -1, y: 0 } };
                raycast.canvas = document.createElement("canvas");
                raycast.context = raycast.canvas.getContext("2d");
                raycast.background = {
                    opacity: 0,
                    color: "black",
                    render: function() {
                        draw.context.save();
                        draw.context.fillStyle = this.color;
                        draw.context.fillRect(0, 0, raycast.width, raycast.height);
                        draw.context.restore();
                    }
                };
                raycast.move = function(move) {
                    var value = move / draw.frames;
                    if (raycast.data[Math.floor(raycast.camera.x + raycast.camera.direction.x * value)][Math.floor(raycast.camera.y)] == false) raycast.camera.x += raycast.camera.direction.x * value;
                    if (raycast.data[Math.floor(raycast.camera.x)][Math.floor(raycast.camera.y + raycast.camera.direction.y * value)] == false) raycast.camera.y += raycast.camera.direction.y * value;
                };
                raycast.rotate = function(rotate) {
                    var direction = raycast.camera.direction.x, plane = raycast.plane.x, value = rotate / draw.frames;
                    raycast.camera.direction.x = raycast.camera.direction.x * Math.cos(value) - raycast.camera.direction.y * Math.sin(value);
                    raycast.camera.direction.y = direction * Math.sin(value) + raycast.camera.direction.y * Math.cos(value);
                    raycast.plane.x = raycast.plane.x * Math.cos(value) - raycast.plane.y * Math.sin(value);
                    raycast.plane.y = plane * Math.sin(value) + raycast.plane.y * Math.cos(value);
                };
                raycast.update = function() {
                    raycast.canvas.width = raycast.width;
                    raycast.canvas.height = raycast.height;
                    for (var x = 0; x < raycast.width; x++) {
                        raycast.wall.hit = 0; raycast.wall.distance = new Object();
                        raycast.viewport.x = 2 * x / raycast.width - 1;
                        raycast.direction.x = raycast.camera.direction.x + raycast.plane.x * raycast.viewport.x;
                        raycast.direction.y = raycast.camera.direction.y + raycast.plane.y * raycast.viewport.x;
                        raycast.x = Math.floor(raycast.camera.x);
                        raycast.y = Math.floor(raycast.camera.y);
                        raycast.distance.x = Math.abs(1 / raycast.direction.x);
                        raycast.distance.y = Math.abs(1 / raycast.direction.y);
                        if (raycast.direction.x < 0) {
                            raycast.step.x = -1; raycast.wall.distance.x = (raycast.camera.x - raycast.x) * raycast.distance.x;
                        } else {
                            raycast.step.x = 1; raycast.wall.distance.x = (raycast.x + 1 - raycast.camera.x) * raycast.distance.x;
                        }
                        if (raycast.direction.y < 0) {
                            raycast.step.y = -1; raycast.wall.distance.y = (raycast.camera.y - raycast.y) * raycast.distance.y;
                        } else {
                            raycast.step.y = 1; raycast.wall.distance.y = (raycast.y + 1 - raycast.camera.y) * raycast.distance.y;
                        }
                        while (raycast.wall.hit == 0) {
                            if (raycast.wall.distance.x < raycast.wall.distance.y) {
                                raycast.wall.distance.x += raycast.distance.x;
                                raycast.x += raycast.step.x; raycast.wall.side = 0;
                            } else {
                                raycast.wall.distance.y += raycast.distance.y;
                                raycast.y += raycast.step.y; raycast.wall.side = 1;
                            }
                            if (raycast.data[raycast.x][raycast.y] > 0) raycast.wall.hit = 1;
                        }
                        if (raycast.wall.side == 0) raycast.wall.perp = (raycast.x - raycast.camera.x + (1 - raycast.step.x) / 2) / raycast.direction.x;
                            else raycast.wall.perp = (raycast.y - raycast.camera.y + (1 - raycast.step.y) / 2) / raycast.direction.y;
                        raycast.wall.height = Math.floor(raycast.height / raycast.wall.perp); raycast.wall.begin = -raycast.wall.height / 2 + raycast.height / 2;
                        raycast.wall.end = raycast.wall.height / 2 + raycast.height / 2;
                        if (raycast.wall.end >= raycast.height) raycast.wall.end = raycast.height - 1;
                        raycast.wall.texture.value = raycast.texture[(raycast.data[raycast.x][raycast.y]) - 1];
                        if (raycast.wall.texture.value) {
                            raycast.context.save();
                            raycast.context.globalAlpha = (raycast.wall.height / raycast.height) * raycast.background.opacity;
                            if (raycast.wall.texture.value.substring(0, 1) == "#") {
                                raycast.context.fillStyle = raycast.wall.texture.value;
                                raycast.context.fillRect(x, raycast.wall.begin, 1, raycast.wall.height);
                            } else {
                                var image = raycast.image[raycast.wall.texture.value];
                                if (raycast.wall.side == 0) raycast.wall.x = raycast.camera.y + raycast.wall.perp * raycast.direction.y;
                                    else raycast.wall.x = raycast.camera.x + raycast.wall.perp * raycast.direction.x; raycast.wall.x -= Math.floor(raycast.wall.x);
                                raycast.wall.texture.x = Math.floor(raycast.wall.x * raycast.wall.texture.width);
                                if (raycast.wall.side == 0 && raycast.direction.x > 0) raycast.wall.texture.x = raycast.wall.texture.width - raycast.wall.texture.x - 1;
                                if (raycast.wall.side == 1 && raycast.direction.y < 0) raycast.wall.texture.x = raycast.wall.texture.width - raycast.wall.texture.x - 1;
                                if (image) raycast.context.drawImage(image, raycast.wall.texture.x, 0, 1, image.height, x, raycast.wall.begin, 1, raycast.wall.height);
                            }
                            raycast.context.restore();
                        }
                    }
                };
                raycast.render = function() {
                    raycast.background.render();
                    draw.context.drawImage(raycast.canvas, 0, 0, raycast.canvas.width, raycast.canvas.height, 0, 0, raycast.width, raycast.height);
                };
                return raycast;
            };
            return draw;
        };
        engine.View = function(name) {
            var view = new Object(), tag = (typeof name == "string" ? document.createElement(name) : (name.get ? name.get() : name)), display;
            view.id = function(value) { if (value != undefined) tag.id = value; return value != undefined ? view : tag.id; };
            view.tag = function(value) { if (value != undefined) view.label = value; return value != undefined ? view : view.label; };
            view.text = function(value) { if (value != undefined) tag.innerText = value; return value != undefined ? view : tag.innerText; };
            view.content = function(value) { if (value != undefined) tag.textContent = value; return value != undefined ? view : tag.textContent; };
            view.attribute = function(key, value) { if (value != undefined) tag.setAttribute(key, value); return value != undefined ? view : tag.getAttribute(key); };
            view.html = function(value) { if (value != undefined) tag.innerHTML = value; return value != undefined ? view : tag.innerHTML; };
            view.value = function(value) { if (value != undefined) tag.value = value; return value != undefined ? view : tag.value; };
            view.source = function(value) { if (value != undefined) tag.src = value.src ? value.src : value; return value != undefined ? view : tag.src; };
            view.object = function(value) { if (value != undefined) tag.srcObject = value.srcObject ? value.srcObject : value; return value != undefined ? view : tag.srcObject; };
            view.style = function(value) { tag.style.cssText += value; return value != undefined ? view : tag.style.cssText; };
            view.back = function(value) { tag.style.background = value; return value != undefined ? view : tag.style.background; };
            view.color = function(value) { tag.style.color = value; return value != undefined ? view : tag.style.color; };
            view.width = function(value) { tag.style.width = engine.Pixel(value); return value != undefined ? view : tag.style.width; };
            view.height = function(value) { tag.style.height = engine.Pixel(value); return value != undefined ? view : tag.style.height; };
            view.margin = function(a, b, c, d) { tag.style.margin = engine.Pixel(a, b, c, d); return a != undefined ? view : tag.style.margin; };
            view.padding = function(a, b, c, d) { tag.style.padding = engine.Pixel(a, b, c, d); return a != undefined ? view : tag.style.padding; };
            view.weight = function(value) { tag.style.flex = value; return value != undefined ? view : tag.style.flex; };
            view.index = function(value) { tag.style.zIndex = value; return value != undefined ? view : tag.style.zIndex; };
            view.top = function(value) { tag.style.top = engine.Pixel(value); return value != undefined ? view : tag.style.top; };
            view.bottom = function(value) { tag.style.bottom = engine.Pixel(value); return value != undefined ? view : tag.style.bottom; };
            view.right = function(value) { tag.style.right = engine.Pixel(value); return value != undefined ? view : tag.style.right; };
            view.left = function(value) { tag.style.left = engine.Pixel(value); return value != undefined ? view : tag.style.left; };
            view.cursor = function(value) { tag.style.cursor = value; return value != undefined ? view : tag.style.cursor; };
            view.family = function(value) { tag.style.fontFamily = value; return value != undefined ? view : tag.style.fontFamily; };
            view.size = function(value) { tag.style.fontSize = engine.Pixel(value); return value != undefined ? view : tag.style.fontSize; };
            view.line = function(value) { tag.style.lineHeight = engine.Pixel(value); return value != undefined ? view : tag.style.lineHeight; };
            view.tab = function(value) { tag.style.tabSize = value; return value != undefined ? view : tag.style.tabSize; };
            view.decoration = function(value) { tag.style.textDecoration = value; return value != undefined ? view : tag.style.textDecoration; };
            view.indent = function(value) { tag.style.textIndent = value; return value != undefined ? view : tag.style.textIndent; };
            view.display = function(value) { tag.style.display = value; return value != undefined ? view : tag.style.display; };
            view.float = function(value) { tag.style.cssFloat = value; return value != undefined ? view : tag.style.cssFloat; };
            view.opacity = function(value) { tag.style.opacity = value; return value != undefined ? view : tag.style.opacity; };
            view.overflow = function(value) { tag.style.overflow = value; return value != undefined ? view : tag.style.overflow; };
            view.overflowX = function(value) { tag.style.overflowX = value; return value != undefined ? view : tag.style.overflowX; };
            view.overflowY = function(value) { tag.style.overflowY = value; return value != undefined ? view : tag.style.overflowY; };
            view.valign = function(value) { tag.style.verticalAlign = value; return value != undefined ? view : tag.style.verticalAlign; };
            view.justify = function(value) { tag.style.justifyContent = value; return value != undefined ? view : tag.style.justifyContent; };
            view.alignItems = function(value) { tag.style.alignItems = value; return value != undefined ? view : tag.style.alignItems; };
            view.alignContent = function(value) { tag.style.alignContent = value; return value != undefined ? view : tag.style.alignContent; };
            view.alignSelf = function(value) { tag.style.alignSelf = value; return value != undefined ? view : tag.style.alignSelf; };
            view.flow = function(value) { tag.style.flexFlow = value; return value != undefined ? view : tag.style.flexFlow; };
            view.direction = function(value) { tag.style.flexDirection = value; return value != undefined ? view : tag.style.flexDirection; };
            view.grow = function(value) { tag.style.flexGrow = value; return value != undefined ? view : tag.style.flexGrow; };
            view.shrink = function(value) { tag.style.flexShrink = value; return value != undefined ? view : tag.style.flexShrink; };
            view.fit = function(value) { tag.style.objectFit = value; return value != undefined ? view : tag.style.objectFit; };
            view.outline = function(value) { tag.style.outline = value; return value != undefined ? view : tag.style.outline; };
            view.position = function(value) { tag.style.position = value; return value != undefined ? view : tag.style.position; };
            view.image = function(value) { tag.style.backgroundImage = value; return value != undefined ? view : tag.style.backgroundImage; };
            view.clip = function(value) { tag.style.backgroundClip = value; return value != undefined ? view : tag.style.backgroundClip; };
            view.border = function(value) { tag.style.border = value; return value != undefined ? view : tag.style.border; };
            view.radius = function(a, b, c, d) { tag.style.borderRadius = engine.Pixel(a, b, c, d); return a != undefined ? view : tag.style.borderRadius; };
            view.borderTop = function(value) { tag.style.borderTop = engine.Pixel(value); return value != undefined ? view : tag.style.borderTop; };
            view.borderLeft = function(value) { tag.style.borderLeft = engine.Pixel(value); return value != undefined ? view : tag.style.borderLeft; };
            view.borderRight = function(value) { tag.style.borderRight = engine.Pixel(value); return value != undefined ? view : tag.style.borderRight; };
            view.borderBottom = function(value) { tag.style.borderBottom = engine.Pixel(value); return value != undefined ? view : tag.style.borderBottom; };
            view.visibility = function(value) { tag.style.visibility = value; return value != undefined ? view : tag.style.visibility; };
            view.resize = function(value) { tag.style.resize = value; return value != undefined ? view : tag.style.resize; };
            view.maxWidth = function(value) { tag.style.maxWidth = engine.Pixel(value); return value != undefined ? view : tag.style.maxWidth; };
            view.maxHeight = function(value) { tag.style.maxHeight = engine.Pixel(value); return value != undefined ? view : tag.style.maxHeight; };
            view.minWidth = function(value) { tag.style.minWidth = engine.Pixel(value); return value != undefined ? view : tag.style.minWidth; };
            view.minHeight = function(value) { tag.style.minHeight = engine.Pixel(value); return value != undefined ? view : tag.style.minHeight; };
            view.animation = function(value) { tag.style.animation = value; return value != undefined ? view : tag.style.animation; };
            view.delay = function(value) { tag.style.animationDelay = value; return value != undefined ? view : tag.style.animationDelay; };
            view.transform = function(value) { tag.style.transform = value; return value != undefined ? view : tag.style.transform; };
            view.space = function(value) { tag.style.whiteSpace = value; return value != undefined ? view : tag.style.whiteSpace; };
            view.select = function(value) { tag.style.userSelect = value; return value != undefined ? view : tag.style.userSelect; };
            view.shadow = function(value) { tag.style.textShadow = value; return value != undefined ? view : tag.style.textShadow; };
            view.elevation = function(value) { tag.style.boxShadow = value; return value != undefined ? view : tag.style.boxShadow; };
            view.wrap = function(value) { tag.style.wordWrap = value; tag.style.wordBreak = value; return value != undefined ? view : tag.style.wordWrap || tag.style.wordBreak; };
            view.font = function(key, value) { tag.style.font = key ? key : tag.style.font; if (value != undefined) tag.style.fontWeight = value; return key != undefined || value != undefined ? view : tag.style.font; };
            view.class = function(value) { tag.setAttribute("class", value); return value != undefined ? view : tag.getAttribute("class"); };
            view.type = function(value) { tag.setAttribute("type", value); return value != undefined ? view : tag.getAttribute("type"); };
            view.method = function(value) { tag.setAttribute("method", value); return value != undefined ? view : tag.getAttribute("method"); };
            view.action = function(value) { tag.setAttribute("action", value); return value != undefined ? view : tag.getAttribute("action"); };
            view.name = function(value) { tag.setAttribute("name", value); return value != undefined ? view : tag.getAttribute("name"); };
            view.url = function(value) { tag.setAttribute("href", value); return value != undefined ? view : tag.getAttribute("href"); };
            view.hint = function(value) { tag.setAttribute("placeholder", value); return value != undefined ? view : tag.getAttribute("placeholder"); };
            view.rows = function(value) { tag.setAttribute("rows", value); return value != undefined ? view : tag.getAttribute("rows"); };
            view.cols = function(value) { tag.setAttribute("cols", value); return value != undefined ? view : tag.getAttribute("cols"); };
            view.min = function(value) { tag.setAttribute("min", value); return value != undefined ? view : tag.getAttribute("min"); };
            view.max = function(value) { tag.setAttribute("max", value); return value != undefined ? view : tag.getAttribute("max"); };
            view.maxlength = function(value) { tag.setAttribute("maxlength", value); return value != undefined ? view : tag.getAttribute("maxlength"); };
            view.checked = function(bool) { bool ? tag.setAttribute("checked", "checked") : (bool != undefined ? tag.removeAttribute("checked") : null); return bool != undefined ? view : (tag.getAttribute("checked") ? true : false); };
            view.selected = function(bool) { bool ? tag.setAttribute("selected", "selected") : (bool != undefined ? tag.removeAttribute("selected") : null); return bool != undefined ? view : (tag.getAttribute("selected") ? true : false); };
            view.spell = function(value) { tag.setAttribute("spellcheck", value); return view; };
            view.complete = function(value) { tag.setAttribute("autocomplete", value); return view; };
            view.correct = function(value) { tag.setAttribute("autocorrect", value); return view; };
            view.full = function(value) { tag.setAttribute("allowfullscreen", value); return view; };
            view.editable = function(value) { tag.setAttribute("contenteditable", value); return view; };
            view.capitalize = function(value) { tag.setAttribute("autocapitalize", value); return view; };
            view.alternative = function(value) { tag.setAttribute("alt", value ? value : none); return view; };
            view.changed = function(value) { tag.onchange = value; return view; };
            view.clicked = function(value) { tag.onclick = value; return view; };
            view.error = function(value) { tag.onerror = value; return view; };
            view.scroll = function(value) { tag.onscroll = value; return view; };
            view.keydown = function(value) { tag.onkeydown = value; return view; };
            view.keyup = function(value) { tag.onkeyup = value; return view; };
            view.focus = function(value) { tag.onfocus = value; return view; };
            view.blur = function(value) { tag.onblur = value; return view; };
            view.paste = function(value) { tag.onpaste = value; return view; };
            view.cut = function(value) { tag.oncut = value; return view; };
            view.autoplay = function(value) { tag.autoplay = value; return view; };
            view.align = function(value) { engine.Align.gravity(tag, value); return view; };
            view.head = function() { document.head.appendChild(tag); return view; };
            view.body = function() { document.body.appendChild(tag); return view; };
            view.hide = function() { if (display != engine.Type.NONE) display = tag.style.display; tag.style.display = engine.Type.NONE; return view; };
            view.show = function() { tag.style.display = display || engine.Type.BLOCK; return view; };
            view.kill = function() { if (tag.parentNode) tag.parentNode.removeChild(tag); return view; };
            view.clear = function() { if (tag.value) tag.value = none; tag.innerHTML = none; return view; };
            view.into = function(value) { if (value) (value.get ? value.get().appendChild(tag) : value.appendChild(tag)); return view; };
            view.add = function(value) { if (value) tag.appendChild(value.get ? value.get() : value); else document.body.appendChild(tag); return view; };
            view.put = function(key, value) {
                if (value && tag.getAttribute(key)) tag.setAttribute(key, tag.getAttribute(key) + value); else if (tag.value != undefined) tag.value += key; else tag.innerHTML += key;
                return view;
            };
            view.replace = function(a, b, c) {
                if (c && tag.getAttribute(a)) tag.setAttribute(a, tag.getAttribute(a).replace(new RegExp(b, "g"), c));
                    else if (tag.value != undefined) tag.value = tag.value.replace(new RegExp(a, "g"), b); else tag.innerHTML = tag.innerHTML.replace(new RegExp(a, "g"), b);
                return view;
            };
            view.toggle = function(a, b, c) {
                if (c && tag.getAttribute(a)) tag.setAttribute(a, (tag.getAttribute(a).indexOf(b) >= 0 ? tag.getAttribute(a).replace(new RegExp(b, "g"), c) : tag.getAttribute(a).replace(new RegExp(c, "g"), b)));
                    else if (tag.value != undefined) tag.value = (tag.value.indexOf(a) >= 0 ? tag.value.replace(new RegExp(a, "g"), b) : tag.value.replace(new RegExp(b, "g"), a));
                        else tag.innerHTML = ((tag.innerHTML || none).indexOf(a) >= 0 ? tag.innerHTML.replace(new RegExp(a, "g"), b) : (tag.innerHTML || none).replace(new RegExp(b, "g"), a));
                return view;
            };
            view.hover = function(callback) {
                var style = tag.style.cssText; engine.On(tag, "mouseover touchstart").response(function() { if (callback) callback(view, tag); });
                engine.On(tag, "mouseout touchend").response(function() { engine.Wait(function() { tag.style.cssText += style; }, 60); }); return view;
            };
            view.include = function(callback) { if (callback) callback(view); return view; };
            view.children = function(index) { return index == undefined ? tag.childNodes : tag.childNodes[index]; };
            view.click = function() { if (tag.click) tag.click(); };
            view.parent = function() { return tag.parentElement; };
            view.child = function() { return tag.firstChild; };
            view.get = function() { return tag; };
            return view;
        };
        engine.Search = function(value) {
            return engine.View(engine.Selector(value));
        };
        engine.Selector = function(value) {
            return value && document.querySelector(value) ? document.querySelector(value) : false;
        };
        engine.All = function(value) {
            return value && document.querySelectorAll(value).length > 0 ? document.querySelectorAll(value) : false;
        };
        engine.Kill = function(value) {
            var selector = engine.Selector(value); if (selector) selector.parentNode.removeChild(selector); return selector;
        };
        engine.Clear = function(value) {
            var selector = engine.Selector(value); if (selector.value) selector.value = none; (value ? selector : document.body).innerHTML = none; return selector;
        };
        engine.Newline = function(value) {
            return value ? engine.View("br").into(value) : engine.View("br").add();
        };
        engine.List = function(order) {
            var view = engine.View(order ? "ol" : "ul").attribute("list-style-position", "inside").attribute("list-style-type", "decimal");
            if (order && order.from != undefined) view.attribute("start", order.from);
            if (order && order.type != undefined) view.type(order.type); return view;
        };
        engine.Item = function() {
            return engine.View("li").display("list-item");
        };
        engine.Frame = function() {
            return engine.View("iframe").position("relative").full("true");
        };
        engine.Section = function(tag) {
            return engine.View(tag || "section").position("relative").display("flex").flow("column");
        };
        engine.Navigation = function(tag) {
            return engine.View(tag || "nav").position("relative").display("flex").flow("column");
        };
        engine.Layout = function(tag) {
            return engine.View(tag || "div").position("relative").display("flex").flow("column");
        };
        engine.Panel = function(tag) {
            return engine.View(tag || "div").position("absolute").display("flex").flow("column");
        };
        engine.Main = function(tag) {
            return engine.View(tag || "main").position("relative").display("flex").flow("column");
        };
        engine.Inline = function(tag) {
            return engine.View(tag || "div").position("relative").display("flex").flow("row");
        };
        engine.Scroll = function(tag) {
            return engine.View(tag || "div").display("flex").overflowX("hidden").overflowY("scroll").flow("column");
        };
        engine.Vertical = function(tag) {
            return engine.View(tag || "div").display("block").overflowY("scroll");
        };
        engine.Horizontal = function(tag) {
            return engine.View(tag || "div").display("inline-block").overflowX("scroll");
        };
        engine.Table = function(tag) {
            return engine.View(tag || "div").display("table");
        };
        engine.Row = function(tag) {
            return engine.View(tag || "div").display("table-row");
        };
        engine.Cell = function(tag) {
            return engine.View(tag || "div").display("table-cell");
        };
        engine.Input = function(tag) {
            return engine.View(tag || "input").spell("false").outline("none");
        };
        engine.Edit = function(tag) {
            return engine.View(tag || "textarea").spell("false").outline("none").resize("none").tab(4);
        };
        engine.Button = function(tag) {
            return engine.View(tag || "button").type("button").cursor("pointer");
        };
        engine.Block = function(tag) {
            return engine.View(tag || "div");
        };
        engine.Range = function(min, max, step) {
            var tag = engine.View("input").type("range"), element = tag.get(); element.min = min; element.max = max; element.step = step; return tag;
        };
        engine.Option = function(value) {
            var tag = engine.View("select").border("none").outline("none");
            for (var index = 0; index < value.length; index++) {
                var option = engine.View("option").value(value[index].name || value[index].text).text(value[index].text || value[index].name).into(tag);
                if (value[index].selected) option.selected();
            }
            return tag;
        };
        engine.Mobile = function(value) {
            var value = (value ? value : 640), b = navigator.userAgent || navigator.vendor || window.opera;
            return window.orientation >- 1 || screen.width <= value ||
                (window.matchMedia && window.matchMedia("only screen and (max-width: " + value + "px)").matches) || 
                /Mobi/i.test(b) || !(/Windows NT|Macintosh|Mac OS X|Linux/i.test(b)) || 
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(b) || 
                /Opera Mini|Opera Mobile|Kindle|Windows Phone|PSP/i.test(b) || 
                /AvantGo|Atomic Web Browser|Blazer|Chrome Mobile/i.test(b) || 
                /Dolphin|Dolfin|Doris|GO Browser|Jasmine|MicroB/i.test(b) || 
                /Mobile Firefox|Mobile Safari|Mobile Silk|Motorola Internet Browser/i.test(b) || 
                /NetFront|NineSky|Nokia Web Browser|Obigo|Openwave Mobile Browser/i.test(b) || 
                /Palm Pre web browser|Polaris|PS Vita browser|Puffin|QQbrowser/i.test(b) || 
                /SEMC Browser|Skyfire|Tear|TeaShark|UC Browser|uZard Web/i.test(b) || 
                /wOSBrowser|Yandex.Browser mobile/i.test(b);
        };
        engine.Color = {
            TRANSPARENT: "transparent",
            WHITE: "#FFFFFF",
            BLACK: "#000000",
            DARK: "#222222",
            GRAY: "#808080",
            IRON: "#484848",
            CLOUD: "#C8C8C8",
            SILVER: "#AAAAAA",
            SHADOW: "#363636",
            DARKER: "#111111",
            value: function(value) {
                return parseInt(value, 10) == value ? engine.Type.HASHTAG + new Array((6 - value.toString(16).length) + 1).join(0x00) + value.toString(16) : value;
            },
            rgb: function(red, green, blue) {
                return engine.Type.HASHTAG + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1, 7);
            }
        };
        engine.Align = {
            TOP: "top",
            LEFT: "left",
            RIGHT: "right",
            BOTTOM: "bottom",
            CENTER: "center",
            MIDDLE: "middle",
            gravity: function(tag, value) {
                var direction = value == "middle" ? "center" : value; if (value == "middle") tag.style.margin = "auto";
                var align = direction == "left" || direction == "top" ? "flex-start" : (direction == "right" || direction == "bottom" ? "flex-end" : (direction == "center" ? direction : null));
                if (align) tag.style.alignSelf = align; if (align) tag.style.alignItems = align; tag.style.textAlign = direction; return align;
            }
        };
        engine.Type = {
            AUTO: "auto",
            NONE: "none",
            BOLD: "bold",
            BLOCK: "block",
            BOTTON: "botton",
            POINTER: "pointer",
            BREAKxWORD: "break-word",
            NEWxPASSWORD: "new-password",
            PASSWORD: "password",
            CONTAIN: "contain",
            NOWRAP: "nowrap",
            WRAP: "wrap",
            NORMAL: "normal",
            HIDDEN: "hidden",
            SCROLL: "scroll",
            COVER: "cover",
            COLUMN: "column",
            ROW: "row",
            ROUND: "50%",
            HALF: "50%",
            FILL: "100%",
            TEXT: "text",
            PRE: "pre",
            OFF: "off",
            ON: "on",
            NULL: null,
            UNKOWN: undefined,
            OR: engine.Value(0x7C),
            AND: engine.Value(0x26),
            DOT: engine.Value(0x2E),
            DASH: engine.Value(0x2D),
            HASHTAG: engine.Value(0x23),
            QUERY: engine.Value(0x3F),
            LOWER: engine.Value(0x3C),
            HIGHER: engine.Value(0x3E),
            SPACE: engine.Value(0x20),
            BACKSLASH: engine.Value(0x2F),
            EMPTY: new String().toString()
        };
        engine.Open = window.open;
        engine.Debug = {
            log: console.log,
            error: console.error
        };
        String.prototype.lower = function() {
            return this ? this.toLowerCase() : this;
        };
        String.prototype.upper = function() {
            return this ? this.toUpperCase() : this;
        };
        String.prototype.cap = function() {
            return this.replace(/^(.)|\s+(.)/g, value => value.toUpperCase());
        };
        Array.prototype.remove = function(value) {
            for (var key in this) if (this.hasOwnProperty(key)) if (this[key] == value) this.splice(key, 1); return this;
        };
        Array.prototype.shuffle = function() {
            var array = [].concat(this);
            var index = array.length, value, random;
            while (0 !== index) {
                random = Math.floor(Math.random() * index); index -= 1; value = array[index];
                array[index] = array[random]; array[random] = value;
            }
            return array;
        };
        Object.prototype.each = function(callback) {
            this.loop(function(key, value) { if (callback) callback(key, value); }); return this;
        };
        Object.prototype.size = function() {
            var size = 0; for (var key in this) if (this.hasOwnProperty(key)) size++; return size;
        };
        Object.prototype.empty = function() {
            for (var key in this) if (this.hasOwnProperty(key)) return false; return true;
        };
        Object.prototype.equals = function(value) {
            return this == value ? true : false;
        };
        Object.prototype.contains = function(value) {
            return this.indexOf(value) >= 0 ? true : false;
        };
        Object.prototype.loop = function(callback) {
            var index = 0;
            for (value in this) {
                if (this.hasOwnProperty(value)) {
                    if (callback) callback(isNaN(value) ? value : parseInt(value), this[value], index, (this.length ? this.length : Object.keys(this).length));
                    index++;
                }
            }
            return this;
        };
        Object.prototype.fullscreen = function(value) {
            var element = this || document.documentElement;
            var lock = function(value) {
                var orientation = (screen.unlockOrientation || screen.mozLockOrientation || screen.msLockOrientation || (screen.orientation && screen.orientation.lock));
                if (orientation) orientation(value).then(function() { }).catch(function() { });
            };
            var unlock = function() {
                var orientation = (screen.lockOrientation || screen.mozUnLockOrientation || screen.msUnLockOrientation || (screen.orientation && screen.orientation.unlock));
                if (orientation) orientation().then(function() { }).catch(function() { });
            };
            if (element.requestFullscreen) {
                document.fullScreenElement ? document.cancelFullScreen() : element.requestFullscreen();
                document.fullScreenElement ? unlock() : lock(value); return element.RequestFullscreen;
            } else if (element.msRequestFullscreen) {
                document.msFullscreenElement ? document.msExitFullscreen() : element.msRequestFullscreen();
                document.msFullscreenElement ? unlock() : lock(value); return element.msRequestFullscreen;
            } else if (element.mozRequestFullScreen) {
                document.mozFullScreenElement ? document.mozCancelFullScreen() : element.mozRequestFullScreen();
                document.mozFullScreenElement ? unlock() : lock(value); return element.mozRequestFullScreen;
            } else if (element.webkitRequestFullscreen) {
                document.webkitFullscreenElement ? document.webkitCancelFullScreen() : element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                document.webkitFullscreenElement ? unlock() : lock(value); return element.webkitRequestFullscreen;
            }
            return false;
        };
        var extension = new Object();
        var none = new String().toString();
        var identity = 0;
        var character = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"\'_-,./:?".split(none);
        var matrix = [
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 1]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 1, 1, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]],
            [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
            [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 1, 1, 0, 0]],
            [[1, 0, 0, 1, 0], [1, 0, 1, 0, 0], [1, 1, 0, 0, 0], [1, 0, 1, 0, 0], [1, 0, 0, 1, 0], [1, 0, 0, 0, 1]],
            [[1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1]],
            [[1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
            [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]],
            [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0]],
            [[1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 1, 1, 1, 0]],
            [[1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [0, 1, 1, 0], [1, 0, 0, 1], [1, 0, 0, 1]],
            [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]],
            [[1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 1, 1, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]],
            [[1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1]],
            [[1, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
            [[1, 1, 1, 1], [0, 0, 0, 1], [0, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 1]],
            [[1, 1, 1, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 1, 1, 1], [0, 0, 0, 1], [1, 1, 1, 1]],
            [[1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 1, 0], [1, 1, 1, 1], [0, 0, 1, 0], [0, 0, 1, 0]],
            [[1, 1, 1, 1], [1, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 1], [0, 0, 0, 1], [1, 1, 1, 1]],
            [[1, 1, 1, 1], [1, 0, 0, 0], [1, 0, 0, 0], [1, 1, 1, 1], [1, 0, 0, 1], [1, 1, 1, 1]],
            [[1, 1, 1, 1, 0], [0, 0, 0, 1, 0], [0, 0, 0, 1, 0], [0, 1, 1, 1, 1], [0, 0, 0, 1, 0], [0, 0, 0, 1, 0]],
            [[1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1], [1, 0, 0, 1], [1, 1, 1, 1]],
            [[1, 1, 1, 1], [1, 0, 0, 1], [1, 0, 0, 1], [1, 1, 1, 1], [0, 0, 0, 1], [1, 1, 1, 1]],
            [[1], [1], [1], [1], [0], [1]],
            [[1], [1], [1], [0], [0], [0]],
            [[1], [1], [1], [0], [0], [0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]],
            [[0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 1, 1], [0, 0, 0], [0, 0, 0]],
            [[0, 0], [0, 0], [0, 0], [0, 0], [0, 1], [1, 0]],
            [[0], [0], [0], [0], [0], [1]],
            [[0, 0, 0, 0, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 0, 0, 0, 0]],
            [[0], [1], [0], [0], [1], [0]],
            [[1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0]]
        ];
        engine.App = {
            open: function() {
                var data = engine.Parse.json(document.querySelector("script[type=\"application/json\"]").textContent), app = this, version = data.version || "1.0", type = data.type || "js";
                if (data.name) this.NAME = data.name; this.VERSION = version; this.DEBUG = data.debug || false;
                if (data.description) this.DESCRIPTION = data.description; if (data.author) this.AUTHOR = data.author;
                if (data.preload && data.preload.length) engine.Preload(engine.Resource(engine.Path([version, type]), type).files(data.preload)).script(function(total, count) {
                    if (total == count) app.launch(version, type, data.launch); }); else app.launch(version, type, data.launch);
            },
            launch: function(version, type, name) {
                var app = this; engine.Preload(engine.Resource(engine.Path([version, type]), type).files([name])).script(function(total, count) {
                    if (total == count) { if (app.source[app.get()]) app.source[app.get()] (); else if (app.source[name]) app.source[name] (); app.navigation(); }
                });
            },
            navigation: function() {
                var app = this; window.onhashchange = function() { if (app.ok && app.source[app.get()]) app.source[app.get()] (); app.ok = true; };
            },
            title: function(link, title) {
                if (link) window.location.hash = engine.Value(0x23) + engine.Value(0x21) + link; if (link) this.link = link; if (title) document.title = title;
            },
            get: function() {
                return window.location.hash.replace(/^(\#\!*)+/g, none);
            },
            back: function() {
                engine.Wait(function() { engine.Back(); }, 0);
            },
            source: new Object(),
            value: new Object(),
            view: new Object()
        };
        engine.Engine = {
            VERSION: "2.0",
            NAME: "Hyperbox Engine",
            AUTHOR: "Heri Kaniugu",
            DESCRIPTION: "(c) 2021 Hyperbox Engine for Web Development.",
            ICON: "000000 0 0:0 24:0 24:24 0:24/ffffff 1 4:4 4:16 8:16 8:8 12:8 12:4/ffffff 1 20:20 20:8 16:8 16:16 12:16 12:20"
        };
        return engine;
    }
    var engine = Engine(); for (var key in engine) if (engine.hasOwnProperty(key)) window[key] = engine[key];
    window.onorientationchange = window.onresize = function() { if (window.Device.changed) window.Device.changed(); };
    window.onload = function() { window.Script().create(); window.App.open(); };
}) (window);