import {
    DynamoDBClient,
    UpdateItemCommand,
    GetItemCommand,
} from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
    const ToDoid = event.pathParameters.ToDoid;
    console.log("Received event : ", ToDoid);
    const requestBody = JSON.parse(event.body);

    try {
        const currentItem = await getTodoById(ToDoid);

        if (!currentItem) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Todo item not found",
                }),
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            };
        }

        const timestamp = new Date().toISOString();
        await updateTodoAttributes(ToDoid, requestBody, timestamp);

        return {
            statusCode: 200,
            body: JSON.stringify({
                ToDoid: ToDoid,
                ...requestBody,
                updatedAt: timestamp,
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

const getTodoById = async (ToDoid) => {
    const params = {
        TableName: "ToDo",
        Key: {
            ToDoid: { N: ToDoid.toString() },
        },
    };
    try {
        const command = new GetItemCommand(params);
        const data = await ddbClient.send(command);

        return data.Item || null;
    } catch (error) {
        console.error("Error fetching todo:", error);
        throw error;
    }
};

const updateTodoAttributes = async (ToDoid, attributes, timestamp) => {
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    let updateExpression = "SET updatedAt = :updatedAt";

    expressionAttributeValues[":updatedAt"] = { S: timestamp };

    for (const [key, value] of Object.entries(attributes)) {
        updateExpression += `, #${key} = :${key}`;
        expressionAttributeNames[`#${key}`] = key;

        if (typeof value === "boolean") {
            expressionAttributeValues[`:${key}`] = { BOOL: value };
        } else if (typeof value === "string") {
            expressionAttributeValues[`:${key}`] = { S: value };
        }
        // Add other types as needed, e.g., number
    }

    const params = {
        TableName: "ToDo",
        Key: {
            ToDoid: { N: ToDoid.toString() },
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "UPDATED_NEW",
    };

    const command = new UpdateItemCommand(params);
    await ddbClient.send(command);
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
