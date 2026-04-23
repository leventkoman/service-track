import {SetPassword} from "@sts/models/set-password.model";

export type VerifyTokenType = Omit<SetPassword, 'password'>;