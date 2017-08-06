import taskLib = require('vsts-task-lib/task');
import sendpackage = require('./sendpackage');

try {
    let webhookUrl: string = taskLib.getInput('url', true);
    let title: string = taskLib.getInput('title', false);
    let msg: string = taskLib.getInput('msg', true);
    let themeColor: string = taskLib.getInput('themeColor', false);

    let payload = {
        "title": title,
        "text": msg,
        "themeColor": themeColor
    };

    sendpackage.send(webhookUrl, payload);
}
catch(err) {
    taskLib.setResult(taskLib.TaskResult.Failed, err.message)
}