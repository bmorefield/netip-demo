const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Modules for IPC, Tray, and Menu
const ipc = electron.ipcMain
const Tray = electron.Tray
const Menu = electron.Menu

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray
let localIp

function createTray() {
  tray = new Tray('iconmonstr-networking@2x.png')

  // Set click event
  tray.on('click', () => {
    if(mainWindow == null) {
      createWindow()
    }
    else {
      mainWindow.close()
      mainWindow = null;
    }
  })

  tray.on('right-click', () => {
    var menuTemplate = [
      {
        label: 'Quit',
        click: _ => app.quit()
      }
    ]
    console.log("Tray: IP: " + localIp)
    if(localIp) {
      menuTemplate.splice(0, 0, {
        label: localIp
      })
      menuTemplate.splice(1, 0, {
        type: 'separator'
      })
    }
    const menu = Menu.buildFromTemplate(menuTemplate)
    tray.popUpContextMenu(menu)
  })

  getRemoteIp()
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 400, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

ipc.on('load-info', _ => {
  console.log("Load Event Received.")
  loadInformation();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createTray()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function getRemoteIp() {
  // Get the external IP address and display to user
  var http = require('http');

  http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
    resp.on('data', function(ip) {
      var parsedIp = String(ip);
      console.log("Remote IP: " + parsedIp);
      tray.setToolTip(parsedIp)
      localIp = parsedIp
      if(mainWindow) {
        mainWindow.webContents.send('remoteIp', parsedIp);
      }

      var dns = require('dns');
      dns.reverse(parsedIp, function(err, hostnames) {
        console.log("Remote Hostname: " + hostnames)
        tray.setToolTip(parsedIp + " (" + hostnames + ")")
        if(mainWindow) {
          mainWindow.webContents.send('remoteHost', hostnames);
        }
      });
    });
  });
}

function getLocalIp () {
  var os = require('os');

  var interfaces = os.networkInterfaces();
  var addresses = [];
  var idx = 1;
  for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (!address.internal) {
              var addressInfo = {
                id: idx,
                ip: String(address.address),
                netmask: String(address.netmask)
              };
              addresses.push(addressInfo);
              idx++;
          }
      }
  }
  console.log("Local IP: " + JSON.stringify(addresses));
  mainWindow.webContents.send('localIp', addresses)

  // Get the DNS Servers
  var dns = require('dns');
  var dnsServers = dns.getServers();
  mainWindow.webContents.send('dnsServers', dnsServers);

  // Get the address info with host names
  for(var idx = 0; idx < addresses.length; idx++) {
    var ip = addresses[idx];
    dns.reverse(String(ip.ip), function(err, hostnames) {
      if(!err) {
        console.log("Local Hostname for " + ip.address + ": " + hostnames)
        var addressInfo = {
          id: address.idx,
          ip: String(address.address),
          netmask: String(address.netmask),
          hostname: String(hostnames)
        };
        mainWindow.webContents.send('localIpAndHost', addressInfo);
      }
      else {
        console.log("Error on reverse DNS for " + ip.ip + ": " + JSON.stringify(err));
      }
    });
  }
}

function loadInformation () {
  getLocalIp();
  getRemoteIp();
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
