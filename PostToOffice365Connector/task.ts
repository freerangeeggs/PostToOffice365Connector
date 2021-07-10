import appInsights = require('applicationinsights');
import taskLib = require('azure-pipelines-task-lib/task');
import environment = require('./environment');
import sendPackage = require('./sendPackage');


appInsights.setup(environment.applicationInsightsInstrumentationKey)
    .setAutoDependencyCorrelation(false)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(false)
    .setAutoCollectConsole(true)
    .setSendLiveMetrics(false)
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .start();

const telemetryClient = appInsights.defaultClient;

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

    sendPackage.send(webhookUrl, payload, telemetryClient);
}
catch (err) {
    taskLib.setResult(taskLib.TaskResult.Failed, err.message)

    if (err instanceof Error) {
        telemetryClient.trackException({ exception: err });
    } else {
        telemetryClient.trackException({ exception: new Error(err.message) });
    }
}

telemetryClient.flush();

appInsights.dispose();
