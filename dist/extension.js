"use strict";var x=Object.create;var v=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var D=Object.getPrototypeOf,$=Object.prototype.hasOwnProperty;var G=(s,e)=>{for(var t in e)v(s,t,{get:e[t],enumerable:!0})},M=(s,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of k(e))!$.call(s,o)&&o!==t&&v(s,o,{get:()=>e[o],enumerable:!(i=E(e,o))||i.enumerable});return s};var w=(s,e,t)=>(t=s!=null?x(D(s)):{},M(e||!s||!s.__esModule?v(t,"default",{value:s,enumerable:!0}):t,s)),O=s=>M(v({},"__esModule",{value:!0}),s);var W={};G(W,{activate:()=>A});module.exports=O(W);var r=w(require("vscode"));var m=w(require("vscode")),S=require("child_process"),p=class{_onDidChangeTreeData=new m.EventEmitter;onDidChangeTreeData=this._onDidChangeTreeData.event;_advancedMode=!1;constructor(){console.log("ROS2TopicsProvider initialized")}refresh(){console.log("Refresh called"),this._onDidChangeTreeData.fire()}toggleAdvanced(){return console.log("Advanced mode toggled"),this._advancedMode=!this._advancedMode,this._advancedMode}getAdvancedMode(){return this._advancedMode}getChildren(e){return new Promise((t,i)=>{(0,S.exec)("ros2 topic list",(o,n,l)=>{if(o)return console.error(`Error fetching topics: ${o.message}`),i(o);if(l)return console.error(`Error: ${l}`),i(new Error(l));let a=n.split(`
`).filter(c=>c).map(c=>{let g=new m.TreeItem(c,m.TreeItemCollapsibleState.None);return g.command={command:"ros2-topic-viewer.showMessages",title:"Show messages from ${topic}",arguments:[c]},g});t(a)})})}getTreeItem(e){return e}};var d="ros2-topic-viewer",f="ROS2 Topic Viewer";var u=require("child_process"),b=require("child_process"),I=w(require("fs")),C=w(require("path"));function A(s){let e=new p;r.window.registerTreeDataProvider("ros2TopicsView",e);let t=[],i=4,o=r.commands.registerCommand(`${d}.refreshTopics`,()=>{e.refresh(),r.window.showInformationMessage(f+": Topics refreshed!")}),n=r.commands.registerCommand(`${d}.showMessages`,a=>{let c=r.workspace.getConfiguration(d);if(t.length>=i&&c.get("panelLimitSetting")){r.window.showErrorMessage("Reached maximum number of panels! Please close a panel to open a new one.");return}let g=t.find(_=>_.title===`Messages for ${a}`);if(g){g.reveal(r.ViewColumn.One);return}let h=r.window.createWebviewPanel("topicMessages",`Messages for ${a}`,r.ViewColumn.One,{enableScripts:!0});t.push(h),R(a,h,t),e.getAdvancedMode()&&L(a,h)}),l=r.commands.registerCommand(`${d}.toggleAdvanced`,()=>{e.toggleAdvanced()?r.window.showInformationMessage(f+": Advanced mode enabled! Close panels to apply."):r.window.showInformationMessage(f+": Advanced mode disabled! Close panels to apply.")}),T=r.commands.registerCommand(`${d}.togglePanelLimit`,()=>{y()});s.subscriptions.push(o),s.subscriptions.push(n),s.subscriptions.push(l),s.subscriptions.push(T)}async function y(){try{let s=r.workspace.getConfiguration(d),e=s.get("panelLimitSetting");await s.update("panelLimitSetting",!e,r.ConfigurationTarget.Global),r.window.showInformationMessage("The panel limit setting is now set to: "+s.get("panelLimitSetting"))}catch(s){r.window.showErrorMessage("Error: "+s)}}async function N(s,e){if(e.visible===!1)return;let t=(0,b.exec)("ros2 topic info "+s+" --verbose");t.stdout?.on("data",i=>{e.webview.postMessage({command:"pushInfo",message:i.toString()}),t.kill()}),t.stderr?.on("data",i=>{console.error(`Error from process secundary: ${i}`),e.webview.postMessage({command:"error",message:i})})}async function R(s,e,t){e.onDidDispose(()=>{console.log("Disposing panel"),t.splice(t.indexOf(e),1),i&&(i.kill("SIGCONT"),i.kill("SIGTERM")),o&&(o.kill("SIGCONT"),o.kill("SIGTERM"))}),e.webview.html=P(s);let i=(0,u.spawn)("ros2",["topic","echo",s]),o=(0,b.exec)("ros2 topic info "+s+" --verbose");i.stdout?.on("data",n=>{if(n.length>1e4){n=n.slice(0,1e4),n=`Unable to visualize the entire message. The message is too big. 

`,e.webview.postMessage({command:"error",message:n.toString()});return}n.toString().includes("fastrtps_port")||e.webview.postMessage({command:"update",message:n.toString()})}),i.stderr?.on("data",n=>{console.error(`Error: ${n}`),e.webview.postMessage({command:"error",message:n})}),i.on("exit",n=>{console.log(`Process exited with code: ${n}`),e.webview.postMessage({command:"exit",message:`The command has exited with code ${n}.`})}),o.stdout?.on("data",n=>{n.toString().includes("fastrtps_port")||(e.webview.postMessage({command:"pushInfo",message:n}),o.kill())}),o.stderr?.on("data",n=>{console.error(`Error from process secundary: ${n}`),e.webview.postMessage({command:"error",message:n})}),e.onDidChangeViewState(n=>{n.webviewPanel.visible?(i&&i.kill("SIGCONT"),o&&o.kill("SIGCONT"),N(s,e)):(i&&i.kill("SIGSTOP"),o&&o.kill("SIGSTOP"))}),e.webview.postMessage({command:"hideAdvanced",message:"Advanced mode disabled!"})}async function L(s,e){e.webview.html=P(s);let t=(0,u.spawn)("ros2",["topic","hz",s]),i=(0,u.spawn)("ros2",["topic","bw",s]);e.webview.postMessage({command:"showAdvanced",message:"Advanced mode enabled!"}),e.onDidDispose(()=>{t&&(t.kill("SIGCONT"),t.kill("SIGTERM")),i&&(i.kill("SIGCONT"),i.kill("SIGTERM"))}),t.stdout?.on("data",o=>{o.toString().includes("fastrtps_port")||e.webview.postMessage({command:"updateHz",message:o.toString()})}),t.stderr?.on("data",o=>{console.error(`Error: ${o}`),e.webview.postMessage({command:"error",message:o})}),t.on("exit",o=>{console.log(`Process exited with code: ${o}`),e.webview.postMessage({command:"exit",message:`The command has exited with code ${o}.`})}),i.stdout?.on("data",o=>{o.toString().includes("fastrtps_port")||o.toString().includes("Subscribed")||e.webview.postMessage({command:"updateBw",message:o.toString()})}),i.stderr?.on("data",o=>{console.error(`Error: ${o}`),e.webview.postMessage({command:"error",message:o})}),e.onDidChangeViewState(o=>{if(o.webviewPanel.visible){t.kill("SIGCONT"),i.kill("SIGCONT"),e.webview.postMessage({command:"showAdvanced",message:"Advanced mode enabled!"});return}else t.kill("SIGSTOP"),i.kill("SIGSTOP")})}function P(s){let e=C.join(__dirname,"..","media","webview.html"),t=I.readFileSync(e,"utf8");return t=t.replace("${topic}",s),t}0&&(module.exports={activate});
