import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import taskLib = require('azure-pipelines-task-lib/task');
import environment = require('./environment');
import sendPackage = require('./sendPackage');

const appInsights = new ApplicationInsights({
    config: {
        connectionString: environment.applicationInsightsConnectionString,
        disableCorrelationHeaders: true
    }
});
appInsights.loadAppInsights();

type webhookPayload = {
    summary?: string
    title?: string
    text: string
    themeColor?: string
}

try {
    let webhookUrl: string = taskLib.getInput('url', true);
    let title: string = taskLib.getInput('title', false);
    let msg: string = taskLib.getInput('msg', true);
    let themeColor: string = taskLib.getInput('themeColor', false);

    let payload: webhookPayload = {
        "summary": title === '' || undefined ? null : title,
        "title": title,
        "text": msg,
        "themeColor": themeColor
    };

    await sendPackage.send(webhookUrl, payload, appInsights);
}
catch (err) {
    taskLib.setResult(taskLib.TaskResult.Failed, err.message)

    if (err instanceof Error) {
        appInsights.trackException({ exception: err });
    } else {
        appInsights.trackException({ exception: new Error(err.message) });
    }
}

appInsights.flush();
