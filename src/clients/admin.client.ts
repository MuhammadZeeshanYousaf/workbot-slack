import jwt from 'jsonwebtoken';
import { STATUSCODE, WorkhubUser } from '~/globals';
import { BaseClient } from './base.client';

class AdminClient extends BaseClient {
  private AdminSecret!: string;
  private ClientKey!: string;

  constructor() {
    super(process.env.ADMIN_API_URL!);
    this.AdminSecret = process.env.ADMIN_JWT_SECRET!;
    this.ClientKey = process.env.ADMIN_CLIENT_KEY!;
  }

  async getUserToken(email: string): Promise<WorkhubUser> {
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

      let userData: WorkhubUser = jwt.verify(token, this.AdminSecret) as WorkhubUser;
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
      userData.accessToken = token;
      userData.tokenExpirationTime = new Date().getTime() + oneDayInMilliseconds;

      return userData;
    } catch (e) {
      if (this.hasStatus(e, STATUSCODE.NOT_FOUND)) {
        throw { message: "You don't have an existing account on WorkHub", statusCode: STATUSCODE.NOT_FOUND };
      } else {
        throw { message: e?.response?.data?.message, statusCode: e?.response?.status };
      }
    }
  }

  async getUserCompanies(email: string, token: string) {
    try {
      //   this.axios.defaults.baseURL = process.env.ADMIN_API_URL;

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
      throw { status: e?.response?.status, message: e?.response?.data };
    }
  }
}

export const adminClient = new AdminClient();
