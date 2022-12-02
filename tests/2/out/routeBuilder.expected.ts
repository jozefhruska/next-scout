export type RouteBuilder = {
  getPath: () => string;
  contactUs: {
    getPath: () => string;
  },
  projects: {
    pid: {
      rest: {
        getPath: (pid: string, rest: string[]) => string;
      },
    },
  },
  services: {
    slug: {
      getPath: (slug: string) => string;
    },
  },
};

export const routeBuilder: RouteBuilder = {
  getPath: () => `/`,
  contactUs: {
    getPath: () => `/contact-us`,
  },
  projects: {
    pid: {
      rest: {
        getPath: (pid, rest) => `/projects/${pid}/${rest.join('/')}`,
      },
    },
  },
  services: {
    slug: {
      getPath: (slug) => `/services/${slug}`,
    },
  },
};
