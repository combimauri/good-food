export class Token {
    private accessToken: string;
    private tokenType: string;
    private userName: string;

    constructor(accessToken, tokenType, userName) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.userName = userName;
    }
    public getAccessToken(): string {
        return this.accessToken;
    }

    public getTokenType(): string {
        return this.tokenType;
    }

    public getUserName(): string {
        return this.userName;
    }
}
