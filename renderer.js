// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// Get the local IP addresses and display to user
const electron = require('electron')
const ipc = electron.ipcRenderer

ipc.on('localIp', (evnt, ipInfo) => {
  console.log("Received Local IP:" + ipInfo);
  var ipHtml = "<ol>";
  for (var idx = 0; idx < ipInfo.length; idx++) {
    var ip = ipInfo[idx];
    ipHtml += "<li>" + ip.ip + " (" + ip.netmask + ")</li>";
  }
  ipHtml += "</ol>";

  document.getElementById("localip").innerHTML = ipHtml;
})

ipc.on('remoteIp', (evnt, ipInfo) => {
  console.log("Receive remote IP: "+ ipInfo);
  document.getElementById("externalip").innerHTML = ipInfo;
})

ipc.on('remoteHost', (evnt, hostInfo) => {
  console.log("Receive Remote HostInfo" + hostInfo);
  document.getElementById("reversedns").innerHTML = hostInfo;
})

ipc.send('load-info');
