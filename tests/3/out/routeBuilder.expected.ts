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
};
