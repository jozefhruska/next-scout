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
};
