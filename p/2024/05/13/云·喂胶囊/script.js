var canvas = document.querySelector("#unity-canvas");

function unityShowBanner(msg, type) {
var warningBanner = document.querySelector("#unity-warning");
function updateBannerVisibility() {
  warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
}
var div = document.createElement('div');
div.innerHTML = msg;
warningBanner.appendChild(div);
if (type == 'error') div.style = 'background: red; padding: 10px;';
else {
  if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
  setTimeout(function() {
    warningBanner.removeChild(div);
    updateBannerVisibility();
  }, 5000);
}
updateBannerVisibility();
}

var buildUrl = "Build";
var loaderUrl = buildUrl + "/Web.loader.js";
var config = {
arguments: [],
dataUrl: buildUrl + "/Web.data.br",
frameworkUrl: buildUrl + "/Web.framework.js.br",
codeUrl: buildUrl + "/Web.wasm.br",
streamingAssetsUrl: "StreamingAssets",
companyName: "SadEPa",
productName: "FeedingCapsule",
productVersion: "1.1-rc1",
showBanner: unityShowBanner,
};

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
var meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
document.getElementsByTagName('head')[0].appendChild(meta);
document.querySelector("#unity-container").className = "unity-mobile";
canvas.className = "unity-mobile";
} else {
canvas.style.width = "960px";
canvas.style.height = "600px";
}

document.querySelector("#unity-loading-bar").style.display = "block";

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
createUnityInstance(canvas, config, (progress) => {
  document.querySelector("#unity-progress-bar-full").style.width = 100 * progress + "%";
}).then((unityInstance) => {
  document.querySelector("#unity-loading-bar").style.display = "none";
  document.querySelector("#unity-fullscreen-button").onclick = () => {
    unityInstance.SetFullscreen(1);
  };
}).catch((message) => {
  alert(message);
});
};

document.body.appendChild(script);