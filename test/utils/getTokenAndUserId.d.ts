declare const getTokenAndUserId: (request: any) => Promise<{
    token: string;
    accessToken: any;
    refreshToken: any;
    mockUserId: any;
    login: string;
}>;
export default getTokenAndUserId;
