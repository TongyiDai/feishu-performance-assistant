const SUPPORTED_HOSTS = [
  "feishu.cn",
  "larkoffice.com",
  "larksuite.com",
  "feishuapp.com"
];

const TARGET_PATHS = ["/base", "/wiki", "/app"];

function isSupportedHostname(hostname) {
  return SUPPORTED_HOSTS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

function isTargetPath(pathname) {
  return TARGET_PATHS.some((path) => pathname.startsWith(path));
}

console.log("绩效助手：监听服务启动");

document.addEventListener('click', (event) => {
  // --- 🛑 第一道关卡：环境检测 ---
  // 只有当“当前页面的网址”包含 /perf/ (绩效系统特征) 时，才启用拦截功能
  // 如果你在普通的 Wiki 或主页，代码直接在这里结束，不会干扰你
  const currentPageUrl = window.location.href;
  if (!currentPageUrl.includes("/perf/")) {
      return; 
  }

  // --- 第二道关卡：链接检测 (和之前一样) ---
  const link = event.target.closest('a');

  // 排除无效链接
  if (!link || !link.href || link.href.startsWith('javascript:')) return;

  try {
    const urlStr = link.href;
    const urlObj = new URL(urlStr);
    
    // 1. 检查目标链接是不是飞书系的
    if (!isSupportedHostname(urlObj.hostname)) return;

    // 2. 检查目标链接是不是关键应用 (Base, Wiki, App)
    if (isTargetPath(urlObj.pathname)) {
      console.log(`🎯 在绩效系统中命中关键链接，拦截: ${urlStr}`);

      event.preventDefault();
      event.stopPropagation();

      chrome.runtime.sendMessage({
        action: "interceptedLink",
        url: urlStr
      });
    }

// content.js 的结尾部分

  } catch (e) {
    // 🔍 专门捕获这个“上下文失效”的错误
    if (e.message.includes("Extension context invalidated")) {
      console.log("检测到插件已更新，请刷新当前页面以生效。");
    } else {
      // 其他真正的错误才打印红字
      console.error("URL解析跳过:", e);
    }
  }

}, true);
