import { STATUSCODE, WorkHubCompany, WorkhubUser } from '~/globals';
import { AdminBaseClient } from './adminbase.client';
import { getCacheClient } from './redis.client';

class AdminClient extends AdminBaseClient {
  private workhubCompanies: Array<WorkHubCompany>;
  private workhubUser: WorkhubUser;

  constructor() {
    super();
    this.workhubCompanies = [];
    this.workhubUser = { userToken: '', uuid: '' };
  }

  async fetchUserCompanies(email: string, token: string | null = null): Promise<Array<WorkHubCompany>> {
    const companiesCache = await this.getCompaniesCache(email);

    if (!companiesCache) {
      const { status, companies } = await this.getUserCompanies(email, token);

      if (companies !== undefined && status === STATUSCODE.SUCCESS) {
        this.workhubCompanies = companies.map(company => {
          return { name: company.name, uuid: company.uuid } as WorkHubCompany;
        });
        await this.setCompaniesCache(email);
      }
    } else if (companiesCache) {
      return companiesCache;
    }

    return this.workhubCompanies;
  }

  async fetchUserData(email: string): Promise<WorkhubUser> {
    const cacheUser = await this.getUserCache(email);
    const userToken = cacheUser?.userToken,
      userUuid = cacheUser?.uuid;

    if (
      userToken === null ||
      userToken === undefined ||
      userToken == 'null' ||
      userToken == '' ||
      userUuid === null ||
      userUuid === undefined ||
      userUuid == 'null' ||
      userUuid === ''
    ) {
      try {
        this.workhubUser = await this.getUserWithEmail(email);
        await this.setUserCache(email);
      } catch {
        return this.workhubUser;
      }
    } else if (cacheUser) {
      return cacheUser as WorkhubUser;
    }

    return this.workhubUser;
  }

  // Private methods

  private async getCompaniesCache(email: string): Promise<Array<WorkHubCompany> | null> {
    const cacheClient = await getCacheClient();
    const companies = await cacheClient.get(`${process.env.REDIS_PREFIX}:${email}:companies`);
    return companies && JSON.parse(companies);
  }

  private async setCompaniesCache(email: string) {
    const cacheClient = await getCacheClient();
    await cacheClient.set(`${process.env.REDIS_PREFIX}:${email}:companies`, JSON.stringify(this.workhubCompanies), {
      EX: 86400 // Expiry (86400 sec = 1 day)
    });
  }

  private async getUserCache(email: string): Promise<WorkhubUser | null> {
    const cacheClient = await getCacheClient();
    const user = await cacheClient.get(`${process.env.REDIS_PREFIX}:${email}:user`);
    return user && JSON.parse(user);
  }

  private async setUserCache(email: string) {
    const cacheClient = await getCacheClient();
    await cacheClient.set(`${process.env.REDIS_PREFIX}:${email}:user`, JSON.stringify(this.workhubUser), {
      EX: 86400 // Expiry (86400 sec = 1 day)
    });
  }
}

export const adminClient = new AdminClient();
