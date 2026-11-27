/* ====== EDIT YOUR DETAILS HERE ====== */
var CONFIG = {
  phone: "91XXXXXXXXXX",           // WhatsApp number with country code, no plus sign. Example: 919876543210
  phoneDisplay: "+91 XXXXX XXXXX"  // How the number looks on the page
};

(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function waLink(msg) { return "https://wa.me/" + CONFIG.phone + "?text=" + encodeURIComponent(msg); }

  $("yr").textContent = new Date().getFullYear();
  $("phoneShow").textContent = CONFIG.phoneDisplay;
  $("fab").href = waLink("Hello Nine Automation, I would like to talk about automating a task.");
  $("fab").target = "_blank";
  $("fab").rel = "noopener";

  /* ---------- savings calculator ---------- */
  function num(id) {
    var v = parseFloat($(id).value);
    return isFinite(v) && v > 0 ? v : 0;
  }
  function calc() {
    var pct = Math.min(num("cPct"), 100) / 100;
    var hours = num("cLr") * num("cMin") * 26 / 60 * pct;
    $("rHours").textContent = Math.round(hours).toLocaleString("en-IN");
    $("rMoney").textContent = "\u20B9" + Math.round(hours * num("cCost")).toLocaleString("en-IN");
  }
  ["cLr", "cMin", "cCost", "cPct"].forEach(function (id) {
    $(id).addEventListener("input", calc);
  });
  calc();

  /* ---------- free trial booking ---------- */
  var dateEl = $("fDate");
  var today = new Date();
  var iso = today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");
  dateEl.min = iso;

  function niceDate(v) {
    if (!v) return "any day";
    var p = v.split("-");
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }

  $("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("fName").value.trim();
    var co = $("fCo").value.trim();
    var phone = $("fPhone").value.trim();
    var task = $("fTask").value.trim();
    var err = $("formError");

    if (!name || !task) {
      err.textContent = "Please enter your name and the task you want to automate.";
      err.hidden = false;
      return;
    }
    err.hidden = true;

    var msg = "Hello Nine Automation, I want to book a free trial.\n" +
      "Name: " + name + "\n" +
      (co ? "Company: " + co + "\n" : "") +
      (phone ? "My number: " + phone + "\n" : "") +
      "Task to automate: " + task + "\n" +
      "Preferred time: " + niceDate(dateEl.value) + ", " + $("fSlot").value;

    var link = waLink(msg);
    $("afterLink").href = link;
    $("after").hidden = false;
    window.open(link, "_blank", "noopener");
  });
})();
