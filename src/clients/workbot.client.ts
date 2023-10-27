import { BaseClient } from './base.client';

class Workbot extends BaseClient {
  constructor() {
    super(process.env.WORKBOT_API_URL!);
  }

  async getQueryResponse({ userQuery, userToken, companyUuid }) {
    try {
      const body = await this.axios.get(`/companies/${companyUuid}/query`, {
        params: { query: userQuery },
        headers: { Authorization: `Bearer ${userToken}` }
      });
      return body.data;
    } catch (e) {
      return `Something went wrong: ${e.message}`;
    }
  }
}

export const workbotClient = new Workbot();
