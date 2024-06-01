/* global BigInt */
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
    const ToDoid = generateNumericUUID();
    console.log("Received event (", ToDoid, "): ", event);

    const requestBody = JSON.parse(event.body);
    const { title, description } = requestBody;

    try {
        const timestamp = new Date().toISOString();
        await recordTodo(ToDoid, title, description, false, timestamp);

        return {
            statusCode: 201,
            body: JSON.stringify({
                ToDoid: ToDoid,
                title: title,
                description: description,
                createdAt: timestamp,
                updatedAt: timestamp,
                Complete: false,
            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const recordTodo = async (ToDoid, title, description, complete, timestamp) => {
    const params = {
        TableName: "ToDo",
        Item: {
            ToDoid: { N: ToDoid.toString() },
            title: { S: title },
            description: { S: description },
            createdAt: { S: timestamp },
            updatedAt: { S: timestamp },
            complete: { BOOL: complete },
        },
    };
    const command = new PutItemCommand(params);
    await ddbClient.send(command);
};

const generateNumericUUID = () => {
    // Convert UUID to a numeric value
    const uuid = randomUUID().replace(/-/g, "");
    const numericUuid = BigInt("0x" + uuid).toString();
    return parseInt(numericUuid.slice(0, 15));
};

const errorResponse = (errorMessage, awsRequestId) => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };
};
