import { z, TypeOf } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_APPWRITE_API_KEY: z.string().min(26),
  NEXT_APPWRITE_PROJECT_ID: z.string().min(1),
  NEXT_APPWRITE_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: z.string().min(1),
  NEXT_PUBLIC_APPWRITE_WORKSPACES_ID: z.string().min(1),
  NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID: z.string().min(1),
  NEXT_PUBLIC_APPWRITE_MEMBERS_ID: z.string().min(1),
});

type AppEnv = TypeOf<typeof envSchema>;
declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppEnv {}
  }
}

const env = envSchema.parse(process.env);

Object.assign(process.env, env);

export { env };
