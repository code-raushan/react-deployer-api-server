import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import express, { Request, Response } from 'express';
import { generateSlug } from 'random-word-slugs';
import config from './config';

const app = express();

const ecsClient = new ECSClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    }
});

const taskConfig = {
    cluster: config.ECS_CLUSTER,
    task: config.ECS_TASK,
}
app.use(express.json());
app.post('/deploy', async (req: Request, res: Response) => {
    const gitURL = req.body.gitURL;
    const projectId = generateSlug();

    const command = new RunTaskCommand({
        cluster: taskConfig.cluster,
        taskDefinition: taskConfig.task,
        launchType: 'FARGATE',
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-0029390335db9892e', 'subnet-0ff6affa26a7f4d87', 'subnet-0cdbfe9f8343a2f72'],
                securityGroups: ['sg-0b6dfbb70b557f215']
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: 'react-deployer-image',
                    environment: [
                        {
                            name: 'GIT_REPO_URL',
                            value: gitURL
                        },
                        {
                            name: 'PROJECT_ID',
                            value: projectId
                        }
                    ]

                }
            ]
        }
    });

    await ecsClient.send(command);

    res.json({ status: 'queued', data: { projectInfo: `http://${projectId}.localhost:9000` } })
})

app.listen(8888, () => {
    console.log(`API server is listening at http://localhost:8888`)
})
