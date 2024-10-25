import { ECSClient, ListTasksCommand, DescribeTasksCommand, DescribeContainerInstancesCommand } from '@aws-sdk/client-ecs';
import { SSMClient, SendCommandCommand, SendCommandCommandInput } from '@aws-sdk/client-ssm';
import { S3Event } from 'aws-lambda';

const {AWS_REGION} = process.env;

// Initialize clients
const ecsClient = new ECSClient({ region: AWS_REGION });
const ssmClient = new SSMClient({ region: AWS_REGION });

export const handler = async (event: S3Event) => {
    try {
        // Filter for completed uploads
        const records = event.Records.filter(record => 
            record.eventName.startsWith('ObjectCreated:') &&
            !record.s3.object.key.endsWith('.temp')
        );

        if (records.length === 0) return;

        // Get the ECS tasks
        const listTasksCommand = new ListTasksCommand({
            cluster: process.env.ECS_CLUSTER,
            serviceName: process.env.ECS_SERVICE
        });
        
        const tasks = await ecsClient.send(listTasksCommand);
        if (!tasks.taskArns || tasks.taskArns.length === 0) {
            throw new Error('No tasks found');
        }

        // Get task details
        const describeTasksCommand = new DescribeTasksCommand({
            cluster: process.env.ECS_CLUSTER,
            tasks: tasks.taskArns
        });
        
        const taskDetails = await ecsClient.send(describeTasksCommand);
        if (!taskDetails.tasks) { 
            throw new Error('No taskDetails.tasks!');
        }

        const containerInstanceArn = taskDetails.tasks[0].containerInstanceArn;

       if (!containerInstanceArn) { 
            throw new Error('No containerInstanceArn!');
        }

        // Get container instance details
        const describeContainerCommand = new DescribeContainerInstancesCommand({
            cluster: process.env.ECS_CLUSTER,
            containerInstances: [containerInstanceArn]
        });
        
        const containerInstance = await ecsClient.send(describeContainerCommand);

        if (!containerInstance.containerInstances) { 
            throw new Error('No containerInstance!');
        }

        const ec2InstanceId = containerInstance.containerInstances[0].ec2InstanceId;

        // Prepare and execute S3 sync command
        const s3SyncCommand = [
            'aws s3 sync',
            `s3://${process.env.S3_BUCKET}/${process.env.S3_PREFIX}`,
            process.env.HOST_VOLUME_PATH,
            '--delete'
        ].join(' ');

        if (!ec2InstanceId) {
            throw new Error('No ec2InstanceId!');
        }

        const sendCommandParams: SendCommandCommandInput = {
            DocumentName: 'AWS-RunShellScript',
            Parameters: {
                'commands': [s3SyncCommand]
            },
            InstanceIds: [ec2InstanceId]
        };

        const sendCommandCommand = new SendCommandCommand(sendCommandParams);
        await ssmClient.send(sendCommandCommand);

        return {
            statusCode: 200,
            body: JSON.stringify('Successfully initiated S3 sync')
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
