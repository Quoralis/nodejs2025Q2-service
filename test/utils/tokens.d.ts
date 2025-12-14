import { SignOptions } from 'jsonwebtoken';
import 'dotenv/config';
declare const generateRefreshToken: (payload: any, options: SignOptions) => string;
export default generateRefreshToken;
