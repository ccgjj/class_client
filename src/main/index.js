const electron = require('electron')
import { app, BrowserWindow, Notification, ipcMain} from 'electron'
import { autoUpdater } from 'electron-updater'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow = null;
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`;

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => { //单利模式
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})
if (isSecondInstance) {
  app.quit()
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width:1920,
    height:1080,
    resizable: false, //窗口是否可以改变尺寸
    frame: false, //带边框窗口
    show: false, //创建时不显示
    useContentSize:true,
    fullscreen:true,
    alwaysOnTop:true,
    webPreferences: {
      webSecurity: false
    },
  });
  let login = 0;
  mainWindow.on('page-title-updated', (e) => { //监听页面title的变化
    let contents = mainWindow.webContents.getTitle() //网页title
    if (contents == 'login') {//是否重新登录
      login++;
      mainWindow.loadURL(winURL);
    } else if (contents == 'offline') {//是否断网
      mainWindow.loadURL(winURL);
    } else if (contents=='check') {//是否检查更新
      console.log('开始检查更新')
      updateHandle();
    } else if (contents == 'finish') {//是否更新完成
         autoUpdater.quitAndInstall();
    }
  });

  mainWindow.once('ready-to-show', () => { //页面显示完后窗口在显示
    mainWindow.setFullScreen(true);
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  let login_ = 0;
  ipcMain.on("finish", () => {
    if (login_ == login) {
      mainWindow.webContents.send('clear', 0);//不需要清除本地账户信息
    } else {
      login_ = login;
      mainWindow.webContents.send('clear', 1);//需要清除
    }
  });

  ipcMain.on('network', () => {
    mainWindow.loadURL(winURL);
  });
  
  mainWindow.loadURL(winURL);
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('ready', createWindow);

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
  const uploadUrl = "http://192.168.1.91:8080"; // 下载地址，不加后面的**.exe
  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) { //更新出错
    console.log(error, '检查更新出错')
  });
  autoUpdater.on('checking-for-update', function (info) { //正在检查更新
    console.log(info, '检查更新中...')
  });
  autoUpdater.on('update-available', function (info) { //有可用更新
  console.log('有可用更新')
  mainWindow.webContents.executeJavaScript(`document.title='update'`);
  // let notification = new Notification({
  //   body:'系统正在升级，请不要关机'
  // });
  // notification.show();
  });
  autoUpdater.on('update-not-available', function (info) {
    console.log(info, '无可用更新')
  });
  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    // mainWindow.webContents.send('downloadProgress', progressObj)
    const progress_ = parseInt(progressObj.percent);
    console.log(progress_, 'progress_')
    mainWindow.webContents.executeJavaScript(`window.progress_=${progress_}`);
  })
  //下载完成时触发
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      console.log('安装包已经下载完成')
      mainWindow.webContents.executeJavaScript(`window.progress_=100`);
  });
  autoUpdater.checkForUpdates(); //触发检查
}