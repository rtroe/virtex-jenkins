/**
 * Canon for Jenkins Javascript Overrides
 *
 * Leverages Jenkins-included Prototype.js
 *
 * @author Rackspace Web Team
 */
document.observe("dom:loaded", function () {
    // Auto Refresh
    var autoRefreshSelector = $$('#right-top-nav #right-top-nav div.smallfont');
    if (autoRefreshSelector.length > 0) {
        var autoRefreshLink = new Element('span').update(autoRefreshSelector[0].innerHTML);
        $$('span.jenkins_ver')[0].insert({before:autoRefreshLink});
    }
    // Click logo, go home.
    $$('div.logo')[0].on('click', function(){ location = '/'; });
});

// From: https://github.com/jakubjosef/jenkins-ansi-color-js
function DOMReady(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function addScript(src, callback, async) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    s.onload = callback;
    if (async) s.async = true;
    document.body.appendChild(s);
}

DOMReady(function() {
    var consoleOutputSelector = ".console-output";
    if (document.querySelector(consoleOutputSelector)) {
        // init ansi colors
        addScript("https://cdn.jsdelivr.net/npm/ansi_up@2.0.2/ansi_up.js", function() {
            var ansiUp = new AnsiUp(),
                $console = document.querySelector(consoleOutputSelector),
                entities = {
                    'amp': '&',
                    'apos': '\'',
                    '#x27': '\'',
                    '#x2F': '/',
                    '#39': '\'',
                    '#47': '/',
                    'lt': '<',
                    'gt': '>',
                    'nbsp': ' ',
                    'quot': '"'
                },
                decodeHTMLEntities = function(text) {
                    return text.replace(/&([^;]+);/gm, function(match, entity) {
                        return entities[entity] || match;
                    });
                },
                colorizeFn = function() {
                    $console.innerHTML = decodeHTMLEntities(ansiUp.ansi_to_html($console.innerHTML));
                };

            colorizeFn();
            // create prototype.js global ajax handle responder
            Ajax.Responders.register({
                onComplete: function(req, res) {
                    if (req.body.indexOf("start=") != -1 && res.status==200 && res.responseText !== "") {
                        colorizeFn();
                    }
                }
            });
        }, true);
    }
});

// End jenkins-ansi-color-js
