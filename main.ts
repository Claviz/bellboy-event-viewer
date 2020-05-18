import { IBellboyEvent } from 'bellboy';
import { app, BrowserWindow, dialog, ipcMain, Menu, screen } from 'electron';
import * as express from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as url from 'url';

import { ViewerEvent } from './src/app/models/viewer-event';
import { JobResume } from './src/app/models/job-resume';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

Menu.setApplicationMenu(Menu.buildFromTemplate([
  {
    role: 'fileMenu',
    submenu: [{
      label: 'Upload log',
      click: () => {
        dialog.showOpenDialog({ properties: ['openFile'] }).then(async (value) => {
          const path = value.filePaths[0];
          if (path) {
            const content = await fs.readFile(value.filePaths[0], { encoding: 'utf8' });
            const contentSplit = content.split('\n');
            const toSend: ViewerEvent[] = [];
            for (let i = 0; i < contentSplit.length; i++) {
              try {
                const event = JSON.parse(contentSplit[i]) as IBellboyEvent;
                toSend.push(convertBellboyEventToViewerEvent(event));
              } catch (err) { }
            }
            win.webContents.send('events', toSend);
          }
        })
      }
    }, {
      label: 'Toggle theme',
      click: () => {
        win.webContents.send('toggle-theme');
      }
    }]
  },
]));

function createWindow(): BrowserWindow {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

  } else {
    win.loadURL(url.format({
      pathname: join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  startServer();

  return win;
}

function convertBellboyEventToViewerEvent(event: IBellboyEvent): ViewerEvent {
  return {
    ...event,
    eventArgumentsStringified: JSON.stringify(event.eventArguments, null, 4),
    jobId: (event.jobName ? `${event.jobName} ` : '') + event.jobId,
  }
}

function startServer() {
  const server = express();
  server.use(express.json({ limit: '100mb' }));
  const responses: { [jobId: string]: express.Response<any>; } = {};

  function addJob(jobId: string, res: express.Response<any>) {
    responses[jobId] = res;
    win.webContents.send('add-live-jobs', [jobId]);
  }

  function removeJob(jobId: string) {
    delete responses[jobId];
    win.webContents.send('remove-live-jobs', [jobId]);
  }

  server.post('/', function (req, res) {
    const { events, reportFinished } = req.body as { events: IBellboyEvent[]; reportFinished: boolean; };
    const viewerEvent: ViewerEvent[] = events.map(x => convertBellboyEventToViewerEvent(x));
    win.webContents.send('events', viewerEvent);
    addJob(viewerEvent[0].jobId, res);
    req.on('close', () => {
      removeJob(viewerEvent[0].jobId);
    });
    if (reportFinished) {
      res.send();
    }
  });

  server.listen(3041).setTimeout();

  ipcMain.on('answer', (event, jobResume: JobResume) => {
    responses[jobResume.jobId]?.send(jobResume.condition);
  });

  ipcMain.on('request-available-jobs', (event) => {
    win.webContents.send('add-live-jobs', Object.keys(responses));
  });
}

try {

  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    // installExtension(REDUX_DEVTOOLS)
    setTimeout(createWindow, 400);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });


} catch (e) {
  // Catch Error
  // throw e;
}
