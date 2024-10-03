// ==UserScript==
// @name           Youtube Adb
// @match          *://*.youtube.com/*
// @exclude        *://*.accounts.youtube.com/*
// @exclude        *://*.youtube.com/live_chat_replay*
// @exclude        *://*.youtube.com/persist_identity*
// @run-at         document-start
// ==/UserScript==

(function () {
  `use strict`;

  let video;

  const cssSelectorArray = [
    `#masthead-ad`,
    `ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)`,
    `.video-ads.ytp-ad-module`,
    `tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)`,
    `ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]`,
    `#related #player-ads`,
    `#related ytd-ad-slot-renderer`,
    `ytd-ad-slot-renderer`,
    `yt-mealbar-promo-renderer`,
    `ytd-popup-container:has(a[href="/premium"])`,
    `ad-slot-renderer`,
    `ytm-companion-ad-renderer`,
  ];
  window.dev = false;

  /**
  * 
  * @param {Date} time 
  * @param {String} format 
  * @return {String}
  */
  function moment(time) {
    //
    let y = time.getFullYear()
    let m = (time.getMonth() + 1).toString().padStart(2, `0`)
    let d = time.getDate().toString().padStart(2, `0`)
    let h = time.getHours().toString().padStart(2, `0`)
    let min = time.getMinutes().toString().padStart(2, `0`)
    let s = time.getSeconds().toString().padStart(2, `0`)
    return `${y}-${m}-${d} ${h}:${min}:${s}`
  }

  /**
  * 
  * @param {String} msg 
  * @return {undefined}
  */
  function log(msg) {
    if (!window.dev) {
      return false;
    }
    console.log(window.location.href);
    console.log(`${moment(new Date())}  ${msg}`);
  }

  /**
  * 
  * @param {String} name
  * @return {undefined}
  */
  function setRunFlag(name) {
    let style = document.createElement(`style`);
    style.id = name;
    (document.head || document.body).appendChild(style);
  }

  /**
  * 
  * @param {String} name
  * @return {undefined|Element}
  */
  function getRunFlag(name) {
    return document.getElementById(name);
  }

  /**
  * 
  * @param {String} name
  * @return {Boolean}
  */
  function checkRunFlag(name) {
    if (getRunFlag(name)) {
      return true;
    } else {
      setRunFlag(name)
      return false;
    }
  }

  /**
  * 
  * @param {String} styles 
  * @return {undefined}
  */
  function generateRemoveADHTMLElement(id) {

    if (checkRunFlag(id)) {
      log(`屏蔽页面广告节点已生成`);
      return false
    }


    let style = document.createElement(`style`);
    (document.head || document.body).appendChild(style);
    style.appendChild(document.createTextNode(generateRemoveADCssText(cssSelectorArray)));
    log(`生成屏蔽页面广告节点成功`);
  }

  /**
  * 
  * @param {Array} cssSelectorArray 
  * @return {String}
  */
  function generateRemoveADCssText(cssSelectorArray) {
    cssSelectorArray.forEach((selector, index) => {
      cssSelectorArray[index] = `${selector}{display:none!important}`;
    });
    return cssSelectorArray.join(` `);
  }

  /**
  * 
  * @return {undefined}
  */
  function nativeTouch() {
    // 
    let touch = new Touch({
      identifier: Date.now(),
      target: this,
      clientX: 12,
      clientY: 34,
      radiusX: 56,
      radiusY: 78,
      rotationAngle: 0,
      force: 1
    });


    let touchStartEvent = new TouchEvent(`touchstart`, {
      bubbles: true,
      cancelable: true,
      view: window,
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch]
    });


    this.dispatchEvent(touchStartEvent);


    let touchEndEvent = new TouchEvent(`touchend`, {
      bubbles: true,
      cancelable: true,
      view: window,
      touches: [],
      targetTouches: [],
      changedTouches: [touch]
    });


    this.dispatchEvent(touchEndEvent);
  }


  /**
  *
  * @return {undefined}
  */
  function getVideoDom() {
    video = document.querySelector(`.ad-showing video`) || document.querySelector(`video`);
  }


  /**
  * 
  * @return {undefined}
  */
  function playAfterAd() {
    if (video && video.paused && video.currentTime < 1) {
      video.play();
      log(`自动播放视频`);
    }
  }


  /**
  * 
  * @return {undefined}
  */
  function closeOverlay() {

    const premiumContainers = [...document.querySelectorAll(`ytd-popup-container`)];
    const matchingContainers = premiumContainers.filter(container => container.querySelector(`a[href="/premium"]`));

    if (matchingContainers.length > 0) {
      matchingContainers.forEach(container => container.remove());
      log(`移除YT拦截器`);
    }


    const backdrops = document.querySelectorAll(`tp-yt-iron-overlay-backdrop`);

    const targetBackdrop = Array.from(backdrops).find(
      (backdrop) => backdrop.style.zIndex === `2201`
    );

    if (targetBackdrop) {
      targetBackdrop.className = ``;
      targetBackdrop.removeAttribute(`opened`);
      log(`关闭遮罩层`);
    }
  }


  /**
  * 
  * @return {undefined}
  */
  function skipAd(mutationsList, observer) {
    const skipButton = document.querySelector(`.ytp-ad-skip-button`) || document.querySelector(`.ytp-skip-ad-button`) || document.querySelector(`.ytp-ad-skip-button-modern`);
    const shortAdMsg = document.querySelector(`.video-ads.ytp-ad-module .ytp-ad-player-overlay`) || document.querySelector(`.ytp-ad-button-icon`);

    if ((skipButton || shortAdMsg) && window.location.href.indexOf(`https://m.youtube.com/`) === -1) {
      video.muted = true;
    }

    if (skipButton) {
      const delayTime = 0.5;
      setTimeout(skipAd, delayTime * 1000);
      if (video.currentTime > delayTime) {
        video.currentTime = video.duration;
        log(`特殊账号跳过按钮广告`);
        return;
      }
      skipButton.click();
      nativeTouch.call(skipButton);
      log(`按钮跳过广告`);
    } else if (shortAdMsg) {
      video.currentTime = video.duration;
      log(`强制结束了该广告`);
    }

  }

  /**
  * 
  * @return {undefined}
  */
  function removePlayerAD(id) {

    if (checkRunFlag(id)) {
      log(`去除播放中的广告功能已在运行`);
      return false
    }


    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(() => { getVideoDom(); closeOverlay(); skipAd(); playAfterAd(); });
    observer.observe(targetNode, config);
    log(`运行去除播放中的广告功能成功`);
  }

  /**
  * 
  */
  function main() {
    generateRemoveADHTMLElement(`removeADHTMLElement`);
    removePlayerAD(`removePlayerAD`);
  }

  if (document.readyState === `loading`) {
    document.addEventListener(`DOMContentLoaded`, main);
    log(`YouTube去广告脚本即将调用:`);
  } else {
    main();
    log(`YouTube去广告脚本快速调用:`);
  }

})();