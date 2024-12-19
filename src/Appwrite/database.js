import conf from "@/conf/conf";
import { Client, Databases } from "appwrite";

const client = new Client()
    .setEndpoint(conf.appwriteEndpoint) 
    .setProject(conf.projectId);

const database = new Databases(client);
export default database