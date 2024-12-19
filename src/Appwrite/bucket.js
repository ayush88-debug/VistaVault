import conf from "@/conf/conf";
import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint(conf.appwriteEndpoint) 
    .setProject(conf.projectId); 

const storage = new Storage(client);
export default storage
