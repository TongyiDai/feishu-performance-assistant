const SUPPORTED_HOSTS = [
  "feishu.cn",
  "larkoffice.com",
  "larksuite.com",
  "feishuapp.com"
];

// Replace this with the performance-review URL used by your tenant.
const DEFAULT_PERF_URL = "https://your-tenant.feishu.cn/perf/review";

function isSupportedHostname(hostname) {
  return SUPPORTED_HOSTS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

// 1. 关闭点击插件图标时的默认行为
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: false })
  .catch((error) => console.error(error));

// --- 辅助函数：智能获取绩效系统地址 ---
function getPerfUrl(currentUrl) {
  try {
    if (!currentUrl || !currentUrl.startsWith('http')) {
      return DEFAULT_PERF_URL;
    }
    
    const urlObj = new URL(currentUrl);
    const hostname = urlObj.hostname;

    if (isSupportedHostname(hostname)) {
      return `${urlObj.origin}/perf/review`;
    }
  } catch (e) {
    console.error("域名解析失败，使用默认地址");
  }
  return DEFAULT_PERF_URL;
}

// --- 公共函数：打开侧边栏 ---
function openInSidePanel(targetUrl, windowId, isImmersive = false) {
  if (!targetUrl) return;
  
  chrome.storage.local.set({ 
    'targetUrl': targetUrl,
    'hideNav': isImmersive 
  }, () => {
    chrome.sidePanel.open({ windowId: windowId });
  });
}

// --- 场景 1：自动拦截 ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "interceptedLink" && request.url) {
    openInSidePanel(request.url, sender.tab.windowId, true);
  }
});

// --- 场景 2：手动点击图标 ---
chrome.action.onClicked.addListener((tab) => {
  const currentUrl = tab.url;
  // 检查是否是常规网页
  const isNormalPage = currentUrl && (currentUrl.startsWith('http') || currentUrl.startsWith('file'));

  if (isNormalPage) {
    openInSidePanel(currentUrl, tab.windowId, true);
    const perfUrl = getPerfUrl(currentUrl);
    chrome.tabs.update(tab.id, { url: perfUrl });
  } else {
    // 空白页点击图标：只打开侧边栏（显示欢迎页），不传URL
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// --- 场景 3：右键菜单 ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "moveToSidePanel",
      title: "同时打开绩效系统",
      contexts: ["page", "link"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "moveToSidePanel") {
    
    // 🛡️ 修复核心：检查目标链接是否安全
    // 如果是在空白页 (chrome://newtab) 右键，info.pageUrl 是无法在侧边栏加载的
    const rawUrl = info.linkUrl || info.pageUrl;
    
    // 只有当网址是 http/https 或 file 开头时，才让侧边栏去加载
    if (rawUrl && (rawUrl.startsWith('http') || rawUrl.startsWith('https') || rawUrl.startsWith('file'))) {
        // 正常网页：侧边栏加载内容
        openInSidePanel(rawUrl, tab.windowId, true);
    } else {
        // 空白页/系统页：侧边栏只打开面板（显示欢迎页），不加载报错页面
        chrome.sidePanel.open({ windowId: tab.windowId });
    }
    
    // 2. 主窗口逻辑不变：依然跳转到绩效系统
    const perfUrl = getPerfUrl(tab.url);
    chrome.tabs.update(tab.id, { url: perfUrl });
  }
});
