import { TelemetryClient } from 'applicationinsights';
import taskLib = require('azure-pipelines-task-lib/task');
import request = require('request');

export function send(url: string, body: any, telemetryClient?: TelemetryClient): void {
    let requestData = {
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: body
    };

    request(requestData, function (error: any, response: request.RequestResponse, body: any) {
        taskLib.debug(`Request Body: ${response.request.body}`);
        taskLib.debug(`Response Status Code: ${response.statusCode}`);
        taskLib.debug(`Response Body: ${response.body}`);
        taskLib.debug(`Response Headers: ${JSON.stringify(response.headers)}`);

        if (response.statusCode === 200) {
            // Calls return `1` when successful, so silly
            if (response.body !== 1) {
                taskLib.warning(response.body);
            }

            if (telemetryClient) {
                telemetryClient.trackEvent({
                    name: 'Webhook sent',
                    properties: {
                        responseCode: response.statusCode,
                        responseBody: response.body
                    }
                });
            }
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
