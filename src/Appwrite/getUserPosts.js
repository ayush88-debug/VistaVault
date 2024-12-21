import conf from "@/conf/conf";
import database from "./database";
import { Query } from "appwrite";



export const getUserPost = async (userData) => {
    try {
      return await database.listDocuments(conf.databaseId, conf.collectionId, [
        Query.equal("userID", userData.$id),
      ]);
    } catch (err) {
      console.log("Error :: getAllPost: ", err.message);
    }
};