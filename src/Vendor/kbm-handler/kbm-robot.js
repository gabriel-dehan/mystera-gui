'use strict';
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
var ElectronRemote = require('electron').remote;
const Promise = require('promise');

let nativeHook;
let logger;
function kbmRobot() {

    let DEBUG = false;
    let clickListener = null;
    let keyboardListener = null;

    let easyKeys = {
        "ESC": "VK_ESCAPE",
        "F1": "VK_F1",
        "F2": "VK_F2",
        "F3": "VK_F3",
        "F4": "VK_F4",
        "F5": "VK_F5",
        "F6": "VK_F6",
        "F7": "VK_F7",
        "F8": "VK_F8",
        "F9": "VK_F9",
        "F10": "VK_F10",
        "F11": "VK_F11",
        "F12": "VK_F12",
        "PRINT_SCREEN": "VK_PRINTSCREEN",
        "SCROLL_LOCK": "VK_SCROLL_LOCK",
        "PAUSE_BREAK": "VK_PAUSE",
        "`": "VK_BACK_QUOTE",
        "-": "VK_MINUS",
        "=": "VK_EQUALS",
        "BACKSPACE": "VK_BACK_SPACE",
        "INSERT": "VK_INSERT",
        "HOME": "VK_HOME",
        "PAGE_UP": "VK_PAGE_UP",
        "NUM_LOCK": "VK_NUM_LOCK",
        "KP_/": "VK_DIVIDE",
        "KP_*": "VK_MULTIPLY",
        "KP_-": "VK_SUBTRACT",
        "TAB": "VK_TAB",
        "[": "VK_OPEN_BRACKET",
        "]": "VK_CLOSE_BRACKET",
        "\\": "VK_BACK_SLASH",
        "DELETE": "VK_DELETE",
        "END": "VK_END",
        "PAGE_DOWN": "VK_PAGE_DOWN",
        "KP_7": "VK_NUMPAD7",
        "KP_8": "VK_NUMPAD8",
        "KP_9": "VK_NUMPAD9",
        "KP_ADD": "VK_ADD",
        "CAPS_LOCK": "VK_CAPS_LOCK",
        ";": "VK_SEMICOLON",
        "'": "VK_QUOTE",
        "ENTER": "VK_ENTER",
        "\n": "VK_ENTER",
        "KP_4": "VK_NUMPAD4",
        "KP_5": "VK_NUMPAD5",
        "KP_6": "VK_NUMPAD6",
        "SHIFT": "VK_SHIFT",
        ",": "VK_COMMA",
        ".": "VK_PERIOD",
        "/": "VK_SLASH",
        "UP": "VK_UP",
        "KP_1": "VK_NUMPAD1",
        "KP_2": "VK_NUMPAD2",
        "KP_3": "VK_NUMPAD3",
        "CTRL": "VK_CONTROL",
        "META": "VK_META",
        // TODO: need to have the jar convert VK_META to VK_WINDOWS.
        // Did meta never work on windows?
        "SUPER": "VK_META",
        "ALT": "VK_ALT",
        " ": "VK_SPACE",
        "SPACE": "VK_SPACE",
        "LEFT": "VK_LEFT",
        "DOWN": "VK_DOWN",
        "RIGHT": "VK_RIGHT",
        "KP_0": "VK_NUMPAD0",
        "KP_.": "VK_DECIMAL"
    };

    let shiftables = {
        "~": "`",
        "!": "1",
        "@": "2",
        "#": "3",
        "$": "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        "_": "-",
        "+": "=",
        "{": "[",
        "}": "]",
        "|": "\\",
        ":": ";",
        "\"": "'",
        "<": ",",
        ">": ".",
        "?": "/",
    };

    for (let x = 65; x < 91; ++x) {
        let letter = String.fromCharCode(x);
        easyKeys[letter] = "VK_" + letter;
    }

    for (let x = 48; x < 58; ++x) {
        let number = String.fromCharCode(x);
        easyKeys[number] = "VK_" + number;
    }

    let randomDelay = function(mn, mx) {
        const min = Math.ceil(mn || 11);
        const max = Math.floor(mx || 67);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    let actionArr = [];

    let press = function(key) {
        let realKey = easyKeys[key.toUpperCase()] || key;
        nativeHook.stdin.write("D " + realKey + "\n");
        return Promise.resolve();
    };

    let release = function(key) {
        let realKey = easyKeys[key.toUpperCase()] || key;
        nativeHook.stdin.write("U " + realKey + "\n");
        return Promise.resolve();
    };

    let typeString = function(str, downDelay, upDelay) {
        let chars = str.split("");
        return new Promise(function(res) {
            let p = Promise.resolve();
            chars.forEach(function(character) {
                p = p.then(function() {
                    return type(character, downDelay);
                })
                .then(function() {
                    return sleep(upDelay);
                });
            });
            p.then(res);
        });
    };

    let type = function(key, delay) {
        return new Promise(function(res) {
            let shiftableKey = shiftables[key];
            if (shiftableKey) {
                key = shiftableKey;
            }
            if (key.toLowerCase() !== key || shiftableKey) {
                press("shift")
                .then(function() {
                    return sleep(delay);
                })
                .then(function() {
                    return press(key);
                })
                .then(function() {
                    return sleep(delay);
                })
                .then(function() {
                    return release(key);
                })
                .then(function() {
                    return sleep(delay);
                })
                .then(function() {
                    return release("shift");
                })
                .then(res);
            } else {
                press(key)
                .then(function() {
                    return sleep(delay);
                })
                .then(function() {
                    return release(key);
                })
                .then(res);
            }
        });
    };

    let sleep = function(amt) {
        return new Promise(function(res) {
            setTimeout(res, amt);
        });
    };

    let mouseMove = function(x, y) {
        nativeHook.stdin.write("MM " + x + " " + y + "\n");
        return Promise.resolve();
    };

    let mousePress = function(buttons) {
        nativeHook.stdin.write("MD " + buttons + "\n");
        return Promise.resolve();
    };

    let mouseRelease = function(buttons) {
        nativeHook.stdin.write("MU " + buttons + "\n");
        return Promise.resolve();
    };

    let mouseClick = function(buttons, delay) {
        return new Promise(function(res) {
            mousePress(buttons)
            .then(function() {
                return sleep(delay);
            })
            .then(function() {
                return mouseRelease(buttons);
            })
            .then(res);
        });
    };

    let mouseWheel = function(amt) {
        nativeHook.stdin.write("MW " + amt + "\n");
        return Promise.resolve();
    };

    const notStartedErr = "ERR: kbm-robot not started. ( Call .startJar() ).";

    let pub = {
        startJar: function(basePath) {
            var jarPath = null;
            
            if (ElectronRemote && ElectronRemote.app && ElectronRemote.app.getAppPath) {
                jarPath = path.join(ElectronRemote.app.getAppPath(), "src", "vendor", "kbm-robot", "resources", "robot.jar");
            } else {
                jarPath = path.join(basePath, "src", "vendor", "kbm-robot", "resources", "robot.jar");
            }
            // const jarPath = path.join("./resources/kbm-java", "robot.jar");
            if (!nativeHook) {
                if (!fs.existsSync(jarPath)) {
                    throw new Error("ERR: Can't find robot.jar. Expected Path: " + jarPath);
                }
                nativeHook = spawn("java", ["-jar", jarPath]);

                nativeHook.on('error', function(err) {
                    if (DEBUG) {
                        if (logger) {
                            logger.warn('error: ' + err);
                        } else {
                            console.log('error: ' + err);
                        }
                    }
                });

                // Need to hook up these handlers to prevent the
                // jar from crashing sometimes.
                nativeHook.stdout.on('data', function(data) {
                    // We use stdout to retrieve mouse clicks
                    const parsedData = `${data}`;
                    const matchMouseClick = parsedData.match(/^MOUSE_CLICK_EVENT\s(\d+,\d+)/)
                    if (clickListener && matchMouseClick) {
                        const coordinates = matchMouseClick[1].split(',');
                        clickListener({ x: coordinates[0], y: coordinates[1] });
                    }

                    const matchKeyboardEvent = parsedData.match(/^KEYBOARD_EVENT\s(.+)/)
                    if (keyboardListener && matchKeyboardEvent) {
                        const keyPresses = matchKeyboardEvent[1];
                        keyboardListener(keyPresses);
                    }
                });

                nativeHook.stderr.on('data', function(data) {
                    if (DEBUG) {
                        if (logger) {
                            logger.debug('stderr: ' + data);
                        } else {
                            console.log('stderr: ' + data);
                        }
                    }
                });

                nativeHook.on('close', function(data) {
                    if (DEBUG) {
                        if (logger) {
                            logger.debug('child process exited with code: ' + data);
                        } else {
                            console.log('child process exited with code: ' + data);
                        }
                    }
                });
            } else {
                throw new Error("ERR: A kbm-robot jar has already started.");
            }
        },
        stopJar: function() {
            if (nativeHook) {
                nativeHook.kill("SIGINT");
                nativeHook = null;
            } else {
                throw new Error("ERR: A kbm-robot jar is not started");
            }
        },
        registerClickListener: function(func) {
            clickListener = func;
        },
        unregisterClickListener: function() {
            clickListener = null;
        },
        registerKeyboardListener: function(func) {
            keyboardListener = func;
        },
        unregisterKeyboardListener: function() {
            keyboardListener = null;
        },
        press: function(key) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            actionArr.push({func: press, args: [key]});
            return pub;
        },
        release: function(key) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            actionArr.push({func: release, args: [key]});
            return pub;
        },
        typeString: function(str, downDelay, upDelay) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            downDelay = downDelay || 0;
            upDelay = upDelay || 0;
            actionArr.push({func: typeString, args: [str, downDelay, upDelay]});
            return pub;
        },
        typeStringWithDelay: function(str) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            const downDelay = randomDelay(2, 27);
            const upDelay = randomDelay(1, 23);
            actionArr.push({func: typeString, args: [str, downDelay, upDelay]});
            return pub;
        },
        type: function(key, delay) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            delay = delay || 0;
            actionArr.push({func: type, args: [key, delay]});
            return pub;
        },
        sleep: function(amt) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            actionArr.push({func: sleep, args: [amt]});
            return pub;
        },
        delay: function(amt) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            actionArr.push({func: sleep, args: [randomDelay()]});
            return pub;
        },
        mouseMove: function(x, y) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            actionArr.push({func: mouseMove, args: [x, y]});
            return pub;
        },
        mousePress: function(buttons) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            buttons += "";
            actionArr.push({func: mousePress, args: [buttons]});
            return pub;
        },
        mouseRelease: function(buttons) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            buttons += "";
            actionArr.push({func: mouseRelease, args: [buttons]});
            return pub;
        },
        mouseClick: function(buttons, delay) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            delay = delay || 0;
            buttons += "";
            actionArr.push({func: mouseClick, args: [buttons, delay]});
            return pub;
        },
        mouseWheel: function(amount) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            actionArr.push({func: mouseWheel, args: [amount]});
            return pub;
        },
        go: function(cb) {
            if (!nativeHook) {
                throw new Error(notStartedErr);
            }
            // Add in small delay to end of chain so
            // that the jar has enough time to execute
            // the final command before it is (probably) killed.
            // May need to refactor this later for an "all done" command
            // sent to the jar which in turn waits for the jar to
            // send a message back so we can kill it after it's truly done.
            pub.sleep(200);

            let p = Promise.resolve();
            actionArr.forEach(function(action) {
                p = p.then(function() {
                    return action.func.apply(action.func, action.args);
                });
            });
            actionArr = [];
            if (cb) {
                p.then(cb);
            } else {
                return p;
            }
        },
        setDebug: function(value) {
            this.DEBUG = value;
            return pub;
        },
        setLogger: function(logInstance) {
            this.logger = logInstance;
            return pub;
        }
    };

    return pub;
}

module.exports = kbmRobot();
