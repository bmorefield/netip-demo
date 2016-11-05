// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// Get the local IP addresses and display to user
const electron = require('electron')
const ipc = electron.ipcRenderer

ipc.on('localIp', (evnt, ipInfo) => {
  console.log("Received Local IP:" + ipInfo);
  var ipHtml = "<ol class=\"localipaddress\">";
  for (var idx = 0; idx < ipInfo.length; idx++) {
    var ip = ipInfo[idx];
    ipHtml += "<li id=\"localip-" + idx + "\">" + ip.ip + " / <span class=\"localnetmask\">" + ip.netmask + "</span></li>";
  }
  ipHtml += "</ol>";

  document.getElementById("localip").innerHTML = ipHtml;
})

ipc.on('localIpAndHost', (evnt, ipInfo) => {
  console.log("Received Local IP with Host:" + ipInfo);
  var ipHtml = String(ipInfo.ip) + " / <span class=\"localnetmask\">" + ip.netmask + "</span> (" + ipInfo.hostname + ")";
  var listElementId = "localip" + ipInfo.id;
  document.getElementById(listElementId).innerHTML = ipHtml;
})

ipc.on('remoteIp', (evnt, ipInfo) => {
  console.log("Receive remote IP: "+ ipInfo);
  document.getElementById("externalip").innerHTML = ipInfo;
})

ipc.on('remoteHost', (evnt, hostInfo) => {
  console.log("Receive Remote HostInfo" + hostInfo);
  document.getElementById("reversedns").innerHTML = hostInfo;
})

ipc.on('dnsServers', (evnt, dnsInfo) => {
  console.log("DNS Servers: " + dnsInfo);
  var dnsHtml = "<ol class=\"dns-list\">";
  for(var idx = 0; idx < dnsInfo.length; idx++) {
    var dnsServer = dnsInfo[idx];
    dnsHtml += "<li>" + dnsServer + "</li>";
  }
  dnsHtml += "</ol>";
  document.getElementById("dns").innerHTML = dnsHtml;
})

ipc.send('load-info');
