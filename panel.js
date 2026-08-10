// panel.js

document.addEventListener('DOMContentLoaded', () => {
  const urlInput = document.getElementById('urlInput');
  const webView = document.getElementById('webView');
  const welcomeScreen = document.getElementById('welcome-screen');
  const navBox = document.getElementById('navBox');

  // --- 加载网页函数 ---
  function loadUrl(url, forceHideNav = false) {
    if (!url) return;
    
    if (!url.startsWith('http') && !url.startsWith('file')) {
      url = 'https://' + url;
    }

    // 1. 隐藏欢迎页，显示 iframe
    welcomeScreen.style.display = 'none';
    webView.style.display = 'block';
    webView.src = url;

    // 2. 根据指令决定是否隐藏输入框
    if (forceHideNav) {
      navBox.style.display = 'none'; // 自动模式：全屏沉浸
    } else {
      navBox.style.display = 'block'; // 普通模式：保留输入框
      urlInput.value = url;
    }
  }

  // --- 检查是否有待加载的任务 ---
  function checkStorage(changes = null) {
    const getVal = (key) => changes ? (changes[key]?.newValue) : null;

    if (changes) {
      // 实时变化
      const newUrl = getVal('targetUrl');
      const hideNav = getVal('hideNav');
      if (newUrl) {
        loadUrl(newUrl, hideNav);
        chrome.storage.local.remove(['targetUrl', 'hideNav']);
      }
    } else {
      // 初始化检查
      chrome.storage.local.get(['targetUrl', 'hideNav'], (result) => {
        if (result.targetUrl) {
          // 有任务：加载网页，并根据 hideNav 决定是否隐藏输入框
          loadUrl(result.targetUrl, result.hideNav);
          chrome.storage.local.remove(['targetUrl', 'hideNav']);
        } else {
          // 无任务（手动点开）：显示欢迎页，且必须显示输入框
          navBox.style.display = 'block';
          urlInput.focus();
        }
      });
    }
  }

  // 初始化
  checkStorage();

  // 监听后续
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') checkStorage(changes);
  });

  // 手动输入回车
  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const val = urlInput.value.trim();
      if (val) {
        loadUrl(val, false); // 手动输入的保持输入框，方便修改
        urlInput.blur();
      }
    }
  });
});