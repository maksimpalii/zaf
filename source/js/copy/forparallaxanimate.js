!function (t) {
    if (!t.AnimateCommons) {
        var e = t.AnimateCommons = function (t) {
            this.context = t
        };
        e.prototype = {
            getCanvasId: function () {
                return this.getCanvas().id
            }, getParent: function () {
                return this.context.parent ? n(this.context.parent) : null
            }, getAllParents: function () {
                for (var t = this.context.parent, e = []; t;)e.push(t), t = t.parent;
                return e
            }, getStage: function () {
                for (var t = this, e = this.getParent(); e;)t = e, e = e.getParent();
                return t
            }, getCanvas: function () {
                return this.getStage().context.canvas
            }, getComposition: function () {
                return n.getComposition(this.context)
            }, getId: function () {
                var t = this.context.parent;
                for (var e in t)if (t.hasOwnProperty(e) && t[e] === this.context)return e
            }, getSymbolDefinitionName: function (e) {
                var e = e || t.lib_race, n = void 0;
                if (e)for (var i in e)if (e.hasOwnProperty(i)) {
                    var o = e[i];
                    "function" == typeof o && this.context instanceof o && (n = i)
                }
                return n
            }, getGlobalScaleFactor: function () {
                for (var t = this.getAllParents(), e = this.context.scaleX, n = this.context.scaleY, i = 0; i < t.length - 1; i++)e *= t[i].scaleX, n *= t[i].scaleY;
                return {scaleX: e, scaleY: n}
            }
        };
        var n = t.AC = function (t) {
            return new e(t)
        };
        n._compositions = {}, n.getComposition = function (t) {
            var e = n(t), i = e.getStage(), o = n._compositions[i.getCanvasId()];
            return o || (o = n._compositions[i.getCanvasId()] = new n.Composition({id: e.getCanvasId(), canvas: i.getCanvas(), stage: i})), o
        }, n.isMobile = function () {
            return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/Opera Mini/i) || navigator.userAgent.match(/IEMobile/i) || !1
        }, n.getDevicePixelRatio = function () {
            var e = 1;
            return void 0 !== t.screen.systemXDPI && void 0 !== t.screen.logicalXDPI && t.screen.systemXDPI > t.screen.logicalXDPI ? e = t.screen.systemXDPI / t.screen.logicalXDPI : void 0 !== t.devicePixelRatio && (e = t.devicePixelRatio), e = e >= 1 && e <= 10 ? e : 1
        }, n.applyDefaults = function (t, e) {
            !t && (t = {});
            for (var n in t)e[n] = t[n];
            return e
        }, n.destroy = function (t, e) {
            if (e = t.parent || e)for (var i = e.timeline, o = 0; o < i._tweens.length; o++) {
                var a = i._tweens[o];
                a.target == t && (i.removeTween(a), a.removeAllEventListeners(), a.removeAllTweens && a.removeAllTweens(), a.target = null, a = null), i[o] = null
            }
            for (var r = 0; r < t.children.length; r++) {
                var s = t.children[r];
                s.children && s.children.length && n.destroy(s, null), s.removeAllEventListeners(), s.removeAllChildren && s.removeAllChildren(), s.parent && s.parent.removeChild(s), s = null
            }
            if (e) {
                var l = n(t).getId();
                if (!l)for (var c in e)e.hasOwnProperty(c) && e[c] === t && (l = c);
                e.removeChild(t), e[l] = null
            }
        }, n.getSymbolDefinitions = function (e) {
            e = e ? e : t.lib_race;
            var n = {};
            for (var i in e)if (e.hasOwnProperty(i)) {
                var o = e[i];
                "function" == typeof o && o.prototype.nominalBounds && Object.getPrototypeOf(o) == Object.getPrototypeOf(createjs.MovieClip) && (n[i] = o)
            }
            return n
        }, n.throttle = function (t, e, n) {
            e || (e = 250);
            var i, o;
            return function () {
                var a = n || this, r = +new Date, s = arguments;
                i && r < i + e ? (clearTimeout(o), o = setTimeout(function () {
                    i = r, t.apply(a, s)
                }, e)) : (i = r, t.apply(a, s))
            }
        }
    }
}(window), function (t, e) {
    t.Composition = function (t) {
        this.id = t.id, this.canvas = t.canvas, this.stage = t.stage, this.isAutoScale = t.isAutoScale || !1, this.scaleFactor = t.scaleFactor || 1, this.devicePixelRatio = t.devicePixelRatio || 1, this.store = {}
    }, t.Composition.prototype = {
        set: function (t, e) {
            for (var n = t.split("."), i = this.store, o = 0; o < n.length; o++) {
                var a = n[o];
                o === n.length - 1 ? i[a] = e : i = i[a] = i[a] ? i[a] : {}
            }
        }, get: function (t) {
            for (var e = t.split("."), n = this.store, i = 0; i < e.length; i++) {
                var o = e[i];
                n = "object" == typeof n ? n[o] : n
            }
            return n
        }
    }
}(window.AC, window.AnimateCommons), function (t, e) {
    t.AdaptiveLayout = {
        setup: function (e, n) {
            function i() {
                var e = t.getSymbolDefinitions(n.lib_race);
                for (var i in e) {
                    var o = i.match(/^Layout(\d{0,4})x(\d{0,4})/);
                    if (e.hasOwnProperty(i) && o) {
                        var a = e[i], r = {minW: parseInt(o[1]), sym: a};
                        n.breakpoints.push(r)
                    }
                }
            }

            n = t.applyDefaults(n, {lib_race: window.lib_race, maxWidth: null, maxHeight: null, originX: 50, originY: 50, breakpoints: []});
            var o, a = t(t(e).getStage().context.children[0]), r = t.getDevicePixelRatio(), s = {compW: n.lib_race.properties.width, compH: n.lib_race.properties.height}, l = function () {
                var e = a.getCanvas().parentElement;
                "animation_container" == a.getCanvas().parentElement.id && (e = e.parentElement);
                var i = parseInt(window.getComputedStyle(e).width), l = parseInt(window.getComputedStyle(e).height);
                i / s.compW > l / s.compH ? l / s.compH : i / s.compW;
                canvas.style.width = i + "px", canvas.style.height = l + "px", canvas.setAttribute("width", i * r + "px"), canvas.setAttribute("height", l * r + "px");
                var c = 1;
                a.context.x = Math.round((0 - (s.compW * c - i)) * (n.originX / 100)), a.context.y = Math.round((0 - (s.compH * c - l)) * (n.originY / 100));
                var p = a.getStage(), d = new createjs.Event("sizeChange");
                d.width = i, d.height = l, p.context.dispatchEvent(d);
                for (var h = {minW: 0}, m = n.breakpoints, u = 0; u < m.length; u++) {
                    var f = m[u];
                    i >= f.minW && f.minW >= h.minW && (h = f)
                }
                if (h != o) {
                    o = h;
                    for (var v = [], u = 0; u < a.context.children.length; u++) {
                        var g = a.context.children[u];
                        g instanceof createjs.MovieClip && 0 == t(g).getSymbolDefinitionName(n.lib_race).indexOf("Layout") && v.push(g)
                    }
                    for (var u = 0; u < v.length; u++)"function" == typeof g.destroyLayout && g.destroyLayout(), a.context.removeChild(v[u]);
                    var x = a.context.addChild(new h.sym);
                    x.x = s.compW / 2 - h.minW / 2, setTimeout(function () {
                        "function" == typeof x.activevateLayout && x.activevateLayout()
                    }, 100)
                }
            };
            i(), window.addEventListener("resize", function (t) {
                l()
            }), l()
        }
    }
}(window.AC, window.AnimateCommons), function (t, e) {
    t.FlexibleLayout = {
        setup: function (e, n) {
            n = t.applyDefaults(n, {lib_race: window.lib_race, maxWidth: null, maxHeight: null, originX: 50, originY: 50});
            var i = t(t(e).getStage().context.children[0]), o = i.getCanvas(), a = t.getDevicePixelRatio(), r = {compW: n.lib_race.properties.width, compH: n.lib_race.properties.height}, s = function () {
                i.getCanvas().parentElement.style.width = "100%";
                var t = parseInt(window.getComputedStyle(i.getCanvas().parentElement.parentElement).width), e = parseInt(window.getComputedStyle(i.getCanvas().parentElement.parentElement).height), s = t / r.compW > e / r.compH ? e / r.compH : t / r.compW;
                o.style.width = t + "px", o.style.height = e + "px", o.setAttribute("width", t * a + "px"), o.setAttribute("height", e * a + "px");
                var l = Math.min(n.maxWidth && r.compW * s > n.maxWidth ? n.maxWidth / r.compW : s, n.maxHeight && r.compH * s > n.maxHeight ? n.maxHeight / r.compH : s);
                i.context.scaleX = i.context.scaleY = l, i.context.x = Math.round((0 - (r.compW * l - t)) * (n.originX / 100)), i.context.y = Math.round((0 - (r.compH * l - e)) * (n.originY / 100))
            };
            window.addEventListener("resize", function (t) {
                s()
            }), s()
        }
    }
}(window.AC, window.AnimateCommons), function (t, e) {
    t.Parallax = {
        setup: function (e, n) {
            var i = [];
            n = t.applyDefaults(n, {compWidth: lib_race.properties.width, throttle: 100, speed: 600}), setTimeout(function () {
                for (var n = 0; n < e.children.length; n++) {
                    var o = e.children[n], a = t(o).getId(), r = a.match(/^parallax(\d{0,4})/);
                    null != r && i.push({sym: o, initX: o.x, factor: r[1]})
                }
            }, 100);
            var o = t(e).getComposition();
            o.stage.context.on("stagemousemove", t.throttle(function (t) {
                for (var e = (t.stageX - n.compWidth) / 2, o = 0; o < i.length; o++) {
                    var a = i[o];
                    createjs.Tween.get(a.sym, {override: !0}).to({x: a.initX - e / a.factor}, n.speed, createjs.Ease.cubicOut)
                }
            }, n.throttle)), t.isMobile() && window.addEventListener("deviceorientation", t.throttle(function (t) {
                if (t.beta) {
                    var e = 1, o = t.beta.toFixed(e);
                    n.speed = 2e3;
                    for (var a = 20 * o, r = 0; r < i.length; r++) {
                        var s = i[r];
                        s.sym.x = s.initX + a / s.factor
                    }
                }
            }, 10))
        }
    }
}(window.AC, window.AnimateCommons), function (t, e) {
    t.Debug = {
        enableFpsMeter: function (e, n) {
            function i(t) {
                l.begin(), c.call(this, t), l.end()
            }

            var o = t(e), a = o.getComposition(), r = n || 1e3;
            if (!a.get("fpsStats")) {
                var s = function () {
                    function t(t, e, n) {
                        return t = document.createElement(t), t.id = e, t.style.cssText = n, t
                    }

                    function e(e, n, i) {
                        var o = t("div", e, "padding:0 0 3px 3px;text-align:left;background:" + i), a = t("div", e + "Text", "font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;color:" + n);
                        for (a.innerHTML = e.toUpperCase(), o.appendChild(a), e = t("div", e + "Graph", "width:74px;height:30px;background:" + n), o.appendChild(e), n = 0; 74 > n; n++)e.appendChild(t("span", "", "width:1px;height:30px;float:left;opacity:0.9;background:" + i));
                        return o
                    }

                    function n(t) {
                        for (var e = p.children, n = 0; n < e.length; n++)e[n].style.display = n === t ? "block" : "none";
                        c = t
                    }

                    function i(t, e) {
                        t.appendChild(t.firstChild).style.height = Math.min(30, 30 - 30 * e) + "px"
                    }

                    var o = self.performance && self.performance.now ? self.performance.now.bind(performance) : Date.now, a = o(), s = a, l = 0, c = 0, p = t("div", "stats", "width:80px;opacity:0.9;cursor:pointer");
                    p.addEventListener("mousedown", function (t) {
                        t.preventDefault(), n(++c % p.children.length)
                    }, !1);
                    var d = 0, h = 1 / 0, m = 0, u = e("fps", "#0ff", "#002"), f = u.children[0], v = u.children[1];
                    p.appendChild(u);
                    var g = 0, x = 1 / 0, w = 0, u = e("ms", "#0f0", "#020"), y = u.children[0], C = u.children[1];
                    if (p.appendChild(u), self.performance && self.performance.memory) {
                        var b = 0, A = 1 / 0, P = 0, u = e("mb", "#f08", "#201"), E = u.children[0], M = u.children[1];
                        p.appendChild(u)
                    }
                    return n(c), {
                        REVISION: 14, domElement: p, setMode: n, begin: function () {
                            a = o()
                        }, end: function () {
                            var t = o();
                            if (g = t - a, x = Math.min(x, g), w = Math.max(w, g), y.textContent = (0 | g) + " MS (" + (0 | x) + "-" + (0 | w) + ")", i(C, g / 200), l++, t > s + r && (d = Math.round(1e3 * l / (t - s)), h = Math.min(h, d), m = Math.max(m, d), f.textContent = d + " FPS (" + h + "-" + m + ")", i(v, d / 100), s = t, l = 0, void 0 !== b)) {
                                var e = performance.memory.usedJSHeapSize, n = performance.memory.jsHeapSizeLimit;
                                b = Math.round(9.54e-7 * e), A = Math.min(A, b), P = Math.max(P, b), E.textContent = b + " MB (" + A + "-" + P + ")", i(M, e / n)
                            }
                            return t
                        }, update: function () {
                            a = this.end()
                        }
                    }
                };
                "object" == typeof module && (module.exports = s);
                var l = new s;
                l.setMode(0), l.domElement.style.position = "absolute", l.domElement.style.left = "0px", l.domElement.style.top = "0px", document.body.appendChild(l.domElement);
                var c = a.stage.context.stage.handleEvent;
                a.stage.context.stage.handleEvent = i.bind(a.stage.context.stage), a.set("fpsStats", !0)
            }
        }
    }
}(window.AC, window.AnimateCommons);