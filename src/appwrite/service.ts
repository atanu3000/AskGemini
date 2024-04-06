import { ID, Account, Client } from 'appwrite';
import { APPWRITE } from '../../API';


const appwriteClient = new Client();

const APPWRITE_ENDPOINT: string = APPWRITE.ENDPOINT;
const APPWRITE_PROJECT_ID: string = APPWRITE.PROJECT_ID;

type CreatUserAccount = {
    email: string;
    password: string;
    name: string;
}

type LoginUserAccount = {
    email: string;
    password: string;
}

class AppwriteService {
    account;

    constructor() {
        appwriteClient
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID)

        this.account = new Account(appwriteClient)
    }

    async CreatAccount({ email, password, name }: CreatUserAccount) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
            if (userAccount) {
                return this.LoginAccount({ email, password })
            } else {
                return userAccount
            }

        } catch (error) {
            console.log("Appwrite :: CreateAccount() error: " + error);

        }
    }

    async LoginAccount({ email, password }: LoginUserAccount) {
        // try {
            return await this.account.createEmailPasswordSession(email, password);
        // } catch (error) {
        //     console.log("Appwrite :: LoginAccount() error: " + error);
        // }
    }

    async GetCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite :: GetCurrentUser() error: " + error);
        }
    }

    async LogoutUser() {
        try {
            return await this.account.deleteSession('current');
        } catch (error) {
            console.log("Appwrite :: LogoutUser() error: " + error);
        }
    }
}

export default AppwriteService;
