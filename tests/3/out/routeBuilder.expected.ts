export type RouteBuilder = {
  blog: {
    slug: {
      getPath: (slug: string) => string;
    },
  },
  dashboard: {
    analytics: {
      getPath: () => string;
    },
    settings: {
      password: {
        getPath: () => string;
      },
      profile: {
        getPath: () => string;
      },
    },
    uploads: {
      rest: {
        getPath: (rest: string[]) => string;
      },
    },
  },
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
  test: {
    rest: {
      getPath: (rest: string[]) => string;
    },
  },
};

export const routeBuilder: RouteBuilder = {
  blog: {
    slug: {
      getPath: (slug) => `/blog/${slug}`,
    },
  },
  dashboard: {
    analytics: {
      getPath: () => `/dashboard/analytics`,
    },
    settings: {
      password: {
        getPath: () => `/dashboard/settings/password`,
      },
      profile: {
        getPath: () => `/dashboard/settings/profile`,
      },
    },
    uploads: {
      rest: {
        getPath: (rest) => `/dashboard/uploads/${rest.join('/')}`,
      },
    },
  },
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
  test: {
    rest: {
      getPath: (rest) => `/test/${rest.join('/')}`,
    },
  },
};
