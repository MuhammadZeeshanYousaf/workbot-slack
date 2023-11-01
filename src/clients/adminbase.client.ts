import jwt from 'jsonwebtoken';
import { STATUSCODE, WorkhubUser } from '~/globals';
import { BaseClient } from './base.client';

export class AdminBaseClient extends BaseClient {
  private AdminSecret!: string;
  private ClientKey!: string;

  constructor() {
    super(process.env.ADMIN_API_URL!);
    this.AdminSecret = process.env.ADMIN_JWT_SECRET!;
    this.ClientKey = process.env.ADMIN_CLIENT_KEY!;
  }

  private async makeToken() {
    return jwt.sign({ appId: this.ClientKey }, this.AdminSecret, { noTimestamp: true });
  }

  async getUserWithEmail(email?: string): Promise<WorkhubUser> {
    try {
      const newToken = await this.makeToken();

      const {
        status,
        data: { token }
      } = await this.axios.post(
        '/auth/user_token',
        { email },
        {
          headers: { Authorization: `Bearer ${newToken}` }
        }
      );

      const userData = jwt.verify(token, this.AdminSecret) as WorkhubUser;

      const workhubUser: WorkhubUser = {
        email: userData.email,
        fullName: userData.fullName,
        uuid: userData.uuid,
        userToken: token
      };

      return workhubUser;
    } catch (e) {
      if (this.hasStatus(e, STATUSCODE.NOT_FOUND)) {
        throw { message: "You don't have an existing account on WorkHub", statusCode: STATUSCODE.NOT_FOUND };
      } else {
        throw { message: e?.response?.data?.message, statusCode: e?.response?.status };
      }
    }
  }

  async getUserCompanies(email?: string, token: string | null = null) {
    try {
      if (token !== undefined || token !== null || token !== '') token = await this.makeToken();

      const {
        status,
        data: { 'hydra:member': companies }
      } = await this.axios.get('/users', {
        params: { email, groups: ['company', 'companyDetail'] },
        headers: { Authorization: `Bearer ${token}` }
      });

      return {
        status: status ? status : STATUSCODE.SUCCESS,
        companies: companies?.length > 0 ? companies[0]?.companies : []
      };
    } catch (e) {
      return { status: e?.response?.status, message: e?.response?.data };
    }
  }
}

export const adminBaseClient = new AdminBaseClient();
