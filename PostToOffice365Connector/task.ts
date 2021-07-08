import taskLib = require('azure-pipelines-task-lib/task');
// import { ApplicationInsights, IEventTelemetry } from '@microsoft/applicationinsights-web'
import sendpackage = require('./sendpackage');

// const appInsights = new ApplicationInsights({
//     config: {
//         instrumentationKey: '9365c5e3-3a70-41e3-8974-b9a86bd3576a'
//         /* ...Other Configuration Options... */
//     }
// });
// appInsights.loadAppInsights();

// let eventTelemetry: IEventTelemetry = {
//     name: 'Your Mother'
// }

// appInsights.trackEvent(eventTelemetry);


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
catch (err) {
    taskLib.setResult(taskLib.TaskResult.Failed, err.message)
}