import conf from "../conf/conf";

import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint(conf.appwriteEndpoint)
    .setProject(conf.projectId); 

const account = new Account(client);
export default account