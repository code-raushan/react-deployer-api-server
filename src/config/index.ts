import dotenv from "dotenv";
dotenv.config();

const config = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID! as string,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY! as string,
    AWS_REGION: process.env.AWS_REGION! as string,
    ECS_CLUSTER: process.env.ECS_CLUSTER! as string,
    ECS_TASK: process.env.ECS_TASK! as string,
}

export default config;