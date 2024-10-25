// import { ECSClient, ListTasksCommand, DescribeTasksCommand, DescribeContainerInstancesCommand } from '@aws-sdk/client-ecs';
// import { SSMClient, SendCommandCommand, SendCommandCommandInput } from '@aws-sdk/client-ssm';
 import { S3Event } from 'aws-lambda';


export const handler = async (event: S3Event) => {
    try {

        return {
            statusCode: 200,
            body: JSON.stringify('Successfully initiated S3 sync')
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
