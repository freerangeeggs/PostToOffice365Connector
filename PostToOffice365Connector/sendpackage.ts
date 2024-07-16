import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import taskLib = require('azure-pipelines-task-lib/task');
import request = require('request');

export function send(url: string, body: any, appInsights?: ApplicationInsights): void {
    let requestData = {
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: body
    };

    const startTime = Date.now();

    request(requestData, function (error: any, response: request.RequestResponse, body: any) {
        const duration = Date.now() - startTime;

        taskLib.debug(`Request Body: ${response.request.body}`);
        taskLib.debug(`Response Status Code: ${response.statusCode}`);
        taskLib.debug(`Response Body: ${response.body}`);
        taskLib.debug(`Response Headers: ${JSON.stringify(response.headers)}`);

        if (response.statusCode === 200) {
            // Calls return `1` when successful, so silly
            if (response.body !== 1) {
                taskLib.warning(response.body);
            }

            appInsights?.trackEvent({
                name: 'Webhook sent',
                properties: {
                    responseCode: response.statusCode,
                    responseBody: response.body,
                    duration: duration
                }
            });
        } else {
            if (error) {
                throw new Error(response.statusCode.toString() + ": " + error.message);
            }
            else {
                throw new Error(response.statusCode.toString() + ": " + response.request.body);
            }
        }
    });
}
