// SPDX-License-Identifier: GPL-3.0-or-later
// providers/mistral.js - the Mistral AI (chat.mistral.ai) provider.
// Exports the same ZSProvider interface as the other site providers. This
// integration follows the same contract as Gemini/ChatGPT and keeps the DOM
// matching intentionally resilient to Mistral's React/Next UI re-renders.
//
// NOTE: Mistral's site structure is not yet browser-validated in this workspace,
// so the selectors below are intentionally broad and compatible with a typical
// modern chat app (message role tokens + textarea/contenteditable composer).
// The rest of the extension remains unchanged when these selectors are present.
// eslint-disable-next-line no-unused-vars
const ZSProvider = (() => {
  "use strict";
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let diag = () => {}; // injected by core via init()

  const S = {
    userItem: "[data-role='user'], [data-message-author-role='user'], [data-testid*='user-message'], [data-sender='user']",
    assistantItem: "[data-role='assistant'], [data-message-author-role='assistant'], [data-testid*='assistant-message'], [data-sender='assistant']",
    anyItem: "[data-role='user'], [data-role='assistant'], [data-message-author-role='user'], [data-message-author-role='assistant'], [data-testid*='user-message'], [data-testid*='assistant-message'], [data-sender='user'], [data-sender='assistant']",
    reply: ".markdown, .prose, .message-content, [data-testid='message-content'], [data-slot='message-content'], .text-content",
    thinking: ".thinking, .reasoning, [data-testid*='thinking'], [data-testid*='reasoning'], [class*='thinking'], [class*='reasoning']",
    editor: "textarea, [role='textbox'], [contenteditable='true'], [contenteditable='plaintext-only'], div[contenteditable='true']",
    codeWrap: "pre, code",
    errorSurfaces: '[role="alert"],[class*="error"],[class*="toast"],[data-testid*="error"],[aria-live="assertive"]',
    stopBtnSel: "button[aria-label*='Stop'], button[aria-label*='Arrêter'], button[data-testid*='stop'], [data-testid*='stop-button']",
  };

  const RE = {
    contextLimit: new RegExp(
      [
        "conversation.{0,20}(too long|trop long)",
        "context.{0,20}(limit|exceeded|d\\u00e9pass\\u00e9)",
        "please.{0,30}(start|cr\\u00e9er).{0,20}(new|nouveau).{0,20}(chat|conversation)",
        "(token|context).{0,10}limit",
        "maximum.{0,20}context",
      ].join("|"),
      "i"
    ),
    tooLong: /conversation .{0,20}(too long|getting too long|trop longue)/i,
    busy: /something went wrong|une erreur s.est produite|try again later|réessayer plus tard|temporarily unavailable|too many requests|trop de requ\u00eates/i,
    continueBtn: /^(continue|continuer|continue generating|continue generation)$/i,
  };

  const timings = {
    GEN_IDLE_MS: 1500,
    REASON_IDLE_MS: 12000,
    WARMUP_MS: 45000,
    REASON_NOREPLY_MS: 90000,
    STABLE_MS: 9000,
    RESPONSE_TIMEOUT_MS: 300000,
  };

  const isUserItem = (item) => !!item && (item.matches?.(S.userItem) || !!item.querySelector?.(S.userItem));
  const isAssistantItem = (item) => !!item && (item.matches?.(S.assistantItem) || !!item.querySelector?.(S.assistantItem));

  function textWithout(root, excludeSel) {
    if (!root) return "";
    let out = "";
    const skip = excludeSel ? ", " + excludeSel : "";
    const later = (n) => {
      if (!n || n.nodeType !== 1) return;
      if (n.matches && n.matches(S.thinking + skip)) return;
      if (n.matches && n.matches(".zs-chip" + skip)) return;
      for (const c of n.childNodes) {
        if (c.nodeType === 3) out += c.nodeValue;
        else if (c.nodeType === 1) later(c);
      }
    };
    later(root);
    return out;
  }

  function itemText(item) {
    if (!item) return "";
    if (isAssistantItem(item)) {
      const md = item.querySelectorAll(S.reply);
      return [...md].map((m) => textWithout(m)).join("\n");
    }
    return textWithout(item);
  }

  function classifyText(item, excludeSel) {
    if (!item) return "";
    if (isAssistantItem(item)) {
      const md = item.querySelectorAll(S.reply);
      return [...md]
        .filter((m) => !(excludeSel && m.closest(excludeSel)))
        .map((m) => textWithout(m, excludeSel)).join("\n");
    }
    return textWithout(item, excludeSel);
  }

  const allItems = () => [...document.querySelectorAll(S.anyItem)];
  const assistantItems = () => allItems().filter(isAssistantItem);
  const assistantCount = () => assistantItems().length;
  const userCount = () => allItems().filter(isUserItem).length;

  const getEditor = () => {
    const candidates = [...document.querySelectorAll(S.editor)].filter((e) => !e.closest("#zs-root"));
    return candidates.find((e) => !!(e.value !== undefined || e.isContentEditable || e.getAttribute("role") === "textbox")) || candidates[0] || null;
  };

  const editorText = () => {
    const e = getEditor();
    if (!e) return "";
    if (e.value !== undefined) return e.value || "";
    return e.textContent || "";
  };

  const lastAssistant = () => {
    const it = assistantItems();
    return it.length ? it[it.length - 1] : null;
  };

  function lastAssistantId() {
    const item = lastAssistant();
    if (!item) return null;
    return item.dataset?.messageId || item.id || item.getAttribute("data-message-id") || item.getAttribute("data-id") || null;
  }

  const chatIsEmpty = () => allItems().length === 0;
  const isFreshChat = () => chatIsEmpty() && !!getEditor();

  const composerFrame = () => {
    const ed = getEditor();
    if (!ed) return null;
    return ed.closest("form, .composer, .chat-input, .message-input, [class*='composer'], [class*='input']") || ed.parentElement || null;
  };

  function barMount() {
    const frame = composerFrame();
    if (!frame) return null;
    const p = frame.parentElement || frame;
    return { parent: p, before: frame };
  }

  function setInputLock(on) {
    const ed = getEditor();
    if (!ed) return;
    if (ed.tagName === "TEXTAREA") {
      ed.setAttribute("readonly", on ? "" : "false");
      if (!on) ed.removeAttribute("readonly");
    } else if (ed.isContentEditable) {
      ed.setAttribute("contenteditable", on ? "false" : "true");
    }
  }

  function setTextareaValue(el, v) {
    if (!el) return;
    if (el.tagName === "TEXTAREA") {
      const desc = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value");
      if (desc && desc.set) {
        desc.set.call(el, v);
      } else {
        el.value = v;
      }
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (el.isContentEditable) {
      el.textContent = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }
    if (el.getAttribute && el.getAttribute("role") === "textbox") {
      el.textContent = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function clickStop() {
    const stop = document.querySelector(S.stopBtnSel) || document.querySelector('button[aria-label*="stop" i], button[aria-label*="arrêter" i]');
    if (stop) {
      stop.click();
      return true;
    }
    return false;
  }

  function stopGeneration() {
    return clickStop();
  }

  function isGenerating() {
    const stop = document.querySelector(S.stopBtnSel) || document.querySelector('button[aria-label*="stop" i], button[aria-label*="arrêter" i]');
    return !!stop;
  }

  const isBusyNow = () => isGenerating();
  const isHardGenerating = () => isGenerating();

  function readAssistant(item) {
    if (!item) return { present: false, reply: "", thinking: "", item: null };
    return {
      present: true,
      reply: itemText(item).trim(),
      thinking: "",
      item,
    };
  }

  function snapshot() {
    const item = lastAssistant();
    const text = item ? itemText(item) : "";
    return {
      active: isGenerating(),
      itemId: lastAssistantId(),
      replyLen: text.length,
    };
  }

  function typeAndSend(text) {
    const editor = getEditor();
    if (!editor) return false;
    const value = String(text || "");
    if (editor.tagName === "TEXTAREA") {
      setTextareaValue(editor, value);
    } else if (editor.isContentEditable) {
      editor.textContent = value;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      editor.textContent = value;
    }
    const send = document.querySelector('button[type="submit"], button[aria-label*="Send" i], button[aria-label*="Envoyer" i], [data-testid*="send-button"], [data-testid*="submit"], button[data-testid*="send"]');
    if (send) {
      send.click();
      return true;
    }
    const form = editor.closest("form");
    if (form) {
      form.requestSubmit?.();
      return true;
    }
    return false;
  }

  function scanError() {
    const text = [...document.querySelectorAll(S.errorSurfaces)].map((n) => n.textContent || "").join("\n");
    return text || "";
  }

  function isTooLongMsg(msg) {
    return typeof msg === "string" && RE.tooLong.test(msg);
  }

  function isBusyMsg(msg) {
    return typeof msg === "string" && RE.busy.test(msg);
  }

  function attachImages(files) {
    if (!files || !files.length) return false;
    const input = document.querySelector('input[type="file"]');
    if (!input) return false;
    const dt = new DataTransfer();
    [...files].forEach((file) => dt.items.add(file));
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function clearAttachments() {
    const input = document.querySelector('input[type="file"]');
    if (input) {
      input.value = "";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function conversationKey() {
    return location.pathname || location.href || "";
  }

  function ensureComposerReady() {
    return { ready: !!getEditor() };
  }

  function enforceComposer() {
    return ensureComposerReady();
  }

  function turnHalted() {
    return false;
  }

  function findContinueBtn() {
    return null;
  }

  function clickContinueBtn() {
    return false;
  }

  function findToolBlockSpot() {
    return null;
  }

  function installSendHooks() {
    return true;
  }

  return {
    id: "mistral",
    displayName: "Mistral",
    supportsVision: true,
    timings,
    thinkingSel: S.thinking,
    init({ diag: d } = {}) { if (d) diag = d; },
    allItems,
    isUserItem,
    isAssistantItem,
    itemText,
    classifyText,
    assistantCount,
    userCount,
    lastAssistant,
    lastAssistantId,
    readAssistant,
    streamLen: (item) => (item ? itemText(item).length : 0),
    snapshot,
    getEditor,
    editorText,
    chatIsEmpty,
    isFreshChat,
    composerFrame,
    barMount,
    setInputLock,
    typeAndSend,
    stopGeneration,
    isGenerating,
    isBusyNow,
    isHardGenerating,
    enforceComposer,
    ensureComposerReady,
    turnHalted,
    findContinueBtn,
    clickContinueBtn,
    scanError,
    isTooLongMsg,
    isBusyMsg,
    attachImages,
    clearAttachments,
    conversationKey,
    installSendHooks,
    findToolBlockSpot,
  };
})();
