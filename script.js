// ===== Bella's Portfolio - script.js =====
// This one file powers the footer year, the Planner page and the Contact form.
// Each part only runs if its page has the matching element.

// 1. Footer year
var yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();

// 2. Planner (add, complete, delete tasks)
var box = document.getElementById("cols");
if (box) {
  var tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("bella-tasks") || "[]"); } catch (e) { tasks = []; }

  var save = function () { try { localStorage.setItem("bella-tasks", JSON.stringify(tasks)); } catch (e) {} };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var draw = function () {
    box.innerHTML = "";
    ["Study", "Project", "Personal"].forEach(function (cat) {
      var col = document.createElement("div");
      col.className = "col";
      col.innerHTML = "<h3>" + cat + "</h3>";
      var count = 0;
      tasks.forEach(function (t, i) {
        if (t.c !== cat) return;
        count++;
        var el = document.createElement("div");
        el.className = "task" + (t.done ? " done" : "");
        el.innerHTML = "<div><b style='font-weight:400'>" + esc(t.t) + "</b>" + (t.d ? "<small>Due " + esc(t.d) + "</small>" : "") +
          "</div><div><button data-a='toggle' data-i='" + i + "'>" + (t.done ? "Undo" : "Done") + "</button><button data-a='del' data-i='" + i + "'>Delete</button></div>";
        col.appendChild(el);
      });
      if (!count) col.innerHTML += "<p class='empty'>No tasks yet.</p>";
      box.appendChild(col);
    });
  };

  box.addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;
    var i = Number(b.dataset.i);
    if (b.dataset.a === "toggle") tasks[i].done = !tasks[i].done;
    else tasks.splice(i, 1);
    save(); draw();
  });

  var input = document.getElementById("t");
  var addTask = function () {
    var msg = document.getElementById("tmsg");
    if (!input.value.trim()) { msg.textContent = "Please type a task first."; return; }
    msg.textContent = "";
    tasks.push({ t: input.value.trim(), d: document.getElementById("d").value, c: document.getElementById("c").value, done: false });
    input.value = ""; save(); draw();
  };
  document.getElementById("go").addEventListener("click", addTask);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") addTask(); });
  draw();
}

// 3. Contact form validation
var send = document.getElementById("send");
if (send) {
  var EMAIL = "bellaberry499@gmail.com";
  var field = function (id) { return document.getElementById(id).value.trim(); };
  var setErr = function (id, errId, msg) {
    document.getElementById(errId).textContent = msg;
    document.getElementById(id).classList.toggle("bad", !!msg);
    return !msg;
  };
  var validate = function () {
    var n = field("n"), e = field("e"), p = field("p"), m = field("m");
    var a = setErr("n", "en", n.length < 2 ? "Please enter your full name." : /^[A-Za-z\u00C0-\u024F' .-]+$/.test(n) ? "" : "Name should contain letters only.");
    var b = setErr("e", "ee", !e ? "Please enter your email." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? "" : "Please enter a valid email address.");
    var c = setErr("p", "ep", p && !/^\+?[0-9\s-]{7,15}$/.test(p) ? "Enter a valid phone number (7-15 digits)." : "");
    var d = setErr("m", "em", m.length < 10 ? "Message must be at least 10 characters." : "");
    return a && b && c && d;
  };
  send.addEventListener("click", function () {
    var ok = document.getElementById("ok");
    ok.textContent = "";
    if (!validate()) return;
    var n = field("n");
    ok.textContent = "Thank you, " + n.split(" ")[0] + ". Your email app is opening so you can send this message.";
    location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Message from " + n) +
      "&body=" + encodeURIComponent(field("m") + "\n\n" + n + " (" + field("e") + ")");
  });
}
