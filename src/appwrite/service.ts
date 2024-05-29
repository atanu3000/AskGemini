import { ID, Account, Client, Teams } from 'appwrite';
import { APPWRITE } from '../../API';

const appwriteClient = new Client();
    
const APPWRITE_ENDPOINT: string = APPWRITE.ENDPOINT;
const APPWRITE_PROJECT_ID: string = APPWRITE.PROJECT_ID;

type CreatUserAccount = {
    email: string;
    phone: string;
    password?: string;
    name: string;
}

class AppwriteService {
    account;

    constructor() {
        appwriteClient
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID)

        this.account = new Account(appwriteClient)
    }

    async CreatAccount({ email, password = 'password', name}: CreatUserAccount) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password!,
                name
            )
            userAccount

        } catch (error) {
            console.log("Appwrite :: CreateAccount() error: " + error);

        }
    }

    async LoginAccount(emailOrPhone: string) {
        return await this.account.createEmailToken(ID.unique(), emailOrPhone)
    }

    async updateName(name: string) {
        return await this.account.updateName(name);
    }


    async createSession(userID: string, secret: string) {
        return await this.account.createSession(userID, secret);
    }

    async GetCurrentUser() {
        try {
            const res = await this.account.get();
            return res
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
