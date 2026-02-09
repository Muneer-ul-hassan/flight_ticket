import { setupApp } from "../server/app";

export default async (req: any, res: any) => {
    const app = await setupApp();
    return app(req, res);
};
