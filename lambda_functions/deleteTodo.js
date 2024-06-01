import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
    const ToDoid = event.pathParameters.ToDoid;

    try {
        await deleteTodoById(ToDoid);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Todo item deleted successfully",
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

const deleteTodoById = async (ToDoid) => {
    const params = {
        TableName: "ToDo",
        Key: {
            ToDoid: { N: ToDoid.toString() },
        },
    };
    const command = new DeleteItemCommand(params);
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
