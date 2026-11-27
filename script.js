(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function waLink(msg) { return "https://wa.me/" + CONFIG.phone + "?text=" + encodeURIComponent(msg); }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; }
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- basics ---------- */
  $("yr").textContent = new Date().getFullYear();
  $("phoneShow").textContent = CONFIG.phoneDisplay;
  var generalMsg = "Hello Nine Automation, I would like to talk about automating a task.";
  ["fab", "footWa"].forEach(function (id) {
    var a = $(id);
    a.href = waLink(generalMsg);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- mobile menu ---------- */
  var menuBtn = $("menuBtn"), nav = $("mainNav");
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- savings calculator ---------- */
  function num(id) {
    var v = parseFloat($(id).value);
    return isFinite(v) && v > 0 ? v : 0;
  }
  function calc() {
    var pct = Math.min(num("cPct"), 100) / 100;
    var hours = num("cLr") * num("cMin") * 26 / 60 * pct;
    $("rHours").textContent = Math.round(hours).toLocaleString("en-IN");
    $("rMoney").textContent = "₹" + Math.round(hours * num("cCost")).toLocaleString("en-IN");
  }
  ["cLr", "cMin", "cCost", "cPct"].forEach(function (id) { $(id).addEventListener("input", calc); });
  calc();

  /* ---------- demos ---------- */
  var demos = [
    {
      key: "portal", tab: "Portal downloads", title: "Web portal automation",
      desc: "The tool logs in to your portal, searches each record from your Excel list, downloads the document, checks remarks and writes the status back.",
      points: ["Works across several portals in one run", "Files are renamed by record ID", "Unclear cases are flagged for review"],
      manual: "3h 20m", nine: "12m", records: "100 records",
      window: "nine_runner / portal_download", cols: ["Reference", "Action", "Result"],
      rows: [
        ["REF-10481", "Search, download, rename", "Saved, no remark", "ok"],
        ["REF-10482", "Search, download, rename", "Saved, no remark", "ok"],
        ["REF-10483", "Search, download, rename", "Remark found, flagged", "warn"],
        ["REF-10484", "Search, download, rename", "Saved, no remark", "ok"],
        ["REF-10485", "Search, download, rename", "Saved, no remark", "ok"],
        ["REF-10486", "Search, download, rename", "Saved, no remark", "ok"],
        ["REF-10487", "Search, download, rename", "Saved, no remark", "ok"],
        ["REF-10488", "Write status to Excel", "Status sheet saved", "ok"]
      ]
    },
    {
      key: "sap", tab: "SAP printing", title: "SAP task automation",
      desc: "You open the SAP screen. The tool pastes each number from your Excel list, runs it and sends the print, exactly like your team does by hand.",
      points: ["No complex SAP scripting", "Runs on your own SAP screen", "Skipped items are logged with a reason"],
      manual: "3h", nine: "25m", records: "120 invoices",
      window: "nine_runner / sap_invoice_print", cols: ["Invoice", "Action", "Result"],
      rows: [
        ["INV-90211", "Paste, execute, print", "Sent to printer", "ok"],
        ["INV-90212", "Paste, execute, print", "Sent to printer", "ok"],
        ["INV-90213", "Paste, execute, print", "Sent to printer", "ok"],
        ["INV-90214", "Paste, execute, print", "Not found, skipped", "warn"],
        ["INV-90215", "Paste, execute, print", "Sent to printer", "ok"],
        ["INV-90216", "Paste, execute, print", "Sent to printer", "ok"],
        ["INV-90217", "Paste, execute, print", "Sent to printer", "ok"],
        ["INV-90218", "Save print log", "Log saved", "ok"]
      ]
    },
    {
      key: "excel", tab: "Excel reports", title: "Excel and MIS automation",
      desc: "Drop the raw files in a folder. The tool cleans, merges and summarizes them and builds your daily report with pivots and charts.",
      points: ["Merges data from many files", "Pivots, totals and charts built automatically", "Same report format every day"],
      manual: "1h 30m", nine: "4m", records: "6 files",
      window: "nine_runner / daily_mis_report", cols: ["File or step", "Action", "Result"],
      rows: [
        ["Sales_North.xlsx", "Clean and merge", "Rows merged", "ok"],
        ["Sales_South.xlsx", "Clean and merge", "Rows merged", "ok"],
        ["Stock_Report.xlsx", "Clean and merge", "Rows merged", "ok"],
        ["Dispatch_Log.xlsx", "Clean and merge", "Dates fixed", "warn"],
        ["Billing_Sheet.xlsx", "Clean and merge", "Rows merged", "ok"],
        ["All data", "Remove duplicates", "Duplicates removed", "ok"],
        ["Summary", "Pivots and totals", "Calculated", "ok"],
        ["Dashboard", "Refresh charts", "Report ready", "ok"]
      ]
    },
    {
      key: "entry", tab: "Data entry", title: "Data entry and files",
      desc: "The tool reads your Excel rows and fills the form or system for each one, then saves. Errors are logged so nothing is silently missed.",
      points: ["Validates each row before saving", "Error log with the reason for each failure", "Also renames and sorts PDFs and files"],
      manual: "2h 30m", nine: "8m", records: "150 rows",
      window: "nine_runner / bulk_entry", cols: ["Row", "Action", "Result"],
      rows: [
        ["Row 1", "Fill form and save", "Saved", "ok"],
        ["Row 2", "Fill form and save", "Saved", "ok"],
        ["Row 3", "Fill form and save", "Saved", "ok"],
        ["Row 4", "Fill form and save", "Invalid pincode, logged", "warn"],
        ["Row 5", "Fill form and save", "Saved", "ok"],
        ["Row 6", "Fill form and save", "Saved", "ok"],
        ["Row 7", "Fill form and save", "Saved", "ok"],
        ["Row 8", "Write error log", "Log saved", "ok"]
      ]
    }
  ];

  var tabsEl = $("demoTabs"), stage = $("demoStage"), info = $("demoInfo");
  var cur = 0, timers = [];

  function hasRealVideo(d) {
    return !!((CONFIG.videos && CONFIG.videos[d.key]) || (CONFIG.localVideos && CONFIG.localVideos[d.key]));
  }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function cls(kind) { return kind === "warn" ? "st-warn" : "st-ok"; }

  function buildMock(d) {
    var head = d.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("");
    stage.innerHTML =
      '<div class="win"><div class="win-bar"><i></i><i></i><i></i><span>' + esc(d.window) + '</span></div>' +
      '<div class="win-body"><table class="wt"><thead><tr>' + head + '</tr></thead><tbody id="wtBody"></tbody></table></div>' +
      '<div class="win-foot"><div class="pbar"><i id="pfill"></i></div><span id="pcount"></span></div></div>' +
      '<p class="sample-note">Sample walkthrough with dummy data.</p>';
    var body = $("wtBody");
    d.rows.forEach(function (r) {
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + '</td><td class="res"></td>';
      body.appendChild(tr);
    });
  }
  function setRow(tr, r, state) {
    var td = tr.lastChild;
    if (state === "wait") { td.className = "res st-wait"; td.textContent = "Waiting"; }
    else if (state === "run") { td.className = "res st-run"; td.textContent = "Working"; }
    else { td.className = "res " + cls(r[3]); td.textContent = r[2]; }
  }
  function setProgress(done, total, d) {
    $("pfill").style.width = Math.round(done / total * 100) + "%";
    if (done < total) { $("pcount").textContent = "Processed " + done + " of " + total; }
    else {
      var flagged = d.rows.filter(function (r) { return r[3] === "warn"; }).length;
      $("pcount").textContent = "Done, " + flagged + " flagged";
    }
  }
  function play(animate) {
    clearTimers();
    var d = demos[cur];
    if (hasRealVideo(d)) { return; }
    var trs = $("wtBody").children, total = d.rows.length;
    var doAnim = animate && !reduce;
    if (!doAnim) {
      d.rows.forEach(function (r, i) { setRow(trs[i], r, "done"); });
      setProgress(total, total, d);
      return;
    }
    d.rows.forEach(function (r, i) { setRow(trs[i], r, "wait"); });
    setProgress(0, total, d);
    d.rows.forEach(function (r, i) {
      timers.push(setTimeout(function () { setRow(trs[i], r, "run"); }, 300 + i * 900));
      timers.push(setTimeout(function () { setRow(trs[i], r, "done"); setProgress(i + 1, total, d); }, 300 + i * 900 + 550));
    });
  }

  function renderInfo(d, hasVideo) {
    info.innerHTML =
      "<h3>" + esc(d.title) + "</h3><p>" + esc(d.desc) + "</p>" +
      "<ul>" + d.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
      '<div class="cmp"><div><span>By hand (' + esc(d.records) + ')</span><b>' + esc(d.manual) + '</b></div>' +
      '<div class="nine-row"><span>With Nine</span><b>' + esc(d.nine) + '</b></div></div>' +
      '<p class="sample-note" style="margin:-6px 0 14px">Illustrative example. Real time depends on your process.</p>' +
      '<div class="row">' + (hasVideo ? "" : '<button class="btn outline small" id="replay" type="button">Replay demo</button>') +
      '<a class="btn navy small" href="#book">Try it free for 3 days</a></div>';
    var rp = $("replay");
    if (rp) { rp.addEventListener("click", function () { play(true); }); }
  }

  function select(i, animate) {
    clearTimers();
    cur = i;
    var d = demos[i];
    Array.prototype.forEach.call(tabsEl.children, function (b, k) { b.setAttribute("aria-selected", k === i ? "true" : "false"); });
    var vid = CONFIG.videos && CONFIG.videos[d.key];
    if (vid) {
      stage.innerHTML = '<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(vid) +
        '" title="' + esc(d.title) + ' demo" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
      renderInfo(d, true);
    } else if (CONFIG.localVideos && CONFIG.localVideos[d.key]) {
      var poster = CONFIG.posters && CONFIG.posters[d.key];
      stage.innerHTML = '<div class="video-frame"><video controls playsinline preload="metadata"' +
        (poster ? ' poster="' + esc(poster) + '"' : "") + ' src="' + esc(CONFIG.localVideos[d.key]) + '">Your browser does not support video.</video></div>' +
        '<p class="sample-note">Real screen recording of our POD Auto Downloader. Client details have been removed.</p>';
      renderInfo(d, true);
    } else {
      buildMock(d);
      renderInfo(d, false);
      play(animate);
    }
  }

  demos.forEach(function (d, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "dtab"; b.setAttribute("role", "tab"); b.textContent = d.tab;
    b.addEventListener("click", function () { select(i, true); });
    tabsEl.appendChild(b);
  });
  select(0, false);

  /* play the first demo when the section scrolls into view */
  var demoSection = $("demos");
  if ("IntersectionObserver" in window && !reduce) {
    var seen = false;
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !seen) { seen = true; play(true); obs.disconnect(); }
      });
    }, { threshold: 0.35 }).observe(demoSection);
  }

  /* ---------- reviews (real reviews only, from config.js) ---------- */
  var reviews = Array.isArray(CONFIG.reviews) ? CONFIG.reviews : [];
  var grid = $("reviewGrid");
  if (reviews.length) {
    reviews.forEach(function (r) {
      var rating = Math.max(1, Math.min(5, parseInt(r.rating, 10) || 5));
      var el = document.createElement("article");
      el.className = "review";
      el.innerHTML = '<div class="stars" aria-label="' + rating + ' out of 5 stars">' + "★".repeat(rating) + "</div>" +
        "<blockquote>" + esc(r.text) + "</blockquote>" +
        '<div class="who"><b>' + esc(r.name) + "</b><span>" + esc(r.role) + "</span></div>";
      grid.appendChild(el);
    });
  } else {
    $("reviewEmpty").hidden = false;
  }
  var cta = $("reviewCta");
  var shareMsg = "Hello Nine Automation, I would like to share my feedback on your service.";
  if (CONFIG.reviewLink) {
    cta.innerHTML = 'Worked with us? <a href="' + esc(CONFIG.reviewLink) + '" target="_blank" rel="noopener">Leave a review</a>';
    cta.hidden = false;
  } else if (reviews.length) {
    cta.innerHTML = 'Worked with us? <a href="' + esc(waLink(shareMsg)) + '" target="_blank" rel="noopener">Share your feedback</a>';
    cta.hidden = false;
  }

  /* ---------- free trial booking ---------- */
  var dateEl = $("fDate");
  var t = new Date();
  dateEl.min = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");

  function niceDate(v) {
    if (!v) return "any day";
    var p = v.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
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

    var msg = "Hello Nine Automation, I want to book the 3-day free trial.\n" +
      "Name: " + name + "\n" +
      (co ? "Company: " + co + "\n" : "") +
      (phone ? "My number: " + phone + "\n" : "") +
      "Task to automate: " + task + "\n" +
      "Preferred start: " + niceDate(dateEl.value) + ", call time " + $("fSlot").value;

    var link = waLink(msg);
    $("afterLink").href = link;
    $("after").hidden = false;
    window.open(link, "_blank", "noopener");
  });
})();
