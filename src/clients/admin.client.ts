import { STATUSCODE, WorkHubCompany, WorkhubUser } from '~/globals';
import { AdminBaseClient } from './adminbase.client';
class AdminClient extends AdminBaseClient {
  private workhubCompanies: Array<WorkHubCompany>;

  constructor() {
    super();
    this.workhubCompanies = [];
  }

  private async getCompaniesCache(key: string) {
    // write redis logic to get companies from cache
  }

  private async getUserCache(key: string) {
    // write redis logic to get user data from cache
  }

  async fetchUserCompanies(email: string, token: string | null = null): Promise<Array<WorkHubCompany>> {
    const cache = this.getCompaniesCache(email);
    // Check the companies from cache first

    const { status, companies } = await this.getUserCompanies(email, token);

    if (companies !== undefined && status === STATUSCODE.SUCCESS) {
      this.workhubCompanies = companies.map(company => {
        return { name: company.name, uuid: company.uuid } as WorkHubCompany;
      });
    }

    return Promise.resolve(this.workhubCompanies);
  }

  async fetchUserData(email: string): Promise<WorkhubUser> {
    const cacheUser = this.getUserCache(email);
    // Check the user data from cache first

    return await this.getUserWithEmail(email);
  }
}

export const adminClient = new AdminClient();
