/* ===== Survey app (13 questions, 3 steps) ===== */
const STORAGE_KEY = "xj_insurance_check_v1";

const steps = [
  { id: 1, name: "基本狀況", range: [0, 3] },   // Q1-4
  { id: 2, name: "目前保障", range: [4, 9] },   // Q5-10
  { id: 3, name: "預算與責任", range: [10, 12] } // Q11-13
];

const questions = [
  {
    id: "age_group",
    step: 1,
    title: "你的年齡區間？",
    options: [
      { value: "18-24", label: "18–24" },
      { value: "25-30", label: "25–30" },
      { value: "31-40", label: "31–40" },
      { value: "41+", label: "41+" },
      { value: "50+", label: "50以上", neutral: true }
    ]
  },
  {
    id: "work_type",
    step: 1,
    title: "你的工作是？",
    options: [
      { value: "office", label: "一般上班族" },
      { value: "shift", label: "服務業 / 餐飲業" },
      { value: "self", label: "自由業 / 自營" },
      { value: "student", label: "學生" },
      { value: "other", label: "其他", neutral: true }
    ]
  },
  {
    id: "priority",
    step: 1,
    multiple: true,
    title: "你最在意的保障方向？（可複選）",
    options: [
      { value: "medical", label: "醫療住院 / 手術" },
      { value: "cancer", label: "癌症 / 重大傷病" },
      { value: "accident", label: "意外" },
      { value: "income", label: "失能/收入中斷" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "health_check",
    step: 1,
    title: "是否有定期健檢 / 慢性病史？（僅做初步分流）",
    options: [
      { value: "yes_check", label: "有定期健檢 / 有追蹤" },
      { value: "yes_chronic", label: "有慢性病史 / 長期用藥" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "我不知道", neutral: true }
    ]
  },

  {
    id: "has_medical",
    step: 2,
    title: "目前有醫療住院/手術保障嗎？",
    options: [
      { value: "yes_good", label: "有（覺得蠻足夠）" },
      { value: "yes_some", label: "有（但不太確定夠不夠）" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "has_cancer",
    step: 2,
    title: "有癌症相關保障嗎？",
    options: [
      { value: "yes", label: "有" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "has_critical",
    step: 2,
    title: "有重大傷病/重大疾病保障嗎？",
    options: [
      { value: "yes", label: "有" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "has_accident",
    step: 2,
    title: "有意外（身故/失能/醫療）保障嗎？",
    options: [
      { value: "yes", label: "有" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "has_liability",
    step: 2,
    title: "有第三人責任/個人責任保障嗎？",
    options: [
      { value: "yes", label: "有" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "has_life",
    step: 2,
    title: "有壽險（留給家人）保障嗎？",
    options: [
      { value: "yes", label: "有" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },

  {
    id: "family_burden",
    step: 3,
    title: "目前是否有需要你負擔主要生活費的家人？",
    options: [
      { value: "yes", label: "有（小孩/父母）" },
      { value: "no", label: "沒有" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "premium_budget",
    step: 3,
    title: "你每月可接受的保費預算？",
    options: [
      { value: "under_1000", label: "1,000 以下" },
      { value: "1000_3000", label: "1,000–3,000" },
      { value: "3000_6000", label: "3,000–6,000" },
      { value: "6000_plus", label: "6,000 以上" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  },
  {
    id: "premium_payer",
    step: 3,
    title: "保費目前是誰在幫你繳？",
    options: [
      { value: "self", label: "自己" },
      { value: "parents", label: "父母" },
      { value: "shared", label: "共同分攤" },
      { value: "other", label: "其他" },
      { value: "unsure", label: "不確定", neutral: true }
    ]
  }
];

let state = loadState();
let currentStepIndex = 0;

const el = {
  questions: document.getElementById("questions"),
  stepLabel: document.getElementById("stepLabel"),
  stepName: document.getElementById("stepName"),
  qCount: document.getElementById("qCount"),
  progressFill: document.getElementById("progressFill"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  resultCard: document.getElementById("resultCard"),
  resultText: document.getElementById("resultText"),
  copyBtn: document.getElementById("copyBtn"),
  resetBtn: document.getElementById("resetBtn"),
  toast: document.getElementById("toast"),
  sendEmailBtn: document.getElementById("sendEmailBtn"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),
};

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { answers: {} };
  }catch{
    return { answers: {} };
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function getStepQuestions(stepId){
  return questions.filter(q => q.step === stepId);
}
function isAnswered(q){
  const v = state.answers?.[q.id];
  if(q.multiple) return Array.isArray(v) && v.length > 0;
  return v !== undefined && v !== null && v !== "";
}
function answeredCount(){
  return questions.reduce((acc, q) => acc + (isAnswered(q) ? 1 : 0), 0);
}
function setToast(text){
  if(!el.toast) return;
  el.toast.textContent = text;
  el.toast.style.display = "block";
  setTimeout(()=> el.toast.style.display = "none", 1700);
}

function payloadBytes(obj){
  try{
    return new TextEncoder().encode(JSON.stringify(obj)).length;
  }catch{
    return JSON.stringify(obj).length;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

// ===== 超狠縮圖：只保留前 45 行、窄版、12px、JPEG 低品質 =====
function makeTinyResultLines(text, maxLines = 45){
  const raw = (text || "").trim();
  if(!raw) return ["（無內容）"];
  const lines = raw.split("\n");
  if(lines.length <= maxLines) return lines;
  return lines.slice(0, maxLines).concat(["…（內容過長，已省略）"]);
}

function buildTinyScreenshotDataUrl(text){
  const padding = 14;
  const lineHeight = 16;
  const font = "12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans TC,PingFang TC,Microsoft JhengHei,Arial,sans-serif";
  const titleFont = "700 12px -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans TC,PingFang TC,Microsoft JhengHei,Arial,sans-serif";

  // 窄版：越窄越省
  const width = 420;
  const cardX = 10, cardY = 10;
  const cardW = width - 20;

  // wrap
  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d");
  tctx.font = font;

  const contentWidth = cardW - padding * 2;
  const baseLines = makeTinyResultLines(text, 45);

  const wrapped = [];
  for (const rawLine of baseLines){
    let cur = "";
    for (const ch of rawLine){
      const test = cur + ch;
      if (tctx.measureText(test).width > contentWidth){
        wrapped.push(cur);
        cur = ch;
      } else {
        cur = test;
      }
    }
    wrapped.push(cur);
  }

  // 再限制總行數（避免爆）
  const MAX_WRAPPED = 80;
  const finalLines = wrapped.length > MAX_WRAPPED
    ? wrapped.slice(0, MAX_WRAPPED).concat(["…（已省略）"])
    : wrapped;

  const height = cardY*2 + padding*2 + 18 + finalLines.length*lineHeight + 10;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f6f7f8";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cardX, cardY, cardW, height - 20, 14);
  ctx.fill();

  ctx.strokeStyle = "rgba(17,24,39,.10)";
  ctx.lineWidth = 1;
  roundRect(ctx, cardX, cardY, cardW, height - 20, 14);
  ctx.stroke();

  ctx.font = titleFont;
  ctx.fillStyle = "rgba(17,24,39,.90)";
  ctx.fillText("小吉保健室｜初步建議（節錄）", cardX + padding, cardY + padding + 2);

  ctx.font = font;
  ctx.fillStyle = "rgba(17,24,39,.85)";
  let y = cardY + padding + 14;
  for (const line of finalLines){
    y += lineHeight;
    ctx.fillText(line, cardX + padding, y);
  }

  // JPEG：直接很低品質，省爆
  return canvas.toDataURL("image/jpeg", 0.25);
}

function render(){
  const step = steps[currentStepIndex];
  const stepId = step.id;
  const qs = getStepQuestions(stepId);

  el.stepLabel.textContent = `Step ${step.id} / 3`;
  el.stepName.textContent = step.name;

  const total = questions.length;
  const done = answeredCount();
  el.qCount.textContent = String(done);
  el.progressFill.style.width = `${Math.round((done / total) * 100)}%`;

  el.prevBtn.disabled = currentStepIndex === 0;
  el.nextBtn.textContent = (currentStepIndex === steps.length - 1) ? "產出初步建議" : "下一段";

  el.questions.innerHTML = "";
  qs.forEach(q => {
    const card = document.createElement("section");
    card.className = "card formCard";

    const title = document.createElement("div");
    title.className = "qTitle";
    title.textContent = q.title;

    const opts = document.createElement("div");
    opts.className = "options";

    const isMultiple = !!q.multiple;

    q.options.forEach((opt) => {
      const label = document.createElement("label");
      label.className = "option" + (opt.neutral ? " neutral" : "");

      const input = document.createElement("input");
      input.type = isMultiple ? "checkbox" : "radio";
      input.name = q.id;
      input.value = opt.value;

      if (isMultiple) {
        const arr = Array.isArray(state.answers[q.id]) ? state.answers[q.id] : [];
        input.checked = arr.includes(opt.value);
      } else {
        input.checked = (state.answers[q.id] === opt.value);
      }

      input.addEventListener("change", () => {
        if (isMultiple) {
          const picked = Array.isArray(state.answers[q.id]) ? state.answers[q.id] : [];
          let next = picked.slice();

          if (input.checked) {
            if (!next.includes(opt.value)) next.push(opt.value);
            if (opt.value === "unsure") next = ["unsure"];
            else next = next.filter(v => v !== "unsure");
          } else {
            next = next.filter(v => v !== opt.value);
          }

          state.answers[q.id] = next;
        } else {
          state.answers[q.id] = opt.value;
        }

        saveState();
        el.qCount.textContent = String(answeredCount());
        el.progressFill.style.width = `${Math.round((answeredCount() / questions.length) * 100)}%`;
        render();
      });

      const wrap = document.createElement("div");
      wrap.className = "label";
      const b = document.createElement("b");
      b.textContent = opt.label;
      wrap.appendChild(b);

      label.appendChild(input);
      label.appendChild(wrap);
      opts.appendChild(label);
    });

    card.appendChild(title);
    card.appendChild(opts);
    el.questions.appendChild(card);
  });

  el.resultCard.style.display = "none";
}

function missingInStep(stepId){
  const qs = getStepQuestions(stepId);
  return qs.filter(q => !isAnswered(q)).map(q => q.title);
}

function summarize(){
  const a = state.answers || {};
  const gaps = [];
  const priority = [];

  const coverageChecks = [
    ["has_medical", "醫療住院/手術"],
    ["has_cancer", "癌症"],
    ["has_critical", "重大傷病/重大疾病"],
    ["has_accident", "意外"],
    ["has_liability", "第三人責任/個人責任"],
    ["has_life", "壽險"]
  ];

  coverageChecks.forEach(([key, name]) => {
    const v = a[key];
    if(v === "no") gaps.push(`・${name}：目前「沒有」`);
    if(v === "unsure" || v === "yes_some") gaps.push(`・${name}：目前「不確定/可能不足」`);
  });

  if(a.family_burden === "yes"){
    priority.push("1) 家庭責任存在：先確認壽險/意外/醫療的基礎保障是否足夠");
  }
  if(a.health_check === "yes_chronic"){
    priority.push("2) 有慢性病史：投保前先做體況盤點，優先看現有保單是否可補強（避免被除外/加費）");
  }

  const p = Array.isArray(a.priority) ? a.priority : (a.priority ? [a.priority] : []);
  if(p.includes("medical")) priority.push("3) 你最在意醫療：先補齊住院/手術缺口，再看癌症/重大傷病");
  if(p.includes("cancer")) priority.push("3) 你最在意癌症：先確認一次金 + 療程型的配置與額度");
  if(p.includes("accident")) priority.push("3) 你最在意意外：先確認意外身故/失能 + 意外醫療");
  if(p.includes("income")) priority.push("3) 你在意收入中斷：先用保費可接受範圍評估是否需要更完整規劃");

  const budgetMap = {
    under_1000: "1,000 以下",
    "1000_3000": "1,000–3,000",
    "3000_6000": "3,000–6,000",
    "6000_plus": "6,000 以上",
    unsure: "不確定"
  };
  const payerMap = {
    self: "自己",
    parents: "父母",
    shared: "共同分攤",
    other: "其他",
    unsure: "不確定"
  };

  const budgetText = budgetMap[a.premium_budget] || "未填";
  const payerText = payerMap[a.premium_payer] || "未填";

  const lines = [];
  lines.push("【保費統整】");
  lines.push(`・每月預算：${budgetText}`);
  lines.push(`・保費負擔：${payerText}`);
  lines.push("");

  lines.push("【可能缺口（初步）】");
  if(gaps.length === 0) lines.push("・目前未看到明顯缺口（或需要補充更多細節）");
  else lines.push(gaps.join("\n"));
  lines.push("");

  lines.push("【建議優先順序（初步）】");
  if(priority.length === 0) lines.push("・建議先把現有保單內容整理後，再依缺口排序補強");
  else lines.push(priority.join("\n"));
  lines.push("");

  lines.push("【填寫完畢後】");
  lines.push("・你可以直接截圖此分析結果，回傳給小吉做更完整分析。如果你比較懶惰可用下方的表格直接傳到小吉的信箱");

  return lines.join("\n");
}

function showResult(){
  el.resultText.textContent = summarize();
  el.resultCard.style.display = "block";
  el.resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function init(){
  if(!el.questions) return;

  // EmailJS init (Public Key)
  if (window.emailjs) {
    emailjs.init("hD-q8AnphhI4qHFkL");
  }

  el.prevBtn.addEventListener("click", () => {
    if(currentStepIndex > 0){
      currentStepIndex -= 1;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  el.nextBtn.addEventListener("click", () => {
    const stepId = steps[currentStepIndex].id;
    const missing = missingInStep(stepId);
    if(missing.length > 0) setToast("還有題目未填（可略過）");

    if(currentStepIndex === steps.length - 1){
      showResult();
      return;
    }
    currentStepIndex += 1;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  el.copyBtn?.addEventListener("click", async () => {
    try{
      await navigator.clipboard.writeText(el.resultText.textContent || "");
      setToast("已複製");
    }catch{
      setToast("複製失敗");
    }
  });

  el.resetBtn?.addEventListener("click", () => {
    state = { answers: {} };
    saveState();
    currentStepIndex = 0;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setToast("已清除");
  });

  // ===== Send Email: tiny screenshot (excerpt) OR fallback to text-only =====
  el.sendEmailBtn?.addEventListener("click", async () => {
    const name = (el.userName?.value || "").trim();
    const userEmail = (el.userEmail?.value || "").trim();

    if (!name) return setToast("請先填姓名");
    if (userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) return setToast("Email 格式不正確");
    if (!window.emailjs) return setToast("寄信模組尚未載入");

    try {
      el.sendEmailBtn.disabled = true;
      el.sendEmailBtn.textContent = "送出中…";

      // 先準備文字（也稍微截斷，避免太長）
      const fullText = (el.resultText?.textContent || "");
      const safeText = fullText.length > 8000 ? (fullText.slice(0, 8000) + "\n…（內容過長已截斷）") : fullText;

      const payload = {
        from_name: name,
        user_email: userEmail || "(未填)",
        result_text: safeText
      };

      // 先嘗試塞超小截圖（節錄）
      const tinyDataUrl = buildTinyScreenshotDataUrl(safeText);
      payload.screenshot_base64 = tinyDataUrl;

      // 送出前算大小，如果太大就拿掉截圖（避免 50KB error）
      const bytesWithShot = payloadBytes(payload);
      if (bytesWithShot > 48 * 1024) {
        delete payload.screenshot_base64;
      }

      await emailjs.send(
        "service_pws6xbw",
        "template_2fxobsf",
        payload
      );

      setToast(payload.screenshot_base64 ? "已送出囉✅" : "已送出（文字結果）✅");
    } catch (e) {
      console.error("EmailJS error:", e);
      const msg = (e?.text) || (e?.message) || (e?.status ? `status ${e.status}` : "") || "unknown";
      setToast("送出失敗：" + msg);
    } finally {
      el.sendEmailBtn.disabled = false;
      el.sendEmailBtn.textContent = "一鍵寄出（含截圖）";
    }
  });

  render();
}

init();
